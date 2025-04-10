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
    if (streamPart.type === 'text-delta') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          content: draftArtifact.content + (streamPart.content as string),
          isVisible: draftArtifact.status === 'streaming',
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
      </div>
    );
  },
});
