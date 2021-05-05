import { EntityRepository, Repository } from "typeorm";

import { ScheduleEntity } from "../entities/ScheduleEntity";

@EntityRepository(ScheduleEntity)
export class ScheduleRepository extends Repository<ScheduleEntity> { }
