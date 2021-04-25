import { Request, Response } from "express";

import { DeliveryEntity } from "../entities/DeliveryEntity";
import { AppError } from "../errors/AppError";
import { DeliveryPhotoService } from "../services/DeliveryPhotoService";
import DeliveryService from "../services/DeliveryService";

class DeliveryController {
    async create(request: Request, response: Response) {
        const { idBuyer, idReceiver, description } = request.body;
        let purchaseDateObj = new Date();
        let purchaseDate = purchaseDateObj.toISOString().replace(/T.*/, "");

        const deliveryService = new DeliveryService();

        const deliveryToCreate = new DeliveryEntity();
        deliveryToCreate.idBuyer = idBuyer;
        deliveryToCreate.idReceiver = idReceiver;
        deliveryToCreate.purchaseDate = purchaseDate;
        deliveryToCreate.purchaseDateObj = purchaseDateObj;
        deliveryToCreate.description = description;

        const deliveryCreated = await deliveryService.create(deliveryToCreate);

        return response.status(201).json(deliveryCreated);
    }

    async update(request: Request, response: Response) {
        let { id, amountPackaging, date } = request.body;

        const deliveryToUpdate = new DeliveryEntity();
        deliveryToUpdate.id = id;
        deliveryToUpdate.amountPackaging = amountPackaging;

        const regexDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

        if (regexDateTime.test(date)) {
            let formattedDate = new Date(date);

            deliveryToUpdate.receiptDate = formattedDate.toISOString().replace(/T.*/, "");
            deliveryToUpdate.receiptDateObj = formattedDate;
            deliveryToUpdate.receptionTime = formattedDate.toISOString().replace(/.*T/, "");
            deliveryToUpdate.receptionTimeObj = formattedDate;
        }

        const deliveryService = new DeliveryService();

        const deliveryUpdated = await deliveryService.update(deliveryToUpdate);

        return response.status(200).json(deliveryUpdated);
    }

    async listForBuyer(request: Request, response: Response) {
        const { idBuyer } = request.params;

        const deliveryService = new DeliveryService();
        const deliveries = await deliveryService.listForBuyer(idBuyer);

        return response.status(200).json(deliveries);
    }

    async listForReceiver(request: Request, response: Response) {
        const { idReceiver } = request.params;

        const deliveryService = new DeliveryService();
        const deliveries = await deliveryService.listForReceiver(idReceiver);

        return response.status(200).json(deliveries);
    }

    async findDeliveryById(request: Request, response: Response) {
        const { id } = request.params;

        const deliveryService = new DeliveryService();

        const delivery = await deliveryService.findOne({ where: { id } });

        if (!delivery) {
            throw new AppError("Entrega não encontrada", 404);
        }

        const deliveryPhotoService = new DeliveryPhotoService();

        delivery.photos = await deliveryPhotoService.list({ where: { idDelivery: id } });

        return response.json({ delivery });
    }
}

export default DeliveryController;
