import { getCustomRepository } from "typeorm";

import { NeighborhoodEntity } from "../entities/NeighborhoodEntity";
import { NeighborhoodRepository } from "../repositories/NeighborhoodRepository";
import { GenericService } from "./Service";
import { NeighborhoodValidation } from "./validations/NeighborhoodValidation";

export class NeighborhoodService extends GenericService<NeighborhoodEntity>{
    constructor() {
        super(getCustomRepository(NeighborhoodRepository), new NeighborhoodValidation());
    }

    public async onlyValidateCreate(neighborhood: NeighborhoodEntity): Promise<string[]> {
        this.validation.disableThrowErrors();
        await this.validation.validateCreate(this, neighborhood);

        return this.validation.getErrors();
    }
}
