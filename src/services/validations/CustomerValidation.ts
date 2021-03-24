import { Not } from "typeorm";
import * as yup from "yup";

import { CustomerEntity } from "../../entities/CustomerEntity";
import { CustomerService } from "../CustomerService";
import { Validation } from "./Validation";

export class CustomerValidation extends Validation<CustomerEntity> {
    protected async validateFields(customer: CustomerEntity): Promise<void> {
        const schema = yup.object().shape({
            complement: yup.string().trim().max(100, "Complemento com mais de 100 caracteres"),
            contactNumber: yup.string().trim().required("Número de contato obrigatório").matches(/^\d{10,11}$/, "Número de contato no formato incorreto"),
            homeNumber: yup.string().trim().required("Número da casa obrigatório"),
            email: yup.string().trim().email("E-mail em formato inválido"),
            hasWhatsApp: yup.string().trim().max(1).required("Informe se possue whats"),
            name:yup.string().trim().required("Informe o seu nome"),
        });

        await schema.validate(customer, this.validateOptions);
    }

    protected async validateFieldsUpdate(customer: CustomerEntity): Promise<void> {
        const schema = yup.object().shape({
            complement: yup.string().trim().max(100, "Complemento com mais de 100 caracteres"),
            contactNumber: yup.string().trim().required("Número de contato obrigatório").matches(/^\d{10,11}$/, "Número de contato no formato incorreto"),
            homeNumber: yup.string().trim().required("Número da casa obrigatório"),
            email: yup.string().trim().email("E-mail em formato inválido"),
            hasWhatsApp: yup.string().trim().max(1).required("Informe se possue whats"),
            name:yup.string().trim().required("Informe o seu nome"),
            addressEntity:yup.object().shape({
                cep:yup.string().trim().matches(/^\d{8}$/, "CEP no formato incorreto"),
                street:yup.string().trim().required("Rua não pode ser vazia"),
                neighborhoodEntity:yup.object().shape({name:yup.string().trim().required("Nome do bairro não pode ser vazio")})}),

        });
        await schema.validate(customer, this.validateOptions);
    }

    protected async verifyIfExists(service: CustomerService, customer: CustomerEntity): Promise<void> {
        /**
         * email é preenchido E igual ao informado
         * OU contactNumber igual ao informado
         * 
         * Não funciona direito busca email
         */

        let customerFind;

        if(customer.email){
            customerFind = await service.findOne({
                where: [
                    { email: Not("") && customer.email },
                    { contactNumber: customer.contactNumber }
                ]
            });
        }
        else{
            customerFind = await service.findOne({
                where: [
                    { contactNumber: customer.contactNumber }
                ]
            });
        }

        

        if (customerFind) {
            throw new Error("Já existe um registro que possua mesmo e-mail, ou número de contato.");
        }
    }

    protected async verifyIfExistsForUpdate(service: CustomerService, customer: CustomerEntity): Promise<void> {
       

        let customerFind;

        if(customer.email){
            customerFind = await service.findOne({
                where: [
                    { email: Not("") && customer.email },
                ]
            });
            if (customerFind && customerFind.id != customer.id) {
                throw new Error("Já existe um registro que possua mesmo e-mail.");
            }
        }
        
        customerFind = await service.findOne({
            where: [
                { contactNumber: customer.contactNumber }
            ]
        });
        if (customerFind && customerFind.id != customer.id) {
            throw new Error("Já existe um registro que possua mesmo número de contato.");
        }

    }

    public async validateOnUpdate(service: CustomerService,customer:CustomerEntity){
        await this.validateFieldsUpdate(customer);
        await this.verifyIfExistsForUpdate(service, customer);
    }
}
