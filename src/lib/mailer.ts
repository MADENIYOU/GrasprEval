// lib/mailer.ts
// @ts-nocheck
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Expéditeur
    to, // Destinataire
    subject, // Sujet de l'e-mail
    text, // Corps de l'e-mail (version texte)
    html: `<p>${text}</p>`, // Corps de l'e-mail (version HTML)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail envoyé à ${to}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'e-mail à ${to} :`, error);
  }
}