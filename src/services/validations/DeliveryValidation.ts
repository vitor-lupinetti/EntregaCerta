import { DeliveryEntity } from "../../entities/DeliveryEntity";
import DeliveryService from "../DeliveryService";
import { Validation } from "./Validation";
import * as yup from "yup";
import UserService from "../UserService";
import { AppError } from "../../errors/AppError";
import { CustomerService } from "../CustomerService";

interface DeliveryUpdateDTO{
    receiptDate:string,
    receiptTime:string,
    id:string,
    amountPackaging: number
}

export class DeliveryValidation extends Validation<DeliveryEntity> {
    public async validate(service: DeliveryService, delivery: DeliveryEntity): Promise<void> {
        await this.validateFields(delivery);
    }

    protected async validateFields(delivery: DeliveryEntity): Promise<void> {
        const schema = yup.object().shape({
            idBuyer: yup.string().trim().required("Id do comprador necessário!"),
            idReceiver: yup.string().trim().required("Id do recebedor necessário!"),
            description:yup.string().trim().required("Informe a descrição da compra"),
            amountPackaging: yup.number().required("Informe a quantidade de pacotes da venda").min(1, "É necessário no mínimo um pacote"),
        })

        await schema.validate(delivery, this.validateOptions)

        await this.verifyIfCustomerExists(delivery.idBuyer);
        await this.verifyIfCustomerExists(delivery.idReceiver);
    }

    public async validateFieldsUpdate(model: DeliveryUpdateDTO){
        const schema = yup.object().shape({
            amountPackaging: yup.number().required("Informe a quantidade de pacotes da venda").min(1, "É necessário no mínimo um pacote"),
        })

        await schema.validate(model, this.validateOptions);
        
        if(new Date(model.receiptDate).getTime() > new Date().getTime()){
            throw new AppError("Data de recebimento não pode ser uma data maior que hoje.");
        }
    }

    private async verifyIfCustomerExists(id: string){
        const customerService = new CustomerService();

        const customerFound = customerService.findOne({where:{id}});

        if(!customerFound){
            throw new AppError("Cliente não encontrado!", 404);
        }
    }
}