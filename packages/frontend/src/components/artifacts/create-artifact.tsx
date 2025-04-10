'use client';

import { Dispatch, ReactNode, SetStateAction } from 'react';
import { ArtifactKind, UIArtifact } from '../../hooks/useArtifactHooks';

export type DataStreamDelta = {
  type: 'text-delta' | 'code-delta' | 'title' | 'id' | 'finish' | 'kind' | 'clear' | 'suggestion';
  content: string | any;
};

export interface ArtifactContent<M = any> {
  title: string;
  content: string;
  status: 'streaming' | 'idle';
  isLoading: boolean;
  metadata: M;
  setMetadata: Dispatch<SetStateAction<M>>;
}

interface InitializeParameters<M = any> {
  researchId: string;
  setMetadata: Dispatch<SetStateAction<M>>;
}

type ArtifactConfig<T extends ArtifactKind, M = any> = {
  kind: T;
  description: string;
  content: React.ComponentType<ArtifactContent<M>>;
  initialize?: (parameters: InitializeParameters<M>) => void;
  onStreamPart: (args: {
    setMetadata: Dispatch<SetStateAction<M>>;
    setArtifact: Dispatch<SetStateAction<UIArtifact>>;
    streamPart: DataStreamDelta;
  }) => void;
};

export class Artifact<T extends ArtifactKind, M = any> {
  readonly kind: T;
  readonly description: string;
  readonly content: React.ComponentType<ArtifactContent<M>>;
  readonly initialize?: (parameters: InitializeParameters<M>) => void;
  readonly onStreamPart: (args: {
    setMetadata: Dispatch<SetStateAction<M>>;
    setArtifact: Dispatch<SetStateAction<UIArtifact>>;
    streamPart: DataStreamDelta;
  }) => void;

  constructor(config: ArtifactConfig<T, M>) {
    this.kind = config.kind;
    this.description = config.description;
    this.content = config.content;
    this.initialize = config.initialize || (async () => ({}));
    this.onStreamPart = config.onStreamPart;
  }
}
