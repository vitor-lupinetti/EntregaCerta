import { getCustomRepository } from "typeorm";
import fs from "fs";
import path from "path";
import { DeliveryPhotoEntity } from "../entities/DeliveryPhotoEntity";
import { DeliveryPhotoRepository } from "../repositories/DeliveryPhotoRepository";
import { GenericService } from "./Service";
import { DeliveryPhotoValidation } from "./validations/DeliveryPhotoValidation";
import { AppError } from "../errors/AppError";
import DeliveryService from "./DeliveryService";

export class DeliveryPhotoService extends GenericService<DeliveryPhotoEntity> {
    constructor() {
        super(getCustomRepository(DeliveryPhotoRepository), new DeliveryPhotoValidation());
    }

    public async create(entity: DeliveryPhotoEntity): Promise<DeliveryPhotoEntity> {
        const deliveryPhotoCreated = this.repository.create(entity);

        await this.repository.save(deliveryPhotoCreated);

        return deliveryPhotoCreated;
    }

    public async createPhoto(photo: any, idDelivery:string){

        const deliveryService = new DeliveryService();
        const deliveryFound = await deliveryService.findOne({ where: { id: idDelivery } })

        if (!deliveryFound) {
            throw new AppError("Entrega não encontrada", 404);
        }

        if (photo) {

            let photoData = fs.readFileSync(photo.path);
            let photoEncoded = photoData.toString("base64");

            let deliveryPhoto: DeliveryPhotoEntity = {
                idDelivery: deliveryFound.id || "",
                photo: photoEncoded,
                photoMimeType: photo.mimetype
            };

            await this.create(deliveryPhoto);

            fs.unlink(path.resolve(__dirname, "..", "..", "uploads", photo.filename), () => { /* Faz nada quando der erro */ });
        }

    }

    public async delete(id: any){
        const deliveryFound = await super.findOne({where: {id}});

        if(!deliveryFound){
            throw new AppError('Entrega não encontrada!!', 404);
        }

        await super.delete({id});
    }
}
