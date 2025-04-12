import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ValidUser, ValidUserSchema, ISaasIdentityVendingMachine } from '@metadata/saas-identity.schema';
import { ClerkService, IJwtService } from '@utils/vendors/jwt-vendor';
import { DecodedJwtSchema } from '@metadata/jwt.schema';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { JwtPayload } from '@clerk/types';

class SaaSIdentityErrors extends Error {
    constructor(message: string, public originalError: unknown) {
        super(message);
        this.name = 'SaaSIdentityErrors';
    }
}

export class SaaSIdentityVendingMachine implements ISaasIdentityVendingMachine {
    private jwtService: IJwtService;
    private dbClient: DynamoDBClient;

    constructor() {
       
    }


    async getValidUser(event: APIGatewayProxyEventV2): Promise<ValidUser> {
        return {} as ValidUser;
    }
}

