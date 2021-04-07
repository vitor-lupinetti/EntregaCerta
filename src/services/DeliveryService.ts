import { getRepository } from "typeorm";
import { DeliveryEntity } from "../entities/DeliveryEntity";
import { GenericService } from "./Service";
import { DeliveryValidation } from "./validations/DeliveryValidation";



class DeliveryService extends GenericService<DeliveryEntity>{
    constructor() {
        super(getRepository(DeliveryEntity), new DeliveryValidation());
    }
    
}

export default DeliveryService;