import fs from "fs";
import path from "path";
import { getCustomRepository } from "typeorm";

import { DeliveryEntity } from "../entities/DeliveryEntity";
import { DeliveryPhotoEntity } from "../entities/DeliveryPhotoEntity";
import { AppError } from "../errors/AppError";
import { DeliveryRepository } from "../repositories/DeliveryRepository";
import { CustomerService } from "./CustomerService";
import { DeliveryPhotoService } from "./DeliveryPhotoService";
import { MailService } from "./MailService";
import { GenericService } from "./Service";
import { DeliveryValidation } from "./validations/DeliveryValidation";

interface DeliveryUpdateDTO {
    receiptDate: string,
    receptionTime: string,
    id: string,
    amountPackaging: number
}

class DeliveryService extends GenericService<DeliveryEntity>{
    constructor() {
        super(getCustomRepository(DeliveryRepository), new DeliveryValidation());
    }

    public async create(delivery: DeliveryEntity): Promise<DeliveryEntity> {
        let deliveryCreated = await super.create(delivery);

        let mailService = new MailService();

        mailService.noticeNewDelivery(deliveryCreated);

        return deliveryCreated;
    }

    public async updateDelivery(model: DeliveryUpdateDTO) {
        const deliveryFound = await super.findOne({ where: { id: model.id } })

        if (!deliveryFound) {
            throw new AppError("Entrega não encontrada", 404);
        }

        await (this.validation as DeliveryValidation).validateFieldsUpdate(model);

        deliveryFound.amountPackaging = model.amountPackaging;
        deliveryFound.receiptDate = new Date(model.receiptDate);
        deliveryFound.receptionTime = new Date(`${model.receiptDate}T${model.receptionTime}`);

        await this.repository.save(deliveryFound);

       

        let mailService = new MailService();

        mailService.noticeUpdatedDelivery(deliveryFound);

        return deliveryFound;
    }

    public async listForBuyer(idBuyer: string) {
        return await super.list({ where: { idBuyer } });
    }

    public async listForReceiver(idReceiver: string) {
        return await super.list({ where: { idReceiver } });
    }
}

export default DeliveryService;
