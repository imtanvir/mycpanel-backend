import nodemailer from 'nodemailer';
import config from '../config';

export const feedbackMailSend = async (to: string, message: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: config.node_env === 'production',
    auth: {
      user: config.nodemailer_auth_user,
      pass: config.nodemailer_auth_pass,
    },
  });

  try {
    await transporter.sendMail({
      from: config.nodemailer_auth_user,
      to,
      subject: 'User Feedback Message',
      text: message,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
