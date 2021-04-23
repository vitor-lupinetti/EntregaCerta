import { Request, Response } from "express";

import { DeliveryPhotoEntity } from "../entities/DeliveryPhotoEntity";
import { DeliveryPhotoService } from "../services/DeliveryPhotoService";
import { FileService } from "../services/FileService";

export default class DeliveryPhotosController {
    async create(request: Request, response: Response) {
        let { idDelivery } = request.body;

        const deliveryPhotoToCreate = new DeliveryPhotoEntity();
        deliveryPhotoToCreate.idDelivery = idDelivery;

        if (request.file) {
            const fileService = new FileService();

            const convertedFile = fileService.convertToBase64(request.file);

            deliveryPhotoToCreate.photo = convertedFile.fileEncoded;
            deliveryPhotoToCreate.photoMimeType = convertedFile.mimeType;
        }

        const photoService = new DeliveryPhotoService();

        const deliveryPhotoCreated = await photoService.create(deliveryPhotoToCreate);

        return response.status(201).json({ id: deliveryPhotoCreated.id });
    }

    async delete(request: Request, response: Response) {
        let { id } = request.body;

        const photoService = new DeliveryPhotoService();

        await photoService.delete(id);

        return response.status(200).json({ message: "Foto apagada com sucesso." });
    }

    async list(request: Request, response: Response) {
        let { idDelivery } = request.params;

        const photoService = new DeliveryPhotoService();

        const photos = await photoService.list({ where: { idDelivery } });

        return response.status(200).json(photos);
    }
}
