import { createTransport } from "nodemailer";
import getValidationTemplate from "./validateTemplate.js";



class Nodemailer{
    constructor(service, port, user, pass){

        this.createValidationTemplate = getValidationTemplate;

        this.transporter= createTransport({
            service: "gmail",
            port:465,
            auth: {
                user: 'cryptocoders2022@gmail.com',
                pass: 'hxqsxpqacpgxsimu',
            },
        });

    }

     configureMail(email, subject, html){
         let mailOptions = {
             from: 'Stoppery',
             to: email,
             bbc: "cryptocoders2022@gmail.com",
             subject: subject,
             html:html
            };
            return mailOptions
    }


    async sendMail(mailOptions){
        try{
            await this.transporter.sendMail(mailOptions);
            console.log("Email sent");
        }catch(err){
            console.log(err);
        }
    }

   


}

let mailer = new Nodemailer();
export default mailer;