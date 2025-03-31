import { ValidUser } from '@metadata/saas-identity.schema'
import { ISaasIdentityVendingMachine } from '@metadata/saas-identity.schema';



class SaaSIdentityErrors extends Error {
    constructor(message: string, public originalError: unknown) {
        super(message);
        this.name = 'SaaSIdentityErrors';
    }
}

export class SaaSIdentityVendingMachine implements ISaasIdentityVendingMachine {

    constructor() {
       
    }


    async getValidUser(): Promise<ValidUser> {
        return {} as ValidUser;
    }
}

