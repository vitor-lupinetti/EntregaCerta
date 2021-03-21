import { Repository } from "typeorm";

import { AddressEntity } from "../entities/AddressEntity";
import { GenericService } from "./Service";
import { AddressValidation } from "./validations/AddressValidation";

export class AddressService extends GenericService<AddressEntity>{
    constructor(repo: Repository<AddressEntity>) {
        super(repo, new AddressValidation());
    }
}
