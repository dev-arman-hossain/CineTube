import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    secure: Number(config.smtp_port) === 465,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: config.email_from,
    to,
    subject,
    html,
  });
};
