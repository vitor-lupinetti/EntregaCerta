import { Request, Response } from 'express';

import { ScheduleEntity } from '../entities/ScheduleEntity';
import { ScheduleService } from '../services/ScheduleService';

export class ScheduleController {
    public async create(request: Request, response: Response) {
        const { idDelivery, date, place, time } = request.body;

        const scheduleToCreate = new ScheduleEntity();
        scheduleToCreate.idDelivery = idDelivery;
        scheduleToCreate.date = date;
        scheduleToCreate.place = place;
        scheduleToCreate.time = time;

        /**
         * REGEX DATE
         * \d{4} >> 0000 até 9999
         * -
         * (0[1-9])|(1[0-2]) >> 01 até 09 ou 10 até 12
         * -
         * (0[1-9])|([1-3]\d) >> 01 até 09 ou 10 até 39
         * 
         * REGEX TIME
         * (0\d)|([1-2]\d) >> 00 até 09 ou 10 até 29
         * :
         * (0\d)|([1-5]\d) >> 00 até 09 ou 10 até 59
         * 
         * Impedir de criar um objeto Date com o valor Invalid Date
         */
        const regexDate = /^\d{4}-(0[1-9])|(1[0-2])-(0[1-9])|([1-3]\d)$/;
        const regexTime = /^(0\d)|([1-2]\d):(0\d)|([1-5]\d)$/;

        if (regexDate.test(date) && regexTime.test(time)) {
            scheduleToCreate.dateTimeObj = new Date(`${date}T${time}`);
        }

        const scheduleService = new ScheduleService();

        const scheduleCreated = await scheduleService.create(scheduleToCreate);

        return response.status(201).json(scheduleCreated);
    }

    public async cancel(request: Request, response: Response) {
        const { id, reason } = request.body;

        const scheduleService = new ScheduleService();

        await scheduleService.cancel(id, reason);

        return response.status(200).json({ message: "Cancelado com sucesso" });
    }
}
