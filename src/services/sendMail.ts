import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config()
console.log('process', process.env.SMTP_HOST)
const transporter: any = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

export { transporter }