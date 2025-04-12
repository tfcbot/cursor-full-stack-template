import { ValidUser } from '@metadata/saas-identity.schema'
import { ISaasIdentityVendingMachine } from '@metadata/saas-identity.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { apiKeyService } from '../vendors/api-key-vendor';
import jwt from 'jsonwebtoken';

class SaaSIdentityErrors extends Error {
    constructor(message: string, public originalError: unknown) {
        super(message);
        this.name = 'SaaSIdentityErrors';
    }
}

export class SaaSIdentityVendingMachine implements ISaasIdentityVendingMachine {

    constructor() {
       
    }

    private async verifyJwt(token: string): Promise<ValidUser> {
        try {
            const parts = token.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                throw new Error('Invalid token format');
            }
            const bearerToken = parts[1];
            
            const { sub } = jwt.decode(bearerToken) as { sub: string };
            
            if (!sub) {
                throw new Error('Invalid token');
            }
            
            return { userId: sub };
        } catch (error) {
            console.error('JWT verification error:', error);
            throw new Error('Invalid token');
        }
    }
    
    private async verifyApiKey(apiKey: string): Promise<ValidUser> {
        try {
            return await apiKeyService.validateApiKey(apiKey);
        } catch (error) {
            console.error('API key verification error:', error);
            throw new Error('Invalid API key');
        }
    }

    async getValidUser(event: APIGatewayProxyEventV2): Promise<ValidUser> {
        try {
            const token = event.headers.authorization;
            if (token) {
                return await this.verifyJwt(token);
            }
            
            const apiKey = event.headers['x-api-key'];
            if (apiKey) {
                return await this.verifyApiKey(apiKey);
            }
            
            throw new Error('No authentication provided');
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }
}

