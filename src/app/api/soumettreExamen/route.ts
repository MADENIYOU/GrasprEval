// @ts-nocheck


import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const nomExamen = formData.get("nomExamen") as string;
    const description = formData.get("description") as string;
    const typeExamen = formData.get("typeExamen") as string;
    const dateLimite = formData.get("dateLimite") as string;
    const classes = JSON.parse(formData.get("classes") as string);

    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Insérer l'examen
    for (const classe of classes) {
      await db.execute(
        `INSERT INTO examens (titre, description, type_examen, date_limite, classe) VALUES (?, ?, ?, ?, ?)`,
        [nomExamen, description, typeExamen, dateLimite, classe]
      );
    }

    // Récupérer les emails
    const [rows]: any = await db.execute(
      `SELECT email FROM utilisateurs WHERE role = 'etudiant' AND classe IN (${classes.map(() => "?").join(",")})`,
      classes
    );

    const emails = rows.map((row: any) => row.email);

    // Configurer Nodemailer (⚠️ Utilise un mot de passe d'application)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
      port: 465,
    });

    // Envoyer les emails
    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: '"Université" <menisall54@gmail.com>',
          to: email,
          subject: `Nouvel Examen : ${nomExamen}`,
          text: `Un nouvel examen (${nomExamen}) est disponible.\nDescription : ${description}\nDate limite : ${dateLimite}.`,
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'email à", email, ":", error);
      }
    }

    await db.end();
    return NextResponse.json({ message: "Examen soumis avec succès !" });
  } catch (error) {
    console.error("Erreur :", error);
    return NextResponse.json({ error: "Erreur lors de la soumission de l'examen" }, { status: 500 });
  }
}
