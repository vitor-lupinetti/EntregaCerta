import * as yup from "yup"

import { AddressEntity } from "../../entities/AddressEntity";
import { AddressService } from "../AddressService";
import { NeighborhoodService } from "../NeighborhoodService";
import { Validation } from "./Validation";

export class AddressValidation extends Validation<AddressEntity> {
    protected async validateKeyFields(address: AddressEntity, isCreate: boolean): Promise<void> {
        await this.verifyNeighborhoodExists(address.idNeighborhood || "");
    }

    public async validateSimpleFields(address: AddressEntity, isCreate: boolean): Promise<void> {
        this.alreadyValidateSimpleFields = true;

        const schema = yup.object().shape({
            cep: yup.string().matches(/^\d{8}$/, "CEP no formato incorreto"),
            street: yup.string().max(100, "Rua com mais de 100 caracteres").required("Rua obrigatória")
        });

        try {
            await schema.validate(address, this.validateOptions);
        } catch (err) {
            this.addErrors(err.errors);
        }
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
            this.errors.push("Bairro não encontrado");
        }
    }
}
