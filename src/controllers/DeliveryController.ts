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

        /**
         * \d{4} >> 0000 até 9999
         * -
         * (0[1-9])|(1[0-2]) >> 01 até 09 ou 10 até 12
         * -
         * (0[1-9])|([1-3]\d) >> 01 até 09 ou 10 até 39
         * T
         * (0\d)|([1-2]\d) >> 00 até 09 ou 10 até 29
         * :
         * (0\d)|([1-5]\d) >> 00 até 09 ou 10 até 59
         * 
         * Impedir de criar um objeto Date com o valor Invalid Date
         */
        const regexDateTime = /^\d{4}-(0[1-9])|(1[0-2])-(0[1-9])|([1-3]\d)T(0\d)|([1-2]\d):(0\d)|([1-5]\d)$/;

        if (regexDateTime.test(date)) {
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
}

export default DeliveryController;
