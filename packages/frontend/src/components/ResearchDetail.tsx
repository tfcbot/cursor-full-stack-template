'use client';

import { useGetResearchById } from '../hooks/useResearchHooks';
import { AgentTaskStatus } from '@metadata/agents/agent.schema';

export function ResearchDetail({ id }: { id: string }) {
  const { data: task, isLoading, isError, error } = useGetResearchById(id);
  
  if (isLoading) {
    return (
      <div className="bg-bg-secondary p-8 rounded-lg shadow-card border border-border animate-pulse">
        <div className="h-8 bg-bg-tertiary rounded w-3/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-bg-tertiary rounded w-full"></div>
          <div className="h-4 bg-bg-tertiary rounded w-full"></div>
          <div className="h-4 bg-bg-tertiary rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="bg-bg-secondary p-8 rounded-lg shadow-card border border-border">
        <h2 className="text-xl font-semibold text-error mb-4">Error Loading Task</h2>
        <p className="text-fg-secondary">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="bg-bg-secondary p-8 rounded-lg shadow-card border border-border">
        <h2 className="text-xl font-semibold text-fg-primary mb-4">Task Not Found</h2>
        <p className="text-fg-secondary">The requested task could not be found.</p>
      </div>
    );
  }
  
  const isPending = task.taskStatus === AgentTaskStatus.PENDING || task.researchStatus === AgentTaskStatus.PENDING;
  
  return (
    <div className="bg-bg-secondary p-8 rounded-lg shadow-card border border-border">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold text-fg-primary">{task.title}</h1>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isPending 
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {isPending ? 'Processing' : 'Completed'}
        </div>
      </div>
      
      {isPending ? (
        <div className="animate-pulse space-y-4 mb-8">
          <div className="h-4 bg-bg-tertiary rounded w-full"></div>
          <div className="h-4 bg-bg-tertiary rounded w-full"></div>
          <div className="h-4 bg-bg-tertiary rounded w-5/6"></div>
          <div className="h-4 bg-bg-tertiary rounded w-3/4"></div>
        </div>
      ) : (
        <div className="prose dark:prose-invert max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: formatContent(task.content) }} />
        </div>
      )}
      
      {!isPending && task.citation_links && task.citation_links.length > 0 && (
        <div className="mt-8 border-t border-border pt-4">
          <h3 className="text-lg font-semibold text-fg-primary mb-3">Sources</h3>
          <ul className="space-y-2">
            {task.citation_links.map((link, index) => (
              <li key={index} className="text-accent-primary hover:underline">
                <a href={link} target="_blank" rel="noopener noreferrer" className="break-all">
                  {formatLink(link)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Helper function to format content with line breaks
function formatContent(content: string): string {
  if (!content) return '';
  
  // Replace newlines with <br> tags
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// Helper function to format links for display
function formatLink(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    
    // Truncate pathname if it's too long
    const maxPathLength = 30;
    const displayPath = pathname.length > maxPathLength 
      ? pathname.substring(0, maxPathLength) + '...' 
      : pathname;
    
    return `${hostname}${displayPath}`;
  } catch (e) {
    // If URL parsing fails, just return the original
    return url;
  }
}
