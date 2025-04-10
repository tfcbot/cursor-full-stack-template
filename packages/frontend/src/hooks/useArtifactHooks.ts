'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';

export type ArtifactKind = 'text' | 'code';

export interface UIArtifact {
  researchId: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  isVisible: boolean;
  status: 'streaming' | 'idle';
}

export const initialArtifactData: UIArtifact = {
  researchId: '',
  title: '',
  kind: 'text',
  content: '',
  isVisible: false,
  status: 'idle',
};

type ArtifactSelector<T> = (state: UIArtifact) => T;

export function useArtifact() {
  const [artifact, setLocalArtifact] = useState<UIArtifact>(initialArtifactData);
  const [metadata, setLocalMetadata] = useState<any>(null);
  
  const setArtifact = useCallback(
    (updaterFn: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => {
      setLocalArtifact((currentArtifact) => {
        if (typeof updaterFn === 'function') {
          return updaterFn(currentArtifact);
        }
        return updaterFn;
      });
    },
    []
  );
  
  const setMetadata = useCallback(
    (updaterFn: any | ((currentMetadata: any) => any)) => {
      setLocalMetadata((currentMetadata) => {
        if (typeof updaterFn === 'function') {
          return updaterFn(currentMetadata);
        }
        return updaterFn;
      });
    },
    []
  );
  
  return useMemo(
    () => ({
      artifact,
      setArtifact,
      metadata,
      setMetadata,
    }),
    [artifact, setArtifact, metadata, setMetadata]
  );
}

export function useArtifactSelector<Selected>(selector: ArtifactSelector<Selected>) {
  const [artifact, setArtifact] = useState<UIArtifact>(initialArtifactData);
  
  const selectedValue = useMemo(() => {
    return selector(artifact);
  }, [artifact, selector]);
  
  return selectedValue;
}
