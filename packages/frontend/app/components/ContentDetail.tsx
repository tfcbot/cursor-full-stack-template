'use client';

import { useGetContent } from '../api';
import Link from 'next/link';

export function ContentDetail({ contentId }: { contentId: string }) {
  const { data: content, isLoading, isError } = useGetContent(contentId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-secondary"></div>
      </div>
    );
  }
  
  if (isError || !content) {
    return (
      <div className="bg-error bg-opacity-10 p-6 rounded-lg">
        <h2 className="text-error font-medium">Error loading content</h2>
        <p className="text-fg-secondary mt-2">Could not load the requested content.</p>
        <Link 
          href="/content" 
          className="mt-4 inline-block px-4 py-2 bg-accent-primary text-fg-primary rounded-md hover:bg-opacity-90"
        >
          Back to All Content
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl md:text-3xl font-bold text-fg-primary">{content.topic}</h1>
        <Link 
          href="/content" 
          className="text-accent-secondary hover:text-accent-tertiary text-sm"
        >
          Back to All Content
        </Link>
      </div>
      
      <div className="text-fg-tertiary text-sm">
        Generated on {new Date(content.createdAt).toLocaleDateString()} at {new Date(content.createdAt).toLocaleTimeString()}
      </div>
      
      <div className="bg-bg-secondary p-6 rounded-lg shadow-card border border-border">
        <div className="prose prose-invert prose-headings:text-fg-primary prose-p:text-fg-secondary prose-a:text-accent-secondary max-w-none">
          {content.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-4 mt-6">
        <button 
          className="px-4 py-2 bg-success text-fg-primary rounded-md hover:bg-opacity-90"
          onClick={() => {
            navigator.clipboard.writeText(content.content);
            alert('Content copied to clipboard!');
          }}
        >
          Copy to Clipboard
        </button>
        
        <Link
          href={`/`}
          className="px-4 py-2 bg-accent-primary text-fg-primary rounded-md hover:bg-opacity-90"
        >
          Generate New Content
        </Link>
      </div>
    </div>
  );
} 