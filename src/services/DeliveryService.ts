import { FindOneOptions, getCustomRepository } from "typeorm";

import { DeliveryEntity } from "../entities/DeliveryEntity";
import { DeliveryStatusEnum } from "../enums/DeliveryStatusEnum";
import { DeliveryRepository } from "../repositories/DeliveryRepository";
import { MailService } from "./MailService";
import { GenericService } from "./Service";
import { DeliveryValidation } from "./validations/DeliveryValidation";

class DeliveryService extends GenericService<DeliveryEntity>{
    constructor() {
        super(getCustomRepository(DeliveryRepository), new DeliveryValidation());
    }

    public async create(delivery: DeliveryEntity): Promise<DeliveryEntity> {
        delivery.status = DeliveryStatusEnum.CREATED;

        let deliveryCreated = await super.create(delivery);

        let mailService = new MailService();

        mailService.noticeNewDelivery(deliveryCreated);

        return deliveryCreated;
    }

    public async update(delivery: DeliveryEntity): Promise<DeliveryEntity> {
        delivery.status = DeliveryStatusEnum.RECEIVER_RECEIVED;

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

    public async list(options?: FindOneOptions<DeliveryEntity>): Promise<DeliveryEntity[]> {
        const deliveries = await super.list(options);

        const deliveriesWithTimeZone = deliveries
            .map((delivery) => {
                this.addTimeZone(delivery);

                return delivery;
            });

        return deliveriesWithTimeZone;
    }

    public async findOne(options?: FindOneOptions<DeliveryEntity>): Promise<DeliveryEntity> {
        const deliveryFound = await super.findOne(options);

        if (!deliveryFound) {
            return deliveryFound;
        }

        this.addTimeZone(deliveryFound);

        return deliveryFound;
    }

    private addTimeZone(delivery: DeliveryEntity): void {
        const { receiptDate, receptionTime } = delivery;

        const dateTimeReceipt = new Date(`${receiptDate}T${receptionTime}.000Z`);
        dateTimeReceipt.setHours(dateTimeReceipt.getHours() - 3);

        const dateTimeReceiptISO = dateTimeReceipt.toISOString();

        delivery.receiptDate = dateTimeReceiptISO.replace(/T.*/, "");
        delivery.receptionTime = dateTimeReceiptISO.replace(/.*T/, "").replace(/\..*/, "");
    }
}

export default DeliveryService;
