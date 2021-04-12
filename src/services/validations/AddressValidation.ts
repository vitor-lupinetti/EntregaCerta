import * as yup from "yup"

import { AddressEntity } from "../../entities/AddressEntity"
import { AppError } from "../../errors/AppError";
import { AddressService } from "../AddressService";
import { NeighborhoodService } from "../NeighborhoodService";
import { Validation } from "./Validation";

export class AddressValidation extends Validation<AddressEntity> {
    protected async validateFields(address: AddressEntity, isCreate: boolean): Promise<void> {
        const schema = yup.object().shape({
            idNeighborhood: yup.string().required("Bairro obrigatório"),
            cep: yup.string().matches(/^\d{8}$/, "CEP no formato incorreto"),
            street: yup.string().max(100, "Rua com mais de 100 caracteres").required("Rua obrigatória")
        });

        await schema.validate(address, this.validateOptions);

        await this.verifyNeighborhoodExists(address.idNeighborhood || "");
    }

    protected async verifyIfExists(service: AddressService, address: AddressEntity, isCreate: boolean): Promise<void> {
        const addressFound = await service.findOne({
            where: { cep: address.cep, street: address.street }
        });

        if (addressFound) {
            address.id = addressFound.id;
        }
    }

    protected async verifyNeighborhoodExists(idNeighborhood: string) {
        const neighborhoodService = new NeighborhoodService();

        const neighborhoodFound = await neighborhoodService.findOne({ where: { id: idNeighborhood } });

        if (!neighborhoodFound) {
            throw new AppError("Bairro não encontrado");
        }
    }
}
