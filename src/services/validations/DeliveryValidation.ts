import { DeliveryEntity } from "../../entities/DeliveryEntity";
import DeliveryService from "../DeliveryService";
import { Validation } from "./Validation";
import * as yup from "yup";
import UserService from "../UserService";
import { AppError } from "../../errors/AppError";
import { CustomerService } from "../CustomerService";

interface DeliveryUpdateDTO {
    receiptDate: string,
    receptionTime: string,
    id: string,
    amountPackaging: number,
    photos?: any
}

export class DeliveryValidation extends Validation<DeliveryEntity> {
    public async validateCreate(service: DeliveryService, delivery: DeliveryEntity): Promise<void> {
        await this.validateFields(delivery, true);
    }

    protected async validateFields(delivery: DeliveryEntity, isCreate: boolean): Promise<void> {
        let validations = this.getValidationsFields(isCreate);

        const schema = yup.object().shape(validations);

        await schema.validate(delivery, this.validateOptions)

        await this.verifyIfCustomerExists(delivery.idBuyer);
        await this.verifyIfCustomerExists(delivery.idReceiver);
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

        await schema.validate(model, this.validateOptions);

        if (new Date(model.receiptDate).getTime() > new Date().getTime()) {
            throw new AppError("Data de recebimento não pode ser uma data maior que hoje.");
        }
    }

    private async verifyIfCustomerExists(id: string) {
        const customerService = new CustomerService();

        const customerFound = customerService.findOne({ where: { id } });

        if (!customerFound) {
            throw new AppError("Cliente não encontrado!", 404);
        }
    }
}