import { Column, Entity as EntityORM, JoinColumn, ManyToOne } from "typeorm";

import { Entity } from "./Entity";
import { UserTypeEntity } from "./UserTypeEntity";

@EntityORM("tbUsers")
class UserEntity extends Entity {
    @Column()
    idUserType: string = "";

    @ManyToOne(() => UserTypeEntity)
    @JoinColumn({ name: "idUserType" })
    userTypeEntity?: UserTypeEntity;

    @Column()
    password: string = "";

    @Column()
    user: string = "";
}

export { UserEntity };
