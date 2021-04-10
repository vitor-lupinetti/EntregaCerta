import { getCustomRepository } from "typeorm";

import { AddressEntity } from "../entities/AddressEntity";
import { AddressRepository } from "../repositories/AddressRepository";
import { GenericService } from "./Service";
import { AddressValidation } from "./validations/AddressValidation";

export class AddressService extends GenericService<AddressEntity>{
    constructor() {
        super(getCustomRepository(AddressRepository), new AddressValidation());
    }
}
