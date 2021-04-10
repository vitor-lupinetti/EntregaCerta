import { EntityRepository, Repository } from "typeorm";

import { DeliveryEntity } from "../entities/DeliveryEntity";

@EntityRepository(DeliveryEntity)
export class DeliveryRepository extends Repository<DeliveryEntity> { }
