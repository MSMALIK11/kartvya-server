// import nodeMailer, { Transport } from "nodeMailer"
// import path from "path"
// import ejs from 'ejs'
// interface EmailOptions {
//     email: string,
//     subject: string,
//     template: string,
//     data: { [key: string]: any }
// }

// export const sendMail = async (options: EmailOptions): Promise<void>{
//     // const transporter: Transport = nodeMailer.createTransport({
//     //     host: process.env.SMTP_HOST,
//     //     port: Number(process.env.SMTP_PORT),
//     //     service: process.env.SMTP_SERVICES,
//     //     auth: {
//     //         user: process.env.SMTP_MAIL,
//     //         pass: process.env.SMTP_PASSWORD
//     //     }

//     // })
//     // const { email, subject, template, data } = options
//     // const templatePath = path.join(__dirname, '../template', template)

//     // const html: string = await ejs.renderFile(templatePath, data)
//     // const mailOptions = {
//     //     from: process.env.SMTP_MAIL,
//     //     to: email,
//     //     subject,
//     //     html
//     // }
//     // transporter.sendMail(mailOptions)

// }

