import { z } from 'zod';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
export const ValidUserSchema = z.any();

export type ValidUser = z.infer<typeof ValidUserSchema>;

export interface ISaasIdentityVendingMachine {
  getValidUser(event: APIGatewayProxyEventV2): Promise<ValidUser>
}