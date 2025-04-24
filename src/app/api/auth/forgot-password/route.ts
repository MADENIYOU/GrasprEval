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

  const code = crypto.randomBytes(3).toString('hex').toUpperCase();
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
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 40px;">
        <!-- Header -->
        <h1 style="font-size: 2.5rem; text-align: center; margin-bottom: 30px;">
          <span style="background: linear-gradient(to right, #a855f7, #3b82f6); -webkit-background-clip: text; color: transparent;">
            Graspr
          </span>
          <span style="font-weight: 800; color: #ffffff;">Eval</span>
        </h1>

        <!-- Body -->
        <div style="background-color: #1e293b; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 40px;">
          <p style="font-size: 18px;">Voici votre code de réinitialisation :</p>
          <p style="font-size: 28px; font-weight: bold; color: #3b82f6; margin-top: 10px;">${code}</p>
          <p style="font-size: 14px; margin-top: 20px;">Ce code expirera dans 10 minutes.</p>
        </div>

        <!-- Footer -->
        <footer style="text-align: center; font-size: 14px; color: #d1d5db;">
          <p style="margin: 0;">© Copyright 2025 <strong style="color: white;">GrasprEval</strong></p>
          <p style="margin-top: 5px;">
            <a href="#" style="color: #a5b4fc; margin: 0 10px; text-decoration: none;">About</a>
            <a href="#" style="color: #a5b4fc; margin: 0 10px; text-decoration: none;">Services</a>
            <a href="#" style="color: #a5b4fc; margin: 0 10px; text-decoration: none;">Privacy Policy</a>
            <a href="#" style="color: #a5b4fc; margin: 0 10px; text-decoration: none;">Terms</a>
            <a href="#" style="color: #a5b4fc; margin: 0 10px; text-decoration: none;">Support</a>
          </p>
        </footer>
      </div>
    `,
  };


  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Code envoyé' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email" }, { status: 500 });
  }
}
