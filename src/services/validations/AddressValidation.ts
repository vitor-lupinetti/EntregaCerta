import { getRepository } from "typeorm";
import * as yup from "yup"

import { AddressEntity } from "../../entities/AddressEntity"
import { NeighborhoodEntity } from "../../entities/NeighborhoodEntity";
import { AddressService } from "../AddressService";
import { NeighborhoodService } from "../NeighborhoodService";
import { Validation } from "./Validation";

export class AddressValidation extends Validation<AddressEntity> {
    protected async validateFields(address: AddressEntity): Promise<void> {
        const schema = yup.object().shape({
            idNeighborhood: yup.string().trim().required("Bairro obrigatório"),
            cep: yup.string().trim().matches(/^\d{8}$/, "CEP no formato incorreto"),
            street: yup.string().trim().max(100, "Rua com mais de 100 caracteres").required("Rua obrigatória")
        });

        await schema.validate(address, this.validateOptions);

        await this.verifyNeighborhoodExists(address.idNeighborhood || "");
    }

    protected async verifyIfExists(service: AddressService, address: AddressEntity): Promise<void> {
        const addressFound = await service.findOne({
            where: [
                { cep: address.cep, street: address.street },
            ]
        });

        if (addressFound) {
            // throw new Error("CEP ou rua já existente");

            address.id = addressFound.id;
        }
    }

    protected async verifyNeighborhoodExists(idNeighborhood: string) {
        const neighborhoodRepository = getRepository(NeighborhoodEntity);
        const neighborhoodService = new NeighborhoodService(neighborhoodRepository);

        const neighborhoodFound = await neighborhoodService.findOne({ where: { id: idNeighborhood } });

        if (!neighborhoodFound) {
            throw new Error("Bairro não encontrado");
        }
    }
}
