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
        return await this.list({ where: { idBuyer } });
    }

    public async listForReceiver(idReceiver: string) {
        return await this.list({ where: { idReceiver } });
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
        let { purchaseDate, purchaseTime, receiptDate, receptionTime } = delivery;

        // Adapta a diferença de retorno entre SQLite e Postgre
        // SQLite armazena e retorna apenas data
        // Postgre aramazena data e retorna datetime completp (data, hora e timezone)
        purchaseDate = (new Date(purchaseDate)).toISOString().replace(/T.*/, "");
        receiptDate = receiptDate && String(receiptDate).replace(/T.*/, "");

        const dateTimePurchase = new Date(`${purchaseDate}T${purchaseTime}.000Z`);
        dateTimePurchase.setHours(dateTimePurchase.getHours() - 3);

        const dateTimeReceipt = new Date(`${receiptDate}T${receptionTime}.000Z`);
        dateTimeReceipt.setHours(dateTimeReceipt.getHours() - 3);

        const dateTimePurchaseISO = dateTimePurchase.toISOString();
        const dateTimeReceiptISO = dateTimeReceipt.toISOString();

        delivery.purchaseDate = dateTimePurchaseISO.replace(/T.*/, "");
        delivery.purchaseTime = dateTimePurchaseISO.replace(/.*T/, "").replace(/\..*/, "");
        delivery.receiptDate = dateTimeReceiptISO.replace(/T.*/, "");
        delivery.receptionTime = dateTimeReceiptISO.replace(/.*T/, "").replace(/\..*/, "");
    }
}

export default DeliveryService;
