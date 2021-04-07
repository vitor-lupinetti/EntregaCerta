import { Request, Response } from "express";
import { DeliveryEntity } from "../entities/DeliveryEntity";
import DeliveryService from "../services/DeliveryService";


class DeliveryController{
    async create(request: Request, response: Response) {
        const { idBuyer, idReceiver, amountPackaging } = request.body;

        let purchaseDate = new Date();
    
        const deliveryService = new DeliveryService();
    
        const deliveryToCreate: DeliveryEntity = { idBuyer, idReceiver, amountPackaging, purchaseDate };
        const deliveryCreated = await deliveryService.create(deliveryToCreate);
    
        return response.status(201).json(deliveryCreated);
    }
}

export default DeliveryController;