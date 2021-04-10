import { EntityRepository, Repository } from "typeorm";

import { UserTypeEntity } from "../entities/UserTypeEntity";

@EntityRepository(UserTypeEntity)
export class UserTypeRepository extends Repository<UserTypeEntity> { }
