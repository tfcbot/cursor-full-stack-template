'use client';

import { useGetResearchById } from '@/src/hooks/useResearchHooks';

import Link from 'next/link';

export function ResearchDetail({ researchId }: { researchId: string }) {
  const { data: research, isLoading, isError } = useGetResearchById(researchId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-secondary"></div>
      </div>
    );
  }
  
  if (isError || !research) {
    return (
      <div className="bg-error bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-error font-medium">Error loading research</h2>
        <p className="text-fg-secondary mt-2">Could not load the requested research.</p>
        <Link 
          href="/research" 
          className="mt-4 inline-block px-4 py-2 bg-accent-primary text-fg-primary rounded-md hover:bg-opacity-90"
        >
          Back to All Research
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl md:text-3xl font-bold text-fg-primary">{research.title}</h1>
        <Link 
          href="/research" 
          className="text-accent-secondary hover:text-accent-tertiary text-sm"
        >
          Back to All Research
        </Link>
      </div>
      
      <div className="bg-bg-secondary p-6 rounded-lg shadow-card border border-border">
        <div className="prose prose-invert prose-headings:text-fg-primary prose-p:text-fg-secondary prose-a:text-accent-secondary max-w-none">
          {research.content.split('\n\n').map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-4 mt-6">
        <button 
          className="px-4 py-2 bg-success text-fg-primary rounded-md hover:bg-opacity-90"
          onClick={() => {
            navigator.clipboard.writeText(research.content);
            alert('Research copied to clipboard!');
          }}
        >
          Copy to Clipboard
        </button>
        
        <Link
          href={`/`}
          className="px-4 py-2 bg-accent-primary text-fg-primary rounded-md hover:bg-opacity-90"
        >
          Submit New Task
        </Link>
      </div>
    </div>
  );
} 