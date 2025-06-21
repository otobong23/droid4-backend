import * as nodemailer from 'nodemailer'
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import EmailTemplate from './mail'
import { config } from 'dotenv'
import ActivationMailTemplate from './ActivationCodeMail';
config()


const transport = nodemailer.createTransport({
   service: 'gmail',
   host: 'smtp.gmail.com',
   secure: false,
   port: 587,
   tls: {
      rejectUnauthorized: false,  // This is necessary in some environments (e.g., local testing)
   },
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
   }
})


export default async function sendMail(to: string, email: string, amount: number, coin: string, transactionId: string) {
   const from = process.env.EMAIL_USER;
   const htmlContent = renderToStaticMarkup(
      createElement(EmailTemplate, { email, amount, coin, transactionId })
   );

   const mailOptions = {
      from,
      to,
      subject: 'DriodIndex-web4: Incoming Transaction Request',
      html: htmlContent,
   };

   const sendMail = await transport.sendMail(mailOptions);
   return sendMail.accepted[0] === to
}


export async function sendActivationMail(to: string, username: string, code: string) {
   const from = process.env.EMAIL_USER;
   const htmlContent = renderToStaticMarkup(
      createElement(ActivationMailTemplate, { username, code })
   );

   const mailOptions = {
      from,
      to,
      subject: 'DriodIndex-web4: Activation Code',
      html: htmlContent,
   };

   const sendMail = await transport.sendMail(mailOptions);
   return sendMail.accepted[0] === to
}