import { getRepository, Repository } from "typeorm";

import { CustomerEntity } from "../entities/CustomerEntity";
import { UserEntity } from "../entities/UserEntity";
import { GenericService } from "./Service";
import UserService from "./UserService";
import { CustomerValidation } from "./validations/CustomerValidation";

export class CustomerService extends GenericService<CustomerEntity>{
    constructor(repo: Repository<CustomerEntity>) {
        super(repo, new CustomerValidation());
    }

}
