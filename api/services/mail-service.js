const nodemailer = require("nodemailer");

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            secure: false,
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMPT_PASSWORD
            }
        });
    }

    async sendActivationMail(email, link) {
        await this.transporter.sendMail({
            from: "TimeTracker",
            to: email,
            subject: "Activation link from TimeTracker",
            text: "",
            html:
                `
                    <div>
                        <h1>Click on the link below to activate your account:</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        });
    }
}

module.exports = new MailService();
