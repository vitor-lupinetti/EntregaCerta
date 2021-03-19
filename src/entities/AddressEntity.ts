import { Column, Entity as EntityORM, JoinColumn, ManyToOne } from "typeorm";

import { Entity } from "./Entity";
import { NeighborhoodEntity } from "./NeighborhoodEntity";

@EntityORM("tbAddresses")
class AddressEntity extends Entity {
    @Column()
    idNeighborhood: string = "";

    @ManyToOne(() => NeighborhoodEntity)
    @JoinColumn({ name: "idNeighborhood" })
    NeighborhoodEntity?: NeighborhoodEntity;

    @Column()
    cep: string = "";

    @Column()
    street: string = "";
}

export { AddressEntity };
