// lib/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Utilisez le service de votre choix (Gmail, Outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Votre adresse e-mail
    pass: process.env.EMAIL_PASSWORD, // Votre mot de passe ou mot de passe d'application
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