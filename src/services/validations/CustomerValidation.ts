import { Not } from "typeorm";
import * as yup from "yup";

import { CustomerEntity } from "../../entities/CustomerEntity";
import { CustomerService } from "../CustomerService";
import { Validation } from "./Validation";

export class CustomerValidation extends Validation<CustomerEntity> {
    protected async validateFields(customer: CustomerEntity): Promise<void> {
        const schema = yup.object().shape({
            complement: yup.string().max(100, "Complemento com mais de 100 caracteres"),
            contactNumber: yup.string().matches(/^\d{10,11}$/, "Número de contato no formato incorreto")
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
        const customerFind = await service.findOne({
            where: [
                { email: Not("") && customer.email },
                { contactNumber: customer.contactNumber }
            ]
        });

        if (customerFind) {
            throw new Error("Já existe um registro que possua mesmo e-mail, ou número de contato.");
        }
    }
}
