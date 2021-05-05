import { getCustomRepository } from "typeorm";

import { ScheduleEntity } from "../entities/ScheduleEntity";
import { ScheduleRepository } from "../repositories/ScheduleRepository";
import { GenericService } from "./Service";
import { ScheduleValidation } from "./validations/ScheduleValidation";

export class ScheduleService extends GenericService<ScheduleEntity> {
    constructor() {
        super(getCustomRepository(ScheduleRepository), new ScheduleValidation());
    }
}
