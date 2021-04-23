import { getCustomRepository } from "typeorm";

import { DeliveryPhotoEntity } from "../entities/DeliveryPhotoEntity";
import { DeliveryPhotoRepository } from "../repositories/DeliveryPhotoRepository";
import { GenericService } from "./Service";
import { DeliveryPhotoValidation } from "./validations/DeliveryPhotoValidation";

export class DeliveryPhotoService extends GenericService<DeliveryPhotoEntity> {
    constructor() {
        super(getCustomRepository(DeliveryPhotoRepository), new DeliveryPhotoValidation());
    }
}
