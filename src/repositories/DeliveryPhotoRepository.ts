import { EntityRepository, Repository } from "typeorm";

import { DeliveryPhotoEntity } from "../entities/DeliveryPhotoEntity";

@EntityRepository(DeliveryPhotoEntity)
export class DeliveryPhotoRepository extends Repository<DeliveryPhotoEntity> { }
