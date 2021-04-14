import { Request, Response } from "express";
import { DeliveryEntity } from "../entities/DeliveryEntity";
import { DeliveryPhotoService } from "../services/DeliveryPhotoService";
import DeliveryService from "../services/DeliveryService";


class DeliveryController {
    async create(request: Request, response: Response) {
        const { idBuyer, idReceiver, description } = request.body;

        let purchaseDate = new Date();

        const deliveryService = new DeliveryService();

        const deliveryToCreate: DeliveryEntity = { idBuyer, idReceiver, purchaseDate, description };
        const deliveryCreated = await deliveryService.create(deliveryToCreate);

        return response.status(201).json(deliveryCreated);
    }

    async update(request: Request, response: Response) {
        let { id, date, amountPackaging } = request.body;
        amountPackaging = Number(amountPackaging);
        let receiptDate = "";
        let receptionTime = "";
        let photos = request?.files;

        const regexDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

        if (regexDateTime.test(date)) {
            let formattedDate: Date = new Date(date);

            receiptDate = `${formattedDate.getFullYear()}-${formattedDate.getMonth() + 1}-${formattedDate.getDate()}`;
            receptionTime = `${formattedDate.getHours()}:${formattedDate.getMinutes()}`;
        }

        const deliveryService = new DeliveryService();

        const deliveryUpdated = await deliveryService.updateDelivery({ receiptDate, receptionTime, amountPackaging, id, photos });
        return response.status(201).json(deliveryUpdated);
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
            return response.status(404).json({ message: "Entrega não encontrada" })
        }

        const deliveryPhotoService = new DeliveryPhotoService();

        delivery.photos = await deliveryPhotoService.list({ where: { idDelivery: id } });

        return response.json({ delivery });
    }
}

export default DeliveryController;