import * as yup from "yup";

import { DeliveryEntity } from "../../entities/DeliveryEntity";
import { EnumDeliveryStatus } from "../../enums/EnumDeliveryStatus";
import { AppError } from "../../errors/AppError";
import { CustomerService } from "../CustomerService";
import { DeliveryPhotoService } from "../DeliveryPhotoService";
import DeliveryService from "../DeliveryService";
import { Validation } from "./Validation";

export class DeliveryValidation extends Validation<DeliveryEntity> {
    protected async validateFields(delivery: DeliveryEntity, isCreate: boolean): Promise<void> {
        let validations = this.getValidationsFields(isCreate);

        const schema = yup.object().shape(validations);

        try {
            await schema.validate(delivery, this.validateOptions);
        } catch (err) {
            this.addErrors(err.errors);
        }

        if (isCreate) {
            await this.verifyIfCustomerExists(delivery.idBuyer);
            await this.verifyIfReceiverExists(delivery.idReceiver);
        } else {
            if (delivery.receiptDateObj && delivery.receiptDateObj.getTime() > (new Date()).getTime()) {
                this.errors.push("Data de recebimento não pode ser uma data maior que hoje.");
            }

            await this.verifyIfHasPhotos(delivery.id || "");
        }
    }

    protected async verifyIfExists(service: DeliveryService, delivery: DeliveryEntity, isCreate: boolean): Promise<void> {
        /* Nada para validar */
    }

    private getValidationsFields(isCreate: boolean): {} {
        if (isCreate) {
            return {
                description: yup.string().required("Informe a descrição da compra")
            };
        }

        return {
            amountPackaging: yup.number().required("Informe a quantidade de pacotes da venda").min(1, "É necessário no mínimo um pacote"),
            receiptDate: yup.string().required("Data e hora de recebimento obrigatório")
        };
    }

    private async verifyIfCustomerExists(id: string) {
        const customerService = new CustomerService();

        const customerFound = await customerService.findOne({ where: { id } });

        if (!customerFound) {
            this.errors.push("Cliente não encontrado!");
        }
    }

    private async verifyIfReceiverExists(id: string) {
        const customerService = new CustomerService();

        const receiverFound = await customerService.findOne({
            where: { id },
            relations: ["userEntity", "userEntity.userTypeEntity"]
        });

        if (!receiverFound || receiverFound.userEntity?.userTypeEntity?.description !== "Receiver") {
            this.errors.push("Recebedor não encontrado!");
        }
    }

    private async verifyIfHasPhotos(idDelivery: string): Promise<void> {
        const deliveryPhotoService = new DeliveryPhotoService();

        const photoFound = await deliveryPhotoService.findOne({ where: { idDelivery } });

        if (!photoFound) {
            this.errors.push("Obrigatório pelo menos 1 imagem");
        }
    }

    public verifyIfCanMarkAsDelivered(delivery: DeliveryEntity): void {
        if (!delivery) {
            throw new AppError("Entrega não encontrada", 404);
        }

        if (delivery.status !== EnumDeliveryStatus.RECEIVER_RECEIVED) {
            throw new AppError("Status atual não permite marcar a entrega como entregue");
        }
    }
}
