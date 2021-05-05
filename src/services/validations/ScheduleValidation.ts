import { IsNull } from "typeorm";
import * as yup from "yup";

import { ScheduleEntity } from "../../entities/ScheduleEntity";
import { EnumDeliveryStatus } from "../../enums/EnumDeliveryStatus";
import DeliveryService from "../DeliveryService";
import { ScheduleService } from "../ScheduleService";
import { Validation } from "./Validation";

export class ScheduleValidation extends Validation<ScheduleEntity> {
    protected async validateFields(schedule: ScheduleEntity, isCreate: boolean): Promise<void> {
        const schema = yup.object().shape({
            date: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, "Data no formato incorreto"),
            place: yup.string().max(100, "Local com mais de 100 caracteres").required("Local obrigatório"),
            time: yup.string().matches(/^\d{2}:\d{2}$/, "Horário no formato incorreto")
        });

        try {
            await schema.validate(schedule, this.validateOptions);
        } catch (err) {
            this.addErrors(err.errors);
        }

        if (!schedule.dateTimeObj) {
            this.errors.push("Data e/ou hora incorreto");
        } else if (schedule.dateTimeObj.getTime() < (new Date()).getTime()) {
            this.errors.push("Data e hora não podem ser menor que agora");
        }

        await this.verifyIfCanSchedule(schedule.idDelivery);
    }

    protected async verifyIfExists(service: ScheduleService, schedule: ScheduleEntity, isCreate: boolean): Promise<void> {
        const scheduleFound = await service.findOne({
            where: {
                idDelivery: schedule.idDelivery,
                date: schedule.date,
                reason: IsNull()
            }
        });

        if (scheduleFound) {
            this.errors.push("Já existe um agendamento como esse");
        }
    }

    private async verifyIfCanSchedule(idDelivery: string) {
        const delivery = await this.verifyDeliveryExists(idDelivery);

        if (!delivery) {
            return;
        }

        if (delivery.status !== EnumDeliveryStatus.RECEIVER_RECEIVED) {
            this.errors.push("Status atual da entrega não permite fazer agendamento para ela");
        }
    }

    private async verifyDeliveryExists(idDelivery: string) {
        const deliveryService = new DeliveryService();

        const deliveryFound = await deliveryService.findOne({ where: { id: idDelivery } });

        if (!deliveryFound) {
            this.errors.push("Entrega não encontrada");
        }

        return deliveryFound;
    }
}
