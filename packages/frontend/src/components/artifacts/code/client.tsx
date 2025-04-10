'use client';

import React from 'react';
import { Artifact, DataStreamDelta } from '../create-artifact';
import { UIArtifact } from '../../../hooks/useArtifactHooks';

interface CodeArtifactMetadata {
  language: string;
}

export const codeArtifact = new Artifact<'code', CodeArtifactMetadata>({
  kind: 'code',
  description: 'Useful for code snippets and examples.',
  
  initialize: async ({ researchId, setMetadata }) => {
    setMetadata({
      language: 'javascript',
    });
  },
  
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === 'code-delta') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          content: streamPart.content as string,
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
        <pre className="bg-bg-tertiary p-4 rounded-md overflow-x-auto">
          <code className={`language-${metadata.language}`}>{content}</code>
        </pre>
      </div>
    );
  },
});
