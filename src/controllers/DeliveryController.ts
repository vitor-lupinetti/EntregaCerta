import { Request, Response } from "express";

import { DeliveryEntity } from "../entities/DeliveryEntity";
import { EnumDeliveryStatus } from "../enums/EnumDeliveryStatus";
import { AppError } from "../errors/AppError";
import { DeliveryPhotoService } from "../services/DeliveryPhotoService";
import DeliveryService from "../services/DeliveryService";
import { DateTimeValidation } from "../services/validations/DateTimeValidation";

class DeliveryController {
    async create(request: Request, response: Response) {
        const { idBuyer, idReceiver, description } = request.body;
        let purchaseDateObj = new Date();
        let purchaseISO = purchaseDateObj.toISOString();
        let purchaseDate = purchaseISO.replace(/T.*/, "");
        let purchaseTime = purchaseISO.replace(/.*T/, "").replace(/\..*/, "");

        const deliveryService = new DeliveryService();

        const deliveryToCreate = new DeliveryEntity();
        deliveryToCreate.idBuyer = idBuyer;
        deliveryToCreate.idReceiver = idReceiver;
        deliveryToCreate.purchaseDate = purchaseDate;
        deliveryToCreate.purchaseTime = purchaseTime;
        deliveryToCreate.purchaseDateObj = purchaseDateObj;
        deliveryToCreate.description = description;

        const deliveryCreated = await deliveryService.create(deliveryToCreate);

        return response.status(201).json(deliveryCreated);
    }

    async update(request: Request, response: Response) {
        let { id, amountPackaging, date } = request.body;

        const deliveryToUpdate = new DeliveryEntity();
        deliveryToUpdate.id = id;
        deliveryToUpdate.amountPackaging = Number(amountPackaging);

        const dateTimeValidation = new DateTimeValidation();

        if (dateTimeValidation.validateDateTime(date)) {
            let dateObj = new Date(date);
            let dateISO = dateObj.toISOString();

            deliveryToUpdate.receiptDate = dateISO.replace(/T.*/, "");
            deliveryToUpdate.receiptDateObj = dateObj;
            deliveryToUpdate.receptionTime = dateISO.replace(/.*T/, "").replace(/\..*/, "");
            deliveryToUpdate.receptionTimeObj = dateObj;
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

    async markAsDelivered(request: Request, response: Response) {
        const { id } = request.params;

        const deliveryService = new DeliveryService();

        await deliveryService.markAsDelivered(id);

        return response.status(200).json({ currentStatusDelivery: EnumDeliveryStatus.AWAITING_BUYER_CONFIRMATION });
    }

    async confirmDeliveryDelivered(request: Request, response: Response) {
        const { id, wasDelivered } = request.body;

        const deliveryService = new DeliveryService();

        const deliveryUpdated = await deliveryService.confirmDeliveryDelivered(id, wasDelivered);

        return response.status(200).json({ currentStatusDelivery: deliveryUpdated.status });
    }
}

export default DeliveryController;
