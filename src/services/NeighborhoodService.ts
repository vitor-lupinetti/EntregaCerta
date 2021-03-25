import { getRepository } from "typeorm";

import { NeighborhoodEntity } from "../entities/NeighborhoodEntity";
import { GenericService } from "./Service";
import { NeighborhoodValidation } from "./validations/NeighborhoodValidation";

export class NeighborhoodService extends GenericService<NeighborhoodEntity>{
    constructor() {
        super(getRepository(NeighborhoodEntity), new NeighborhoodValidation());
    }
}
