import { EntityRepository, Repository } from "typeorm";

import { UserEntity } from "../entities/UserEntity";

@EntityRepository(UserEntity)
class UserRepository extends Repository<UserEntity> { }

export { UserRepository };
