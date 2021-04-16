import * as yup from "yup"

import { NeighborhoodEntity } from "../../entities/NeighborhoodEntity";
import { NeighborhoodService } from "../NeighborhoodService";
import { Validation } from "./Validation";

export class NeighborhoodValidation extends Validation<NeighborhoodEntity> {
    protected async validateKeyFields(neighborhood: NeighborhoodEntity, isCreate: boolean): Promise<void> {
        /**
         * Without key field
         */
    }

    public async validateSimpleFields(neighborhood: NeighborhoodEntity, isCreate: boolean): Promise<void> {
        this.alreadyValidateSimpleFields = true;

        const schema = yup.object().shape({
            name: yup.string().max(20, "Bairro com mais de 20 caracteres").required("Bairro obrigatório")
        });

        try {
            await schema.validate(neighborhood, this.validateOptions);
        } catch (err) {
            this.addErrors(err.errors);
        }
    }

    protected async verifyIfExists(service: NeighborhoodService, neighborhood: NeighborhoodEntity, isCreate: boolean): Promise<void> {
        const neighborhoodFound = await service.findOne({ where: { name: neighborhood.name } });

        if (neighborhoodFound) {
            neighborhood.id = neighborhoodFound.id;
        }
    }
}
