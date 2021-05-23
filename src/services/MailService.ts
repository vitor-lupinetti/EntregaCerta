import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import { DeliveryEntity } from "../entities/DeliveryEntity";
import { ScheduleEntity } from "../entities/ScheduleEntity";
import { CustomerService } from "./CustomerService";
import DeliveryService from "./DeliveryService";

export class MailService {
    private readonly EMAIL: string;
    private readonly PORT: number;
    private readonly SMTP_SERVER: string;

    private transporter: Mail;

    constructor() {
        this.EMAIL = "noreply.entregacerta@gmail.com";
        this.PORT = 587;
        this.SMTP_SERVER = "smtp.gmail.com";

        this.transporter = nodemailer.createTransport({
            host: this.SMTP_SERVER,
            port: this.PORT,
            auth: {
                user: this.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    public async noticeNewDelivery(delivery: DeliveryEntity) {
        let customerService = new CustomerService();

        let buyer = await customerService.findOne({ where: { id: delivery.idBuyer } });
        let receiver = await customerService.findOne({ where: { id: delivery.idReceiver } });

        let subject = "Nova entrega criada";
        let mainContentMessage = `A entrega ${delivery.description} foi criada.`;

        if (buyer.email) {
            let completeMessage = `Olá ${buyer.name},\n\n${mainContentMessage}`;

            this.send(buyer.email, subject, completeMessage);
        }

        if (receiver.email) {
            let completeMessage = `Olá ${receiver.name},\n\n${mainContentMessage}`;

            this.send(receiver.email, subject, completeMessage);
        }
    }

    public async noticeUpdatedDelivery(delivery: DeliveryEntity) {
        let customerService = new CustomerService();

        let buyer = await customerService.findOne({ where: { id: delivery.idBuyer } });
        let receiver = await customerService.findOne({ where: { id: delivery.idReceiver } });

        let subject = "Entrega atualizada";
        let mainContentMessage = `A entrega ${delivery.description} foi atualizada, seu status atual é ${delivery.status}.`;

        if (buyer.email) {
            let completeMessage = `Olá ${buyer.name},\n\n${mainContentMessage}`;

            this.send(buyer.email, subject, completeMessage);
        }

        if (receiver.email) {
            let completeMessage = `Olá ${receiver.name},\n\n${mainContentMessage}`;

            this.send(receiver.email, subject, completeMessage);
        }
    }

    public async noticeNewStatusDelivery(delivery: DeliveryEntity) {
        let customerService = new CustomerService();

        let buyer = await customerService.findOne({ where: { id: delivery.idBuyer } });
        let receiver = await customerService.findOne({ where: { id: delivery.idReceiver } });

        let subject = "Entrega com novo status";
        let mainContentMessage = `A entrega ${delivery.description} esta atualmente com o status ${delivery.status}.`;

        if (buyer.email) {
            let completeMessage = `Olá ${buyer.name},\n\n${mainContentMessage}`;

            this.send(buyer.email, subject, completeMessage);
        }

        if (receiver.email) {
            let completeMessage = `Olá ${receiver.name},\n\n${mainContentMessage}`;

            this.send(receiver.email, subject, completeMessage);
        }
    }

    public async noticeNewSchedule(schedule: ScheduleEntity) {
        let customerService = new CustomerService();
        let deliveryService = new DeliveryService();

        let delivery = await deliveryService.findOne({ where: { id: schedule.idDelivery } });

        let buyer = await customerService.findOne({ where: { id: delivery.idBuyer } });
        let receiver = await customerService.findOne({ where: { id: delivery.idReceiver } });

        let subject = "Novo agendamento feito";
        let mainContentMessage = `A entrega ${delivery.description} recebeu uma agendamento para entrega.\n\n`;
        mainContentMessage += `Local: ${schedule.place}\n`;
        mainContentMessage += `Data/Hora: ${schedule.dateTimeObj.toLocaleString("pt-br")}`;

        if (buyer.email) {
            let completeMessage = `Olá ${buyer.name},\n\n${mainContentMessage}`;

            this.send(buyer.email, subject, completeMessage);
        }

        if (receiver.email) {
            let completeMessage = `Olá ${receiver.name},\n\n${mainContentMessage}`;

            this.send(receiver.email, subject, completeMessage);
        }
    }

    public async noticeCanceledSchedule(schedule: ScheduleEntity) {
        let customerService = new CustomerService();
        let deliveryService = new DeliveryService();

        let delivery = await deliveryService.findOne({ where: { id: schedule.idDelivery } });

        let buyer = await customerService.findOne({ where: { id: delivery.idBuyer } });
        let receiver = await customerService.findOne({ where: { id: delivery.idReceiver } });

        let subject = "Agendamento cancelado";
        let mainContentMessage = `A entrega ${delivery.description} teve seu agendamento cancelado.\n\n`;
        mainContentMessage += `Motivo: ${schedule.reason}`;

        if (buyer.email) {
            let completeMessage = `Olá ${buyer.name},\n\n${mainContentMessage}`;

            this.send(buyer.email, subject, completeMessage);
        }

        if (receiver.email) {
            let completeMessage = `Olá ${receiver.name},\n\n${mainContentMessage}`;

            this.send(receiver.email, subject, completeMessage);
        }
    }

    public async send(to: string, subject: string, body: string) {
        await this.transporter.sendMail({
            from: this.EMAIL,
            to,
            subject,
            text: body
        });
    }
}
