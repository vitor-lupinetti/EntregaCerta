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
        this.validation.disableThrowErrors();
        await this.validation.validateCreate(this, address);

        let addressErrors = this.validation.getErrors();
        addressErrors.splice(addressErrors.indexOf("Bairro não encontrado"), 1);

        return addressErrors;
    }
}
