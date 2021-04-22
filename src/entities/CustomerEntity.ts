import { Column, Entity as EntityORM, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AddressEntity } from "./AddressEntity";

import { Entity } from "./Entity";
import { UserEntity } from "./UserEntity";

@EntityORM("tbCustomers")
class CustomerEntity extends Entity {
    @OneToOne(() => UserEntity)
    @JoinColumn({ name: "id" })
    userEntity?: UserEntity;

    @Column()
    idAddress?: string = "";

    @ManyToOne(() => AddressEntity)
    @JoinColumn({ name: "idAddress" })
    addressEntity?: AddressEntity;

    @Column()
    complement?: string = "";

    @Column()
    contactNumber: string = "";

    @Column()
    email?: string = "";

    @Column()
    hasWhatsApp: string = "";

    @Column()
    homeNumber: string = "";

    @Column()
    name: string = "";

    @Column()
    photo?: string = "";

    @Column()
    photoMimeType: string = "";
}

export { CustomerEntity };
