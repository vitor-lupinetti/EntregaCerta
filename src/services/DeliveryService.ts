import { getCustomRepository } from "typeorm";

import { DeliveryEntity } from "../entities/DeliveryEntity";
import { DeliveryRepository } from "../repositories/DeliveryRepository";
import { MailService } from "./MailService";
import { GenericService } from "./Service";
import { DeliveryValidation } from "./validations/DeliveryValidation";

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

    public async update(delivery: DeliveryEntity): Promise<DeliveryEntity> {
        await super.update(delivery);

        let deliveryUpdated = await this.findOne({ where: { id: delivery.id } });

        let mailService = new MailService();

        mailService.noticeUpdatedDelivery(deliveryUpdated);

        return deliveryUpdated;
    }

    public async listForBuyer(idBuyer: string) {
        return await super.list({ where: { idBuyer } });
    }

    public async listForReceiver(idReceiver: string) {
        return await super.list({ where: { idReceiver } });
    }
}

export default DeliveryService;
