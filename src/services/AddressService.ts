import { getCustomRepository } from "typeorm";

import { AddressEntity } from "../entities/AddressEntity";
import { AddressRepository } from "../repositories/AddressRepository";
import { GenericService } from "./Service";
import { AddressValidation } from "./validations/AddressValidation";

export class AddressService extends GenericService<AddressEntity>{
    constructor() {
        super(getCustomRepository(AddressRepository), new AddressValidation());
    }

    public async onlyValidateCreate(address: AddressEntity): Promise<string[]> {
        await this.validation.validateSimpleFields(address, true);

        return this.validation.getErrors();
    }
}
