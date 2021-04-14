import { Column, Entity as EntityORM, JoinColumn, ManyToOne } from "typeorm";

import { CustomerEntity } from "./CustomerEntity";
import { DeliveryPhotoEntity } from "./DeliveryPhotoEntity";
import { Entity } from "./Entity";

@EntityORM("tbDeliveries")
class DeliveryEntity extends Entity {
    @Column()
    idBuyer: string;

    @ManyToOne(() => CustomerEntity)
    @JoinColumn({ name: "idBuyer" })
    buyerEntity?: CustomerEntity;

    @Column()
    idReceiver: string;

    @ManyToOne(() => CustomerEntity)
    @JoinColumn({ name: "idReceiver" })
    receiverEntity?: CustomerEntity;

    @Column()
    amountPackaging?: number;

    @Column()
    description: string;

    @Column()
    purchaseDate: Date;

    @Column()
    receiptDate?: Date;

    @Column()
    receptionTime?: Date;

    photos?: DeliveryPhotoEntity[];
}

export { DeliveryEntity };
