'use client';

import { useGetTaskById } from '@/src/hooks/useAgentHooks';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { RequestTaskOutput, TaskStatus } from '@metadata/agents/agent.schema';

// Define types to handle different response formats
type TaskDataWrapper = {
  data: RequestTaskOutput;
};

type TaskBodyWrapper = {
  body: RequestTaskOutput;
};

// Union of all possible response structures
type TaskResponse = RequestTaskOutput | TaskDataWrapper | TaskBodyWrapper;

export function AgentDetail({ agentId }: { agentId: string }) {
  // Fetch task data on component mount and page refresh
  const { data: task, isLoading, isError } = useGetTaskById(agentId);
  const [copySuccess, setCopySuccess] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  
  // Cycling status messages for pending task
  const pendingStatusMessages = [
    "Gathering information...",
    "Processing your task...",
    "Analyzing relevant sources...",
    "Compiling task data...",
    "Almost there..."
  ];
  
  // Effect to cycle through status messages
  useEffect(() => {
    if (isPending()) {
      const interval = setInterval(() => {
        setStatusIndex((prevIndex) => (prevIndex + 1) % pendingStatusMessages.length);
      }, 2500);
      
      return () => clearInterval(interval);
    }
  }, [task]);

  // Helper function to check if task is pending
  const isPending = () => {
    if (!task) return false;
    
    // Cast task to TaskResponse type for type safety
    const taskData = task as unknown as TaskResponse;
    
    if ('taskStatus' in taskData && taskData.taskStatus === TaskStatus.PENDING) {
      return true;
    }
    
    if ('data' in taskData && taskData.data && 
        'taskStatus' in taskData.data && taskData.data.taskStatus === TaskStatus.PENDING) {
      return true;
    }
    
    if ('body' in taskData && taskData.body && 
        'taskStatus' in taskData.body && taskData.body.taskStatus === TaskStatus.PENDING) {
      return true;
    }
    
    return false;
  };

  // Helper function to get content based on different possible response structures
  const getContent = () => {
    if (!task) return null;
    
    // Cast task to TaskResponse type for type safety
    const taskData = task as unknown as TaskResponse;
    
    // Handle different possible API response formats
    if ('content' in taskData && typeof taskData.content === 'string') {
      return taskData.content;
    }
    
    // Check if content is in a nested data structure
    if ('data' in taskData && taskData.data && typeof taskData.data.content === 'string') {
      return taskData.data.content;
    }
    
    // Check if it's in a body property
    if ('body' in taskData && taskData.body && typeof taskData.body.content === 'string') {
      return taskData.body.content;
    }
    
    console.log('Unrecognized task data structure:', task);
    return null;
  };
  
  // Helper function to get title based on different possible response structures
  const getTitle = () => {
    if (!task) return { title: 'Task', subtitle: '' };
    
    // Cast task to TaskResponse type for type safety
    const taskData = task as unknown as TaskResponse;
    
    let title = '';
    let subtitle = '';
    
    // Extract title and possible subtitle from different data structures
    if ('title' in taskData && typeof taskData.title === 'string') {
      // Process the title text to extract main title and subtitle if possible
      const titleText = taskData.title
        .replace(/^\*\*(.*)\*\*$/, '$1') // Remove markdown ** if present
        .trim();
        
      // Handle common title patterns: "Title: Main Title" or just "Main Title"
      const titleMatch = titleText.match(/^(?:Title:\s*)?[\""]?(.+?)[\""]?$/i);
      
      title = titleMatch ? titleMatch[1] : titleText;
    }
    
    if ('data' in taskData && taskData.data && typeof taskData.data.title === 'string') {
      const titleText = taskData.data.title
        .replace(/^\*\*(.*)\*\*$/, '$1')
        .trim();
        
      const titleMatch = titleText.match(/^(?:Title:\s*)?[\""]?(.+?)[\""]?$/i);
      title = titleMatch ? titleMatch[1] : titleText;
    }
    
    if ('body' in taskData && taskData.body && typeof taskData.body.title === 'string') {
      const titleText = taskData.body.title
        .replace(/^\*\*(.*)\*\*$/, '$1')
        .trim();
        
      const titleMatch = titleText.match(/^(?:Title:\s*)?[\""]?(.+?)[\""]?$/i);
      title = titleMatch ? titleMatch[1] : titleText;
    }
    
    return { title: title || 'Task', subtitle };
  };

  // Get citations if available
  const getCitations = () => {
    if (!task) return [];
    
    // Cast task to TaskResponse type for type safety
    const taskData = task as unknown as TaskResponse;
    
    if ('citation_links' in taskData && Array.isArray(taskData.citation_links)) {
      return taskData.citation_links;
    }
    
    if ('data' in taskData && taskData.data && 
        'citation_links' in taskData.data && Array.isArray(taskData.data.citation_links)) {
      return taskData.data.citation_links;
    }
    
    if ('body' in taskData && taskData.body && 
        'citation_links' in taskData.body && Array.isArray(taskData.body.citation_links)) {
      return taskData.body.citation_links;
    }
    
    return [];
  };
  
  const handleCopyToClipboard = () => {
    if (getContent()) {
      navigator.clipboard.writeText(getContent() || '');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center p-12 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-secondary border-t-transparent"></div>
        <p className="mt-4 text-fg-secondary">Loading task...</p>
      </div>
    );
  }
  
  if (isError || !task) {
    return (
      <div className="bg-error bg-opacity-10 p-8 rounded-lg text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl text-error font-medium mt-4">Error Loading Task</h2>
        <p className="text-fg-secondary mt-2">We couldn't load the requested task.</p>
        <Link 
          href="/agent" 
          className="mt-6 inline-block px-6 py-3 bg-accent-primary text-fg-primary rounded-md hover:bg-accent-secondary transition-colors"
        >
          Back to All Tasks
        </Link>
      </div>
    );
  }
  
  const citations = getCitations();
  const content = getContent();
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back navigation link */}
      <div className="mb-4 pt-2">
        <Link 
          href="/agent" 
          className="flex items-center text-accent-secondary hover:text-accent-tertiary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Tasks
        </Link>
      </div>
      
      {/* Header with title and action buttons */}
      <div className="mb-8 pb-6 border-b border-border">
        <div>
          <div className="max-w-3xl">
            <h1 className="text-xl md:text-2xl font-bold text-fg-primary leading-tight mb-1">
              {getTitle().title}
            </h1>
            {getTitle().subtitle && (
              <p className="text-sm text-fg-tertiary">{getTitle().subtitle}</p>
            )}
          </div>
          
          {/* Action buttons below title, justified right */}
          <div className="flex gap-4 mt-4 justify-end">
            <button 
              className={`flex items-center px-4 py-2 rounded-md transition-colors text-sm ${
                copySuccess 
                  ? 'bg-success text-white' 
                  : 'bg-bg-tertiary text-fg-primary hover:bg-bg-secondary'
              }`}
              onClick={handleCopyToClipboard}
              disabled={!content}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            
            <Link
              href={`/`}
              className="flex items-center px-4 py-2 bg-accent-primary text-fg-primary rounded-md hover:bg-accent-secondary transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit New Task
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="bg-bg-secondary rounded-xl shadow-lg border border-border overflow-hidden">
        <div className="p-8">
          <div className="prose prose-lg prose-invert prose-headings:text-fg-primary prose-p:text-fg-secondary prose-a:text-accent-secondary max-w-none leading-relaxed">
            {content ? (
              content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))
            ) : isPending() ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-pulse mb-6">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-secondary border-t-transparent"></div>
                    <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-bg-secondary"></div>
                    </div>
                  </div>
                </div>
                <p className="text-fg-secondary text-center animate-pulse">
                  {pendingStatusMessages[statusIndex]}
                </p>
                <p className="text-fg-tertiary text-sm mt-4">
                  This may take a few minutes
                </p>
              </div>
            ) : (
              <p className="text-center text-fg-tertiary py-8">No content available</p>
            )}
          </div>
        </div>
        
        {/* Citations section */}
        {citations.length > 0 && (
          <div className="border-t border-border px-8 py-6 bg-bg-tertiary bg-opacity-30">
            <h3 className="text-lg font-semibold mb-3 text-fg-primary">Citations & Sources</h3>
            <ul className="space-y-2">
              {citations.map((link: string, index: number) => (
                <li key={index} className="text-sm">
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent-secondary hover:text-accent-tertiary underline break-all"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
