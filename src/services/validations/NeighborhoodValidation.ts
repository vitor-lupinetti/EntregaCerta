import * as yup from "yup"

import { NeighborhoodEntity } from "../../entities/NeighborhoodEntity"
import { NeighborhoodService } from "../NeighborhoodService";
import { Validation } from "./Validation";

export class NeighborhoodValidation extends Validation<NeighborhoodEntity> {
    protected async validateFields(neighborhood: NeighborhoodEntity): Promise<void> {
        const schema = yup.object().shape({
            name: yup.string().trim().max(20, "Bairro com mais de 20 caracteres").required("Bairro obrigatório")
        });

        await schema.validate(neighborhood, this.validateOptions);
    }

    protected async verifyIfExists(service: NeighborhoodService, neighborhood: NeighborhoodEntity): Promise<void> {
        const neighborhoodFound = await service.findOne({ where: { name: neighborhood.name } });

        if (neighborhoodFound) {
            neighborhood.id = neighborhoodFound.id;
        }
    }
}
