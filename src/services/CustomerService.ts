import { Repository } from "typeorm";

import { CustomerEntity } from "../entities/CustomerEntity";
import { GenericService } from "./Service";
import { CustomerValidation } from "./validations/CustomerValidation";

export class CustomerService extends GenericService<CustomerEntity>{
    constructor(repo: Repository<CustomerEntity>) {
        super(repo, new CustomerValidation());
    }
}
