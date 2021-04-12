import { FindConditions, Not } from "typeorm";
import * as yup from "yup";

import { CustomerEntity } from "../../entities/CustomerEntity";
import { AppError } from "../../errors/AppError";
import { CustomerService } from "../CustomerService";
import { Validation } from "./Validation";

export class CustomerValidation extends Validation<CustomerEntity> {
    protected async validateFields(customer: CustomerEntity, isCreate: boolean): Promise<void> {
        let validations = {
            complement: yup.string().max(100, "Complemento com mais de 100 caracteres"),
            contactNumber: yup.string().matches(/^\d{10,11}$/, "Número de contato no formato incorreto"),
            homeNumber: yup.string().required("Número da casa obrigatório"),
            email: yup.string().email("E-mail em formato inválido"),
            hasWhatsApp: yup.string().max(1).required("Informe se possue whats"),
            name: yup.string().max(70, "Nome com mais de 70 caracteres").required("Informe o seu nome"),
            photo: yup.string().required("Foto obrigatória")
        };

        if (!isCreate) {
            validations = Object.assign(validations, {
                photo: yup.string()
            });
        }

        const schema = yup.object().shape(validations);

        await schema.validate(customer, this.validateOptions);
    }

    protected async validateFieldsUpdate(customer: CustomerEntity): Promise<void> {
        const schema = yup.object().shape({
            complement: yup.string().trim().max(100, "Complemento com mais de 100 caracteres"),
            contactNumber: yup.string().trim().matches(/^\d{10,11}$/, "Número de contato no formato incorreto"),
            homeNumber: yup.string().trim().required("Número da casa obrigatório"),
            email: yup.string().trim().email("E-mail em formato inválido"),
            hasWhatsApp: yup.string().trim().max(1).required("Informe se possue whats"),
            name: yup.string().trim().required("Informe o seu nome"),
            //addressEntity: yup.object().shape({
            //    cep: yup.string().trim().matches(/^\d{8}$/, "CEP no formato incorreto"),
            //    street: yup.string().trim().required("Rua não pode ser vazia"),
            //    neighborhoodEntity: yup.object().shape({ name: yup.string().trim().required("Nome do bairro não pode ser vazio") })
            //}),

        });

        await schema.validate(customer, this.validateOptions);
    }

    protected async verifyIfExists(service: CustomerService, customer: CustomerEntity, isCreate: boolean): Promise<void> {
        let whereConditions: FindConditions<CustomerEntity>[] = [
            {
                contactNumber: customer.contactNumber
            }
        ];

        if (customer.email) {
            whereConditions.push({ email: customer.email });
        }

        if (!isCreate) {
            whereConditions[0] = {
                ...whereConditions[0],
                id: Not(customer.id)
            };

            if (customer.email) {
                whereConditions[1] = {
                    ...whereConditions[0],
                    id: Not(customer.id)
                };
            }
        }

        let customerFound = await service.findOne({ where: whereConditions });

        if (customerFound) {
            throw new AppError("Já existe um registro que possua mesmo e-mail, ou número de contato.");
        }
    }

    protected async verifyIfExistsForUpdate(service: CustomerService, customer: CustomerEntity): Promise<void> {
        let customerFind;
        let whereConditions: FindConditions<CustomerEntity> = {
            id: Not(customer.id)
        };

        if (customer.email) {
            customerFind = await service.findOne({
                where: {
                    ...whereConditions,
                    email: customer.email
                }
            });

            if (customerFind) {
                throw new AppError("Já existe um registro que possua mesmo e-mail.");
            }
        }

        customerFind = await service.findOne({
            where: {
                ...whereConditions,
                contactNumber: customer.contactNumber
            }
        });

        if (customerFind) {
            throw new AppError("Já existe um registro que possua mesmo número de contato.");
        }
    }

    public async validateOnUpdate(service: CustomerService, customer: CustomerEntity) {
        await this.validateFieldsUpdate(customer);
        await this.verifyIfExistsForUpdate(service, customer);
    }
}
