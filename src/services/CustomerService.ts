import { Repository } from "typeorm";
import { CustomerEntity } from "../entities/CustomerEntity";
import { GenericService } from "./Service";


export class CustomerService extends GenericService<CustomerEntity>{
    constructor(repo: Repository<CustomerEntity>) {
        super(repo);
    }
}