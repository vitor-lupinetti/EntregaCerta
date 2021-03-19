import { Column, Entity as EntityORM } from "typeorm";

import { Entity } from "./Entity";

@EntityORM("tbUserTypes")
class UserTypeEntity extends Entity {
    @Column()
    description: string = "";
}

export { UserTypeEntity };
