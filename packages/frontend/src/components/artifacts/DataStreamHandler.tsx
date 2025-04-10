'use client';

import React, { useEffect, useRef } from 'react';
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

      setArtifact((draftArtifact) => {
        if (!draftArtifact) {
          return { ...initialArtifactData, status: 'streaming' };
        }

        switch (delta.type) {
          case 'id':
            return {
              ...draftArtifact,
              researchId: delta.content as string,
              status: 'streaming',
            };

          case 'title':
            return {
              ...draftArtifact,
              title: delta.content as string,
              status: 'streaming',
            };

          case 'kind':
            const newKind = delta.content as any;
            const newDefinition = artifactDefinitions.find(
              (definition) => definition.kind === newKind,
            );
            
            if (newDefinition?.initialize) {
              newDefinition.initialize({
                researchId: artifact.researchId,
                setMetadata,
              });
            }
            
            return {
              ...draftArtifact,
              kind: newKind,
              status: 'streaming',
            };

          case 'clear':
            return {
              ...draftArtifact,
              content: '',
              status: 'streaming',
            };

          case 'finish':
            return {
              ...draftArtifact,
              status: 'idle',
            };

          default:
            return draftArtifact;
        }
      });
    });
  }, [stream, setArtifact, setMetadata, artifact]);

  return null;
}
