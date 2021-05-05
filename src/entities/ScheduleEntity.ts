import { Column, Entity as EntityORM, JoinColumn, ManyToOne } from "typeorm";

import { DeliveryEntity } from "./DeliveryEntity";
import { Entity } from "./Entity";

@EntityORM("tbSchedules")
class ScheduleEntity extends Entity {
    @Column()
    idDelivery: string;

    @ManyToOne(() => DeliveryEntity)
    @JoinColumn({ name: "idDelivery" })
    deliveryEntity?: DeliveryEntity;

    @Column()
    date: string;

    @Column()
    place: string;

    @Column()
    reason: string;

    @Column()
    time: string;

    dateTimeObj: Date;
}

export { ScheduleEntity };
