import { Column, Entity as EntityORM, JoinColumn, ManyToOne } from "typeorm";

import { DeliveryEntity } from "./DeliveryEntity";
import { Entity } from "./Entity";

@EntityORM("tbDeliveryPhotos")
class DeliveryPhotoEntity extends Entity {
    @Column()
    idDelivery: string;

    @ManyToOne(() => DeliveryEntity)
    @JoinColumn({ name: "idDelivery" })
    deliveryEntity?: DeliveryEntity;

    @Column()
    name: number;
}

export { DeliveryPhotoEntity };
