import { EntityRepository, Repository } from "typeorm";

import { CustomerEntity } from "../entities/CustomerEntity";

@EntityRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> { }
