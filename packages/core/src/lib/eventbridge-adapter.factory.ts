/**
 * EventBridge Adapter Factory
 * 
 * This module provides a factory function for creating AWS EventBridge adapters with standardized
 * event parsing, validation, error handling, and logging.
 * It uses Zod for both parsing and validation of EventBridge events.
 */

import { ZodSchema, z } from 'zod';
import { handleError } from '@utils/tools/custom-error';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';

/**
 * Configuration options for the EventBridge adapter.
 */
export interface EventBridgeAdapterOptions {
  /** Whether to continue processing if an error occurs. Default: true */
  continueOnError?: boolean;
  
  /** Custom logger prefix for this adapter. Default: 'EVENTBRIDGE-ADAPTER' */
  loggerPrefix?: string;
  
  /** Whether to include detailed logging. Default: false */
  verboseLogging?: boolean;

  /** Whether to enable deduplication. Default: true */
  enableDeduplication?: boolean;

  /** TTL for deduplication records in seconds. Default: 3600 (1 hour) */
  deduplicationTtl?: number;

  /** DynamoDB table name for deduplication. Default: 'EventDeduplication' */
  deduplicationTableName?: string;
}

/**
 * Use case function that processes the input and returns a result
 */
export type UseCase<TInput, TOutput> = (
  /** The validated input */
  input: TInput
) => Promise<TOutput>;

/**
 * EventBridge handler function created by the factory
 */
export type EventBridgeHandler = (
  /** The EventBridge event */
  event: any
) => Promise<any>;

/**
 * Default options for the EventBridge adapter
 */
const defaultOptions: EventBridgeAdapterOptions = {
  continueOnError: true,
  loggerPrefix: 'EVENTBRIDGE-ADAPTER',
  verboseLogging: false,
  enableDeduplication: true,
  deduplicationTtl: 3600,
  deduplicationTableName: Resource.EventDeduplication.name
};

/**
 * Parameters for creating an EventBridge adapter
 */
export interface EventBridgeAdapterParams<TSchema extends ZodSchema, TInput = z.infer<TSchema>, TOutput = any> {
  /** Zod schema for parsing and validating the input */
  schema: TSchema;
  
  /** The use case function to execute */
  useCase: UseCase<TInput, TOutput>;
  
  /** Configuration options for the adapter */
  options?: EventBridgeAdapterOptions;
  
  /** Descriptive name for this adapter (used in logging) */
  adapterName: string;
}

/**
 * Deduplication service for EventBridge events
 */
export class DeduplicationService {
  private ddbClient: DynamoDBDocumentClient;
  private tableName: string;
  
  constructor(tableName: string) {
    const client = new DynamoDBClient({});
    this.ddbClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }
  
  async processWithDeduplication(
    eventId: string, 
    ttlInSeconds: number = 3600,
    processor: () => Promise<void>
  ): Promise<boolean> {
    try {
      // Check if we've seen this event before
      const getResult = await this.ddbClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { eventId }
        })
      );
      
      if (getResult.Item) {
        // Event has been processed before, skip
        console.log(`Duplicate event detected: ${eventId}`);
        return false;
      }
      
      // Process the event
      await processor();
      
      // Record that we've processed this event
      const expirationTime = Math.floor(Date.now() / 1000) + ttlInSeconds;
      await this.ddbClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: {
            eventId,
            processedAt: new Date().toISOString(),
            ttl: expirationTime
          }
        })
      );
      
      return true;
    } catch (error) {
      console.error("Error in deduplication process:", error);
      throw error;
    }
  }
}

/**
 * Creates an EventBridge adapter function that handles common concerns like event parsing,
 * input validation, and error handling.
 * 
 * Example:
 * ```typescript
 * export const researchReportAdapter = createEventBridgeAdapter({
 *   schema: RequestResearchInputSchema,
 *   useCase: runResearchUsecase,
 *   adapterName: 'RESEARCH-REPORT-GENERATOR',
 *   options: {
 *     verboseLogging: true
 *   }
 * });
 * ```
 */
export const createEventBridgeAdapter = <
  TSchema extends ZodSchema,
  TInput = z.infer<TSchema>,
  TOutput = any
>(
  params: EventBridgeAdapterParams<TSchema, TInput, TOutput>
): EventBridgeHandler => {
  const {
    schema,
    useCase,
    options = defaultOptions,
    adapterName
  } = params;

  const mergedOptions = { ...defaultOptions, ...options };
  const logPrefix = `[${mergedOptions.loggerPrefix}-${adapterName}]`;

  return async (event: any): Promise<any> => {
    console.info(`${logPrefix} Received EventBridge event:`, { 
      eventId: event.id,
      source: event.source,
      detailType: event['detail-type']
    });
    
    try {
      if (!event.detail) {
        console.warn(`${logPrefix} No detail found in EventBridge event`);
        throw new Error("Missing EventBridge detail");
      }
      
      if (mergedOptions.verboseLogging) {
        console.log(`${logPrefix} Processing event:`, { 
          eventId: event.id,
          detailSize: JSON.stringify(event.detail).length
        });
      }
      
      try {
        // Extract the detail from the event
        const detail = event.detail;
        
        if (mergedOptions.verboseLogging) {
          console.log(`${logPrefix} Extracted detail:`, {
            detailType: typeof detail
          });
        }
        
        // Use Zod schema to parse and validate the detail in one step
        const validatedInput = schema.parse(detail) as TInput;
        
        console.info(`${logPrefix} Processing request`);
        
        // If deduplication is enabled, use the deduplication service
        if (mergedOptions.enableDeduplication) {
          const deduplicationService = new DeduplicationService(mergedOptions.deduplicationTableName!);
          const eventId = event.id || detail.id || `${event.source}-${event['detail-type']}-${Date.now()}`;
          
          await deduplicationService.processWithDeduplication(
            eventId,
            mergedOptions.deduplicationTtl,
            async () => {
              // Execute the use case with the parsed and validated input
              await useCase(validatedInput);
            }
          );
        } else {
          // Execute the use case with the parsed and validated input
          await useCase(validatedInput);
        }
        
        if (mergedOptions.verboseLogging) {
          console.log(`${logPrefix} Successfully processed request`);
        }
        
        return { success: true };
      } catch (eventError: unknown) {
        const errorMessage = eventError instanceof Error ? eventError.message : 'Unknown error';
        const errorStack = eventError instanceof Error ? eventError.stack : undefined;
        
        console.error(`${logPrefix} Error processing event:`, { 
          eventId: event.id,
          error: errorMessage,
          stack: errorStack, 
        });
        
        if (mergedOptions.continueOnError) {
          return { error: errorMessage };
        } else {
          throw eventError;
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      console.error(`${logPrefix} Fatal error in adapter:`, {
        error: errorMessage,
        stack: errorStack
      });
      
      return handleError(error);
    }
  };
};
