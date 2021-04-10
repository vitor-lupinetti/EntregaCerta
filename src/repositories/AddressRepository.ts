import { EntityRepository, Repository } from "typeorm";

import { AddressEntity } from "../entities/AddressEntity";

@EntityRepository(AddressEntity)
export class AddressRepository extends Repository<AddressEntity> { }
