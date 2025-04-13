'use client';

import { useGetResearchById } from '@/src/hooks/useResearchHooks';
import Link from 'next/link';
import { useState } from 'react';

export function ResearchDetail({ researchId }: { researchId: string }) {
  const { data: research, isLoading, isError } = useGetResearchById(researchId);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Helper function to get content based on different possible response structures
  const getContent = () => {
    if (!research) return null;
    
    // Handle different possible API response formats
    if (typeof research.content === 'string') {
      return research.content;
    }
    
    // Check if content is in a nested data structure
    if (research.data && typeof research.data.content === 'string') {
      return research.data.content;
    }
    
    // Check if it's in a body property
    if (research.body && typeof research.body.content === 'string') {
      return research.body.content;
    }
    
    console.log('Unrecognized research data structure:', research);
    return null;
  };
  
  // Helper function to get title based on different possible response structures
  const getTitle = () => {
    if (!research) return 'Research';
    
    if (typeof research.title === 'string') {
      return research.title.replace(/^\*\*(.*)\*\*$/, '$1'); // Remove markdown ** if present
    }
    
    if (research.data && typeof research.data.title === 'string') {
      return research.data.title.replace(/^\*\*(.*)\*\*$/, '$1');
    }
    
    if (research.body && typeof research.body.title === 'string') {
      return research.body.title.replace(/^\*\*(.*)\*\*$/, '$1');
    }
    
    return 'Research';
  };

  // Get citations if available
  const getCitations = () => {
    if (!research) return [];
    
    if (research.citation_links && Array.isArray(research.citation_links)) {
      return research.citation_links;
    }
    
    if (research.data?.citation_links && Array.isArray(research.data.citation_links)) {
      return research.data.citation_links;
    }
    
    if (research.body?.citation_links && Array.isArray(research.body.citation_links)) {
      return research.body.citation_links;
    }
    
    return [];
  };
  
  const handleCopyToClipboard = () => {
    if (getContent()) {
      navigator.clipboard.writeText(getContent());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center p-12 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-secondary border-t-transparent"></div>
        <p className="mt-4 text-fg-secondary">Loading research...</p>
      </div>
    );
  }
  
  if (isError || !research) {
    return (
      <div className="bg-error bg-opacity-10 p-8 rounded-lg text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl text-error font-medium mt-4">Error Loading Research</h2>
        <p className="text-fg-secondary mt-2">We couldn't load the requested research.</p>
        <Link 
          href="/research" 
          className="mt-6 inline-block px-6 py-3 bg-accent-primary text-fg-primary rounded-md hover:bg-accent-secondary transition-colors"
        >
          Back to All Research
        </Link>
      </div>
    );
  }
  
  const citations = getCitations();
  const content = getContent();
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with title and back button */}
      <div className="mb-8 pb-6 border-b border-border">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-fg-primary leading-tight">{getTitle()}</h1>
          <Link 
            href="/research" 
            className="flex items-center text-accent-secondary hover:text-accent-tertiary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Research
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="bg-bg-secondary rounded-xl shadow-lg border border-border overflow-hidden">
        <div className="p-8">
          <div className="prose prose-lg prose-invert prose-headings:text-fg-primary prose-p:text-fg-secondary prose-a:text-accent-secondary max-w-none leading-relaxed">
            {content ? 
              content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))
              : <p className="text-center text-fg-tertiary py-8">No content available</p>
            }
          </div>
        </div>
        
        {/* Citations section */}
        {citations.length > 0 && (
          <div className="border-t border-border px-8 py-6 bg-bg-tertiary bg-opacity-30">
            <h3 className="text-lg font-semibold mb-3 text-fg-primary">Citations & Sources</h3>
            <ul className="space-y-2">
              {citations.map((link, index) => (
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
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button 
          className={`flex items-center px-6 py-3 rounded-md transition-colors ${
            copySuccess 
              ? 'bg-success text-white' 
              : 'bg-bg-tertiary text-fg-primary hover:bg-bg-secondary'
          }`}
          onClick={handleCopyToClipboard}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        
        <Link
          href={`/`}
          className="flex items-center px-6 py-3 bg-accent-primary text-fg-primary rounded-md hover:bg-accent-secondary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Submit New Task
        </Link>
      </div>
    </div>
  );
} 