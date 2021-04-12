import { Request, Response } from "express";
import { DeliveryEntity } from "../entities/DeliveryEntity";
import DeliveryService from "../services/DeliveryService";


class DeliveryController{
    async create(request: Request, response: Response) {
        const { idBuyer, idReceiver, amountPackaging, description } = request.body;

        let purchaseDate = new Date();
    
        const deliveryService = new DeliveryService();
    
        const deliveryToCreate: DeliveryEntity = { idBuyer, idReceiver, amountPackaging, purchaseDate, description };
        const deliveryCreated = await deliveryService.create(deliveryToCreate);
    
        return response.status(201).json(deliveryCreated);
    }

    async update(request:Request, response:Response){
        let { id, date, amountPackaging } = request.body;

        let formatedDate:Date = new Date(date);

        
        const receiptDate = `${formatedDate.getFullYear()}-${formatedDate.getMonth()+1}-${formatedDate.getDate()}`;
        const receiptTime = `${formatedDate.getHours()}:${formatedDate.getMinutes()}`;
        
        const deliveryService = new DeliveryService();

        const deliveryUpdated = await deliveryService.updateDelivery({receiptDate, receiptTime,amountPackaging, id});
        return response.status(201).json(deliveryUpdated);
    }

    async listForBuyer(request:Request, response:Response){
        const {idBuyer} = request.params;

        const deliveryService = new DeliveryService();
        const deliveries = await deliveryService.listForBuyer(idBuyer);

        return response.status(200).json(deliveries);
    }

    async listForReceiver(request:Request, response:Response){
        const {idReceiver} = request.params;

        const deliveryService = new DeliveryService();
        const deliveries = await deliveryService.listForReceiver(idReceiver);

        return response.status(200).json(deliveries);
    }
}

export default DeliveryController;