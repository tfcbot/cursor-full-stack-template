'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequestResearch } from '../hooks/useResearchHooks';
import { RequestResearchInput } from '@metadata/agents/research-agent.schema';

export function ResearchForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<RequestResearchInput>>({
    prompt: '',
  });
  
  const { mutate, isPending, isError, error } = useRequestResearch();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    mutate(formData as RequestResearchInput, {
      onSuccess: () => {
        router.push(`/research/`);
      }
    });
  };
  
  return (
    <div className="bg-bg-secondary p-8 rounded-lg shadow-card border border-border">
      <h1 className="text-2xl font-bold mb-6 text-fg-primary">Submit Research Task</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-fg-secondary mb-1">
            Research Topic
          </label>
          <input
            type="text"
            id="topic"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            required
            placeholder="Enter a topic to research"
            className="w-full px-4 py-2 bg-bg-tertiary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-fg-primary placeholder-fg-tertiary"
          />
        </div>
        
        {isError && (
          <div className="text-error text-sm">
            Error: {error instanceof Error ? error.message : 'Something went wrong'}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 px-4 bg-accent-primary text-fg-primary rounded-md font-medium ${
            isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
          }`}
        >
          {isPending ? 'Researching...' : 'Submit Research Task'}
        </button>
      </form>
    </div>
  );
} 