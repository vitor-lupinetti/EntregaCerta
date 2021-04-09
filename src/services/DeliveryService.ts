import { getRepository } from "typeorm";
import { DeliveryEntity } from "../entities/DeliveryEntity";
import { AppError } from "../errors/AppError";
import { GenericService } from "./Service";
import { DeliveryValidation } from "./validations/DeliveryValidation";

interface DeliveryUpdateDTO{
    receiptDate:string,
    receiptTime:string,
    id:string,
    amountPackaging: number
}

class DeliveryService extends GenericService<DeliveryEntity>{
    constructor() {
        super(getRepository(DeliveryEntity), new DeliveryValidation());
    }

    public async updateDelivery(model:DeliveryUpdateDTO){

        const deliveryFound = await super.findOne({where:{id: model.id}})

        if(!deliveryFound){
            throw new AppError("Entrega não encontrada", 404);
        }

        await (this.validation as DeliveryValidation).validateFieldsUpdate(model);

        deliveryFound.amountPackaging = model.amountPackaging;
        deliveryFound.receiptDate = new Date(model.receiptDate);
        deliveryFound.receptionTime = new Date(model.receiptTime);

        return await super.update(deliveryFound);
    }
    
}

export default DeliveryService;