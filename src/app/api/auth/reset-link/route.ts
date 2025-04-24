// @ts-nocheck

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import mysql from 'mysql2/promise'; 

// Configuration de la connexion à MySQL
const db = mysql.createPool({
  host: process.env.MYSQL_HOST, 
  user: process.env.MYSQL_USER, 
  password: process.env.MYSQL_PASSWORD, 
  database: process.env.MYSQL_DATABASE,
});

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  
  const [rows] = await db.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }

  
  const [existingCodeRows] = await db.execute('SELECT * FROM reset_codes WHERE email = ? AND expiration > NOW()', [email]);

  if (existingCodeRows.length > 0) {
    return NextResponse.json({ error: 'Un code de réinitialisation actif a déjà été envoyé à cet email.' }, { status: 400 });
  }

  
  const resetCode = Math.random().toString(36).substr(2, 6).toUpperCase();
  const expirationTime = new Date(Date.now() + 3600000);

  // Insérer le code et ses informations dans la table reset_codes
  await db.execute(
    'INSERT INTO reset_codes (email, code, expiration, attempts, is_blocked) VALUES (?, ?, ?, 0, 0)',
    [email, resetCode, expirationTime]
  );

  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetLink = `${process.env.BASE_URL}/auth/reset-password?code=${resetCode}&email=${email}`;

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
          <p style="font-size: 18px;">Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
          <p style="font-size: 22px; font-weight: bold; color: #3b82f6; margin-top: 10px;">
            <a href="${resetLink}" style="color: #3b82f6; text-decoration: none;">Cliquer ici pour changer votre mot de passe</a>
          </p>
          <p style="font-size: 14px; margin-top: 20px;">Le lien expirera dans 1 heure.</p>
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
  

  // Envoi de l'email
  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: 'Un lien de réinitialisation a été envoyé à votre email.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email.' }, { status: 500 });
  }
}
