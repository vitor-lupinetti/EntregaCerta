import { Request, Response } from 'express';

import { ScheduleEntity } from '../entities/ScheduleEntity';
import { ScheduleService } from '../services/ScheduleService';
import { DateTimeValidation } from '../services/validations/DateTimeValidation';

export class ScheduleController {
    public async create(request: Request, response: Response) {
        const { idDelivery, date, place, time } = request.body;

        const scheduleToCreate = new ScheduleEntity();
        scheduleToCreate.idDelivery = idDelivery;
        scheduleToCreate.date = date;
        scheduleToCreate.place = place;
        scheduleToCreate.time = time;

        const dateTimeValidation = new DateTimeValidation();

        if (
            dateTimeValidation.validateDate(date)
            && dateTimeValidation.validateTime(time)
        ) {
            scheduleToCreate.dateTimeObj = new Date(`${date}T${time}`);
        }

        const scheduleService = new ScheduleService();

        const scheduleCreated = await scheduleService.create(scheduleToCreate);

        return response.status(201).json(scheduleCreated);
    }

    public async findOne(request: Request, response: Response){
        const { id } = request.params;
        const scheduleService = new ScheduleService();

        let scheduleFound = await scheduleService.findOne({where: {idDelivery:id, reason: null}})

        if(!scheduleFound){
            return response.status(404).json({ message: "Agendamento não encontrado!" });
        }

        return response.status(200).json(scheduleFound);
    }

    public async cancel(request: Request, response: Response) {
        const { id, reason } = request.body;

        const scheduleService = new ScheduleService();

        await scheduleService.cancel(id, reason);

        return response.status(200).json({ message: "Cancelado com sucesso" });
    }
}
