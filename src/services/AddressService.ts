import { getRepository } from "typeorm";

import { AddressEntity } from "../entities/AddressEntity";
import { GenericService } from "./Service";
import { AddressValidation } from "./validations/AddressValidation";

export class AddressService extends GenericService<AddressEntity>{
    constructor() {
        super(getRepository(AddressEntity), new AddressValidation());
    }
}
