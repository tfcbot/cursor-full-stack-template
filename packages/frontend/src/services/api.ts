import { RequestTaskFormInput, RequestTaskOutput, TaskStatus } from "@metadata/agents/agent.schema";
import { randomUUID } from "crypto";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const API_CONFIG = {
  baseUrl: API_URL,
  version: '',
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
};


export const getAbsoluteUrl = async (path: string): Promise<string> => {
  return `${API_CONFIG.baseUrl}${path}`;
};

export const getHeaders = async (token?: string): Promise<HeadersInit> => {
  const headers: Record<string, string> = {
    ...API_CONFIG.defaultHeaders,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const getAllTasks = async (token?: string): Promise<RequestTaskOutput[]> => {
  const timestamp = new Date().getTime();
  const absoluteUrl = await getAbsoluteUrl(`/tasks?_t=${timestamp}`);
  try {
    const response = await fetch(absoluteUrl, {
      method: 'GET',
      headers: await getHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        return data.data;
      } else if (data.body && Array.isArray(data.body)) {
        return data.body;
      }
    }
    
    // If we reach here, the response format was unexpected
    console.error('Unexpected response format from getAllTasks:', data);
    return [];
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    return [];
  }
}

export const getTaskById = async (agentId: string, token?: string): Promise<RequestTaskOutput | null> => {
  const timestamp = new Date().getTime();
  const absoluteUrl = await getAbsoluteUrl(`/tasks/${agentId}?_t=${timestamp}`);
  try {
    const response = await fetch(absoluteUrl, {
      method: 'GET',
      headers: await getHeaders(token),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Log the raw response for debugging
    console.log('API response for task:', data);
    
    // Handle different response formats
    if (data && typeof data === 'object') {
      // Check if data is directly the task object
      if (data.agentId && data.title && data.content) {
        return data as RequestTaskOutput;
      }
      
      // Check if wrapped in data property
      if (data.data && typeof data.data === 'object') {
        return data.data as RequestTaskOutput;
      }
      
      // Check if wrapped in body property
      if (data.body && typeof data.body === 'object') {
        return data.body as RequestTaskOutput;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
}

export const postTask = async (requestData: RequestTaskFormInput, token: string): Promise<RequestTaskOutput> => {
  const absoluteUrl = await getAbsoluteUrl('/tasks');
  try {
    // Generate a client-side ID for optimistic updates
    const clientGeneratedId = typeof window !== 'undefined' ? crypto.randomUUID() : randomUUID();
    
    // Create optimistic task object
    const optimisticTask: RequestTaskOutput = {
      agentId: clientGeneratedId,
      userId: '', // Will be filled by the server
      title: `Task for: ${requestData.prompt.substring(0, 50)}...`,
      content: 'Processing your task...',
      citation_links: [],
      taskStatus: TaskStatus.PENDING,
      summary: ''
    };

    const response = await fetch(absoluteUrl, {
      method: 'POST',
      headers: await getHeaders(token),
      body: JSON.stringify({
        ...requestData,
        id: clientGeneratedId // Send the client-generated ID to the server
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to post task: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Return the server response, which should now be the pending task with the same ID
    const serverResponse = await response.json();
    
    // If the server returned a valid response, use it; otherwise, use our optimistic object
    if (serverResponse && 
        (serverResponse.agentId || 
         (serverResponse.body && serverResponse.body.agentId) || 
         (serverResponse.data && serverResponse.data.agentId))) {
      return serverResponse;
    }
    
    return optimisticTask;
  } catch (error) {
    console.error('Error posting task:', error);
    throw error;
  }
}
