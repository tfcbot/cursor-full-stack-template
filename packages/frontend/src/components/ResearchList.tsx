'use client';

import { useGetAllResearch } from '../hooks/useResearchHooks';
import Link from 'next/link';
import { AgentTaskStatus } from '@metadata/agents/agent.schema';

export function ResearchList() {
  const { data: tasks, isLoading, isError } = useGetAllResearch();
  
  if (isLoading) {
    return (
      <div className="bg-bg-secondary p-8 rounded-lg shadow-card border border-border animate-pulse">
        <div className="h-8 bg-bg-tertiary rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-bg-tertiary"></div>
              <div className="flex-1">
                <div className="h-4 bg-bg-tertiary rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-bg-tertiary rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="bg-bg-secondary p-8 rounded-lg shadow-card border border-border">
        <h2 className="text-xl font-semibold text-error mb-4">Error Loading Tasks</h2>
        <p className="text-fg-secondary">There was an error loading your tasks. Please try again later.</p>
      </div>
    );
  }
  
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-bg-secondary p-8 rounded-lg shadow-card border border-border text-center">
        <h2 className="text-xl font-semibold text-fg-primary mb-4">No Tasks Found</h2>
        <p className="text-fg-secondary mb-6">You haven't created any tasks yet.</p>
        <Link 
          href="/"
          className="px-4 py-2 bg-accent-primary text-fg-primary rounded-md hover:bg-opacity-90 transition-colors"
        >
          Create Your First Task
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-bg-secondary p-8 rounded-lg shadow-card border border-border">
      <h2 className="text-xl font-semibold text-fg-primary mb-6">Your Tasks</h2>
      
      <div className="space-y-4">
        {tasks.map((task) => {
          const isPending = task.taskStatus === AgentTaskStatus.PENDING || task.researchStatus === AgentTaskStatus.PENDING;
          const taskId = task.taskId || task.researchId; // For backward compatibility
          
          return (
            <Link 
              key={taskId}
              href={`/research/${taskId}`}
              className="block p-4 border border-border rounded-lg hover:bg-bg-tertiary transition-colors"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-fg-primary">{task.title}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isPending 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {isPending ? 'Processing' : 'Completed'}
                </div>
              </div>
              <p className="text-sm text-fg-secondary mt-1 line-clamp-2">
                {task.content ? task.content.substring(0, 150) + '...' : 'No content available'}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
