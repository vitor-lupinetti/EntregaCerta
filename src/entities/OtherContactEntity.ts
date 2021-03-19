import { Column, Entity as EntityORM, JoinColumn, ManyToOne } from "typeorm";

import { Entity } from "./Entity";
import { CustomerEntity } from "./CustomerEntity";

@EntityORM("tbOtherContacts")
class OtherContactEntity extends Entity {
    @Column()
    idCustomer: string = "";

    @ManyToOne(() => CustomerEntity)
    @JoinColumn({ name: "idCustomer" })
    CustomerEntity?: CustomerEntity;

    @Column()
    idOtherCustomer: string = "";

    @ManyToOne(() => CustomerEntity)
    @JoinColumn({ name: "idOtherCustomer" })
    OtherCustomerEntity?: CustomerEntity;
}

export { OtherContactEntity };
