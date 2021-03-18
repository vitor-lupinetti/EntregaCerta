import { EntityRepository, Repository } from "typeorm";

import { UserTypeEntity } from "../entities/UserTypeEntity";

@EntityRepository(UserTypeEntity)
class UserTypeRepository extends Repository<UserTypeEntity> { }

export { UserTypeRepository };
