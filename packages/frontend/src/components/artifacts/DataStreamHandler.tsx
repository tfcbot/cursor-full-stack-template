'use client';

import { useEffect, useRef } from 'react';
import { useArtifact, initialArtifactData } from '../../hooks/useArtifactHooks';
import { textArtifact } from './text/client';
import { codeArtifact } from './code/client';
import { DataStreamDelta } from './create-artifact';

export const artifactDefinitions = [
  textArtifact,
  codeArtifact,
];

export function DataStreamHandler({ stream }: { stream: DataStreamDelta[] }) {
  const { artifact, setArtifact, setMetadata } = useArtifact();
  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!stream?.length) return;

    const newDeltas = stream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = stream.length - 1;

    newDeltas.forEach((delta) => {
      const artifactDefinition = artifactDefinitions.find(
        (definition) => definition.kind === artifact.kind,
      );

      if (artifactDefinition?.onStreamPart) {
        artifactDefinition.onStreamPart({
          streamPart: delta,
          setArtifact,
          setMetadata,
        });
      }

      if (delta.type === 'kind') {
        setArtifact((draftArtifact) => ({
          ...draftArtifact,
          kind: delta.content as any,
        }));
        
        const newDefinition = artifactDefinitions.find(
          (definition) => definition.kind === delta.content,
        );
        
        if (newDefinition?.initialize) {
          newDefinition.initialize({
            researchId: artifact.researchId,
            setMetadata,
          });
        }
      }
    });
  }, [stream, setArtifact, setMetadata, artifact]);

  return null;
}
