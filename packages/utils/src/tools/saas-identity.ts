import { ValidUser } from '@metadata/saas-identity.schema'
import { ISaasIdentityVendingMachine } from '@metadata/saas-identity.schema';
import { APIGatewayProxyEventV2 } from 'aws-lambda';



class SaaSIdentityErrors extends Error {
    constructor(message: string, public originalError: unknown) {
        super(message);
        this.name = 'SaaSIdentityErrors';
    }
}

export class SaaSIdentityVendingMachine implements ISaasIdentityVendingMachine {

    constructor() {
       
    }


    async getValidUser(event: APIGatewayProxyEventV2): Promise<ValidUser> {
        return {} as ValidUser;
    }
}

