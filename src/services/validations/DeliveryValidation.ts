import * as yup from "yup";

import { DeliveryEntity } from "../../entities/DeliveryEntity";
import { AppError } from "../../errors/AppError";
import { CustomerService } from "../CustomerService";
import DeliveryService from "../DeliveryService";
import { Validation } from "./Validation";

interface DeliveryUpdateDTO {
    receiptDate: string,
    receptionTime: string,
    id: string,
    amountPackaging: number,
    photos?: any
}

export class DeliveryValidation extends Validation<DeliveryEntity> {
    public async validateCreate(service: DeliveryService, delivery: DeliveryEntity): Promise<void> {
        if (this.alreadyValidate) {
            return;
        }

        this.alreadyValidate = true;

        await this.validateFields(delivery, true);

        this.throwErrors();
    }

    public async validateFields(delivery: DeliveryEntity, isCreate: boolean): Promise<void> {
        let validations = this.getValidationsFields(isCreate);

        const schema = yup.object().shape(validations);

        try {
            await schema.validate(delivery, this.validateOptions);
        } catch (err) {
            this.addErrors(err.errors);
        }

        await this.verifyIfCustomerExists(delivery.idBuyer);
        await this.verifyIfReceiverExists(delivery.idReceiver);
    }

    private getValidationsFields(isCreate: boolean): {} {
        if (isCreate) {
            return {
                idBuyer: yup.string().required("Id do comprador necessário!"),
                idReceiver: yup.string().required("Id do recebedor necessário!"),
                description: yup.string().required("Informe a descrição da compra")
            };
        }

        return {
            amountPackaging: yup.number().required("Informe a quantidade de pacotes da venda").min(1, "É necessário no mínimo um pacote"),
            receiptDate: yup.string().required("Data e hora de recebimento obrigatório"),
            photos: yup.array().min(1, "Obrigatório pelo menos uma imagem").max(8, "Permitido no máximo 8 imagens")
        };
    }

    public async validateFieldsUpdate(model: DeliveryUpdateDTO) {
        let validations = this.getValidationsFields(false);

        const schema = yup.object().shape(validations);

        try {
            await schema.validate(model, this.validateOptions);
        } catch (err) {
            this.addErrors(err.errors);
        }

        if (new Date(model.receiptDate).getTime() > new Date().getTime()) {
            this.errors.push("Data de recebimento não pode ser uma data maior que hoje.");
        }

        this.throwErrors();
    }

    private async verifyIfCustomerExists(id: string) {
        const customerService = new CustomerService();

        const customerFound = customerService.findOne({ where: { id } });

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
}
