import nodemailer from "nodemailer";

export class MailService {
    private readonly EMAIL: string;
    private readonly PORT: number;
    private readonly SMTP_SERVER: string;

    constructor() {
        this.EMAIL = "noreply.entregacerta@gmail.com";
        this.PORT = 587;
        this.SMTP_SERVER = "smtp.gmail.com";
    }

    async send(to: string, subject: string, body: string) {
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
