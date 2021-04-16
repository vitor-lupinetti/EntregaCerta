import nodemailer from "nodemailer";
import { DeliveryEntity } from "../entities/DeliveryEntity";
import { CustomerService } from "./CustomerService";

export class MailService {
    private readonly EMAIL: string;
    private readonly PORT: number;
    private readonly SMTP_SERVER: string;

    constructor() {
        this.EMAIL = "noreply.entregacerta@gmail.com";
        this.PORT = 587;
        this.SMTP_SERVER = "smtp.gmail.com";
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
        let mainContentMessage = `A entrega ${delivery.description} foi atualizada`;

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
        let transporter = nodemailer.createTransport({
            host: this.SMTP_SERVER,
            port: this.PORT,
            auth: {
                user: this.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: this.EMAIL,
            to,
            subject,
            text: body
        });
    }
}
