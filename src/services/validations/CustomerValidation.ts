import { FindConditions, Not } from "typeorm";
import * as yup from "yup";

import { CustomerEntity } from "../../entities/CustomerEntity";
import { EnumDeliveryStatus } from "../../enums/EnumDeliveryStatus";
import { AppError } from "../../errors/AppError";
import { CustomerService } from "../CustomerService";
import DeliveryService from "../DeliveryService";
import { Validation } from "./Validation";

export class CustomerValidation extends Validation<CustomerEntity> {
    public async validateDelete(service: CustomerService, id: string): Promise<void> {
        const customer = await service.findOne({
            where: { id },
            relations: ["userEntity", "userEntity.userTypeEntity"]
        });

        if (!customer) {
            throw new AppError("Registro não encontrado", 404);
        }

        await this.verifyPendingDeliveryExists(id);

        this.throwErrors();
    }

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

        try {
            await schema.validate(customer, this.validateOptions);
        } catch (err) {
            this.addErrors(err.errors);
        }
    }

    protected async verifyIfExists(service: CustomerService, customer: CustomerEntity, isCreate: boolean): Promise<void> {
        let whereConditions: FindConditions<CustomerEntity>[] = [
            { contactNumber: customer.contactNumber }
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
                    ...whereConditions[1],
                    id: Not(customer.id)
                };
            }
        }

        let customerFound = await service.findOne({ where: whereConditions });

        if (customerFound) {
            this.errors.push("Já existe um registro que possua mesmo e-mail ou número de contato.");
        }
    }

    protected async verifyPendingDeliveryExists(idClient: string): Promise<void> {
        const deliveryService = new DeliveryService();

        const deliveryFound = await deliveryService.findOne({
            where: [
                {
                    idBuyer: idClient,
                    status: Not(EnumDeliveryStatus.FINISHED)
                },
                {
                    idReceiver: idClient,
                    status: Not(EnumDeliveryStatus.FINISHED)
                }
            ]
        });

        if (deliveryFound) {
            this.errors.push("Primeiro resolva as entregas pendentes");
        }
    }
}
