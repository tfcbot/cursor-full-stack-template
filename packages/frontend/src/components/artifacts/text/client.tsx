'use client';

import React from 'react';
import { Artifact, DataStreamDelta } from '../create-artifact';
import { UIArtifact } from '../../../hooks/useArtifactHooks';

interface TextArtifactMetadata {
  suggestions: Array<string>;
}

export const textArtifact = new Artifact<'text', TextArtifactMetadata>({
  kind: 'text',
  description: 'Useful for text content, like research reports and articles.',
  
  initialize: async ({ researchId, setMetadata }) => {
    setMetadata({
      suggestions: [],
    });
  },
  
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === 'suggestion') {
      setMetadata((metadata) => {
        return {
          suggestions: [
            ...metadata.suggestions,
            streamPart.content as string,
          ],
        };
      });
    }
    
    if (streamPart.type === 'text-delta') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          content: draftArtifact.content + (streamPart.content as string),
          isVisible: 
            draftArtifact.status === 'streaming' &&
            draftArtifact.content.length > 400 &&
            draftArtifact.content.length < 450
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
        <div className="prose max-w-none">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-fg-secondary">
              {paragraph}
            </p>
          ))}
        </div>
        
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
