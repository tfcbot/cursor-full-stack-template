import { z } from 'zod';

export const ValidUserSchema = z.any();

export type ValidUser = z.infer<typeof ValidUserSchema>;

export interface ISaasIdentityVendingMachine {
  getValidUser(): Promise<ValidUser>
}