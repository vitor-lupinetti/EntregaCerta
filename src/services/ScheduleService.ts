import { getCustomRepository } from "typeorm";

import { ScheduleEntity } from "../entities/ScheduleEntity";
import { ScheduleRepository } from "../repositories/ScheduleRepository";
import { MailService } from "./MailService";
import { GenericService } from "./Service";
import { ScheduleValidation } from "./validations/ScheduleValidation";

export class ScheduleService extends GenericService<ScheduleEntity> {
    constructor() {
        super(getCustomRepository(ScheduleRepository), new ScheduleValidation());
    }

    public async create(schedule: ScheduleEntity): Promise<ScheduleEntity> {
        let scheduleCreated = await super.create(schedule);

        let mailService = new MailService();

        mailService.noticeNewSchedule(scheduleCreated);

        return scheduleCreated;
    }

    public async cancel(id: string, reason: string): Promise<void> {
        const scheduleFound = await this.findOne({ where: { id } });

        (this.validation as ScheduleValidation).validateCancel(scheduleFound, reason);

        scheduleFound.reason = reason;

        await this.repository.save(scheduleFound);

        let mailService = new MailService();

        mailService.noticeCanceledSchedule(scheduleFound);
    }
}
