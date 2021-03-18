import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("tbUserTypes")
class UserTypeEntity {
    @PrimaryColumn()
    readonly id: string = "";

    @Column()
    description: string = "";

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}

export { UserTypeEntity };
