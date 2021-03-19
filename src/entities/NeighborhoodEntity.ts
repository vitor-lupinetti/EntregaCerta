import { Column, Entity as EntityORM } from "typeorm";

import { Entity } from "./Entity";

@EntityORM("tbNeighborhoods")
class NeighborhoodEntity extends Entity {
    @Column()
    name: string = "";
}

export { NeighborhoodEntity };
