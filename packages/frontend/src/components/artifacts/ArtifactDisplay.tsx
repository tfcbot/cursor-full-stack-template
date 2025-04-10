'use client';

import React, { useState, useEffect } from 'react';
import { useArtifact } from '../../hooks/useArtifactHooks';
import { artifactDefinitions } from './DataStreamHandler';

interface ArtifactDisplayProps {
  researchId: string;
  title: string;
  content: string;
}

export function ArtifactDisplay({ researchId, title, content }: ArtifactDisplayProps) {
  const { artifact, setArtifact, metadata, setMetadata } = useArtifact();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setArtifact({
      researchId,
      title,
      content,
      kind: 'text', // Default to text
      isVisible: true,
      status: 'idle',
    });
    
    setIsLoading(false);
  }, [researchId, title, content, setArtifact]);
  
  const artifactDefinition = artifactDefinitions.find(
    (definition) => definition.kind === artifact.kind,
  );
  
  if (!artifactDefinition) {
    return null;
  }
  
  const ContentComponent = artifactDefinition.content;
  
  return (
    <div className="bg-bg-secondary p-6 rounded-lg shadow-card border border-border">
      <ContentComponent
        title={artifact.title}
        content={artifact.content}
        status={artifact.status}
        isLoading={isLoading}
        metadata={metadata}
        setMetadata={setMetadata}
      />
    </div>
  );
}
