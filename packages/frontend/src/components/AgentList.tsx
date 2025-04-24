'use client';

import Link from 'next/link';
import { useGetAllTasks } from '../hooks/useAgentHooks';
import { RequestTaskOutput } from '@metadata/agents/agent.schema';

export function AgentList() {
  const { data: taskList, isLoading, isError } = useGetAllTasks();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-secondary"></div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="bg-error bg-opacity-10 p-6 rounded-lg text-center">
        <h2 className="text-error font-medium">Error loading tasks</h2>
        <p className="text-fg-secondary mt-2">Could not load tasks at this time. Please try again later.</p>
      </div>
    );
  }
  
  if (!taskList || taskList.length === 0) {
    return (
      <div className="bg-bg-secondary bg-opacity-60 p-8 rounded-lg text-center border border-border">
        <h2 className="text-xl font-medium text-fg-primary">No tasks yet</h2>
        <p className="text-fg-secondary mt-2">Submit your first task to see it here.</p>
        <Link 
          href="/" 
          className="mt-4 inline-block px-4 py-2 bg-accent-primary text-fg-primary rounded-md hover:bg-opacity-90"
        >
          Submit Task
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fg-primary">Your Tasks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taskList.map((task: RequestTaskOutput) => (
          <Link 
            key={task.agentId}
            href={`/agent/${task.agentId}`}
            className="block bg-bg-secondary p-6 rounded-lg shadow-card border border-border hover:border-accent-tertiary transition-all"
          >
            <h2 className="text-lg font-semibold text-fg-primary mb-2 truncate">{task.title}</h2>
            <p className="text-fg-secondary line-clamp-3">{task.content.substring(0, 150)}...</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
