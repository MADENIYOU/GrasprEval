import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { getUserByEmail, saveResetCode } from '../../../../../lib/db';

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }

  const code = crypto.randomBytes(3).toString('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await saveResetCode(email, code, expiresAt);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    text: `Voici votre code de réinitialisation : ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Code envoyé' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email" }, { status: 500 });
  }
}
