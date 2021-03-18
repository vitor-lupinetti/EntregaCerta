import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { UserTypeEntity } from "./UserTypeEntity";

@Entity("tbUsers")
class UserEntity {
    @PrimaryColumn()
    readonly id: string = "";

    @Column()
    idUserType: string = "";

    @ManyToOne(() => UserTypeEntity)
    @JoinColumn({ name: "idUserType" })
    userTypeEntity: UserTypeEntity;

    @Column()
    password: string = "";

    @Column()
    user: string = "";

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}

export { UserEntity };
