import { Request, Response } from "express";
import { DeliveryPhotoEntity } from "../entities/DeliveryPhotoEntity";
import { DeliveryPhotoService } from "../services/DeliveryPhotoService";


export default class DeliveryPhotosController {
    async create(request: Request, response: Response) {
        let { idDelivery } = request.body;
        let photo = request?.file;

        const photoService = new DeliveryPhotoService();

        await photoService.createPhoto(photo, idDelivery);

        return response.status(201).json({ message: "Foto adicionada." });
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