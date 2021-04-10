import { EntityRepository, Repository } from "typeorm";

import { UserEntity } from "../entities/UserEntity";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> { }
