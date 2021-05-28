import { getConnection } from "typeorm";

import createConnection from "../src/database";
import { DeliveryEntity } from "../src/entities/DeliveryEntity";
import { ScheduleEntity } from "../src/entities/ScheduleEntity";
import { EnumDeliveryStatus } from "../src/enums/EnumDeliveryStatus";
import { CustomerService } from "../src/services/CustomerService";
import DeliveryService from "../src/services/DeliveryService";
import { ScheduleService } from "../src/services/ScheduleService";
import { DeliveryValidation } from "../src/services/validations/DeliveryValidation";
import { ScheduleValidation } from "../src/services/validations/ScheduleValidation";

beforeAll(async () => {
    let connection = await createConnection();

    await connection.runMigrations();
});

afterAll(async () => {
    let connection = getConnection();

    await connection.dropDatabase();
    await connection.close();
});

test("Não deve cadastrar entrega sem usuário do tipo Receiver", async () => {
    let now = new Date();
    let dateNow = now.toISOString().replace(/T.*/, "");
    let timeNow = now.toISOString().replace(/.*T/, "").replace(/^(\d{2}:\d{2})(.*)/, "$1");

    let customerService = new CustomerService();

    let buyer = await customerService.findOne({ where: { name: "clienttest1" } });

    let delivery = new DeliveryEntity();
    delivery.description = "deliverytest2";
    delivery.idBuyer = buyer.id || "";
    delivery.idReceiver = buyer.id || "";
    delivery.purchaseDate = dateNow;
    delivery.purchaseTime = timeNow;
    delivery.status = EnumDeliveryStatus.CREATED;

    let deliveryService = new DeliveryService();

    let deliveryValidation = new DeliveryValidation();

    try {
        await deliveryValidation.validateCreate(deliveryService, delivery);
    } catch (error) {
        expect(error.message).toContain("Recebedor não encontrado!");
    }
});

test("Não deve agendar entrega repetida", async () => {
    let scheduleService = new ScheduleService();

    let scheduleDone = await scheduleService.findOne({ where: { place: "placescheduletest1" } });
    let dateTime = new Date(`${scheduleDone.date}T${scheduleDone.time}.000Z`);
    let date = dateTime.toISOString().replace(/T.*/, "");
    let time = dateTime.toISOString().replace(/.*T/, "").replace(/^(\d{2}:\d{2})(.*)/, "$1");

    let repeatedSchedule = new ScheduleEntity();
    repeatedSchedule.idDelivery = scheduleDone.idDelivery;
    repeatedSchedule.date = date;
    repeatedSchedule.place = "placescheduletest2";
    repeatedSchedule.time = time;
    repeatedSchedule.dateTimeObj = dateTime;

    let scheduleValidation = new ScheduleValidation();

    let wasValidated = false;

    try {
        await scheduleValidation.validateCreate(scheduleService, repeatedSchedule);
        wasValidated = true;
    } catch (error) {
        expect(error.message).toContain("Já existe um agendamento como esse");
    }

    expect(wasValidated).toBe(false);
});
