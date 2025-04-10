'use client';

import React from 'react';
import { Artifact, DataStreamDelta } from '../create-artifact';
import { UIArtifact } from '../../../hooks/useArtifactHooks';

interface CodeArtifactMetadata {
  language: string;
  suggestions: Array<string>;
}

export const codeArtifact = new Artifact<'code', CodeArtifactMetadata>({
  kind: 'code',
  description: 'Useful for code snippets and examples.',
  
  initialize: async ({ researchId, setMetadata }) => {
    setMetadata({
      language: 'javascript',
      suggestions: [],
    });
  },
  
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === 'suggestion') {
      setMetadata((metadata) => {
        return {
          ...metadata,
          suggestions: [
            ...(metadata.suggestions || []),
            streamPart.content as string,
          ],
        };
      });
    }
    
    if (streamPart.type === 'code-delta') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          content: streamPart.content as string,
          isVisible: 
            draftArtifact.status === 'streaming' &&
            draftArtifact.content.length > 100
              ? true
              : draftArtifact.isVisible,
          status: 'streaming',
        };
      });
    }
    
    if (streamPart.type === 'title') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          title: streamPart.content as string,
        };
      });
    }
    
    if (streamPart.type === 'id') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          researchId: streamPart.content as string,
        };
      });
    }
    
    if (streamPart.type === 'clear') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          content: '',
          status: 'streaming',
        };
      });
    }
    
    if (streamPart.type === 'finish') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          status: 'idle',
        };
      });
    }
  },
  
  content: ({
    title,
    content,
    status,
    isLoading,
    metadata,
  }) => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-bg-tertiary rounded w-3/4"></div>
          <div className="h-4 bg-bg-tertiary rounded"></div>
          <div className="h-4 bg-bg-tertiary rounded w-5/6"></div>
        </div>
      );
    }
    
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <pre className="bg-bg-tertiary p-4 rounded-md overflow-x-auto">
          <code className={`language-${metadata.language}`}>{content}</code>
        </pre>
        
        {metadata?.suggestions && metadata.suggestions.length > 0 && (
          <div className="mt-8 border-t border-border pt-4">
            <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
            <ul className="list-disc pl-5 space-y-2">
              {metadata.suggestions.map((suggestion, index) => (
                <li key={index} className="text-fg-secondary">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
});
