// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// Initialiser Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const nomExamen = formData.get("nomExamen") as string;
    const description = formData.get("description") as string;
    const typeExamen = formData.get("typeExamen") as string;
    const dateLimite = formData.get("dateLimite") as string;
    const classes = JSON.parse(formData.get("classes") as string); // tableau
    const fichier = formData.get("fichier") as File;

    // Upload du fichier dans Supabase
    const buffer = Buffer.from(await fichier.arrayBuffer());
    const fileName = `${Date.now()}_${fichier.name}`;
    const { error: uploadError } = await supabase.storage
      .from("examens")
      .upload(fileName, buffer, {
        contentType: fichier.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Erreur upload Supabase :", uploadError);
      return NextResponse.json({ error: "Échec de l'upload du fichier." }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from("examens").getPublicUrl(fileName);
    const pdfUrl = publicUrlData.publicUrl;

    // Connexion à MySQL
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Insertion pour chaque classe
    for (const classe of classes) {
      await db.execute(
        `INSERT INTO examens (titre, description, type_examen, date_limite, classe, fichier_pdf)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nomExamen, description, typeExamen, dateLimite, classe, pdfUrl]
      );
    }

    // Récupérer les emails des étudiants concernés
    const [rows]: any = await db.execute(
      `SELECT email FROM utilisateurs WHERE role = 'etudiant' AND classe IN (${classes.map(() => "?").join(",")})`,
      classes
    );

    const emails = rows.map((row: any) => row.email);

    // Envoi des notifications par mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
      port: 465,
    });

    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: '"Université" <' + process.env.EMAIL_USER + '>',
          to: email,
          subject: `Nouvel Examen : ${nomExamen}`,
          text: `Un nouvel examen est disponible :\n\nTitre : ${nomExamen}\nDescription : ${description}\nDate limite : ${dateLimite}\n\nLien du fichier : ${pdfUrl}`,
        });
      } catch (error) {
        console.error("Erreur envoi mail à", email, ":", error);
      }
    }

    await db.end();
    return NextResponse.json({ message: "Examen soumis avec succès !" });
  } catch (error) {
    console.error("Erreur :", error);
    return NextResponse.json({ error: "Erreur lors de la soumission" }, { status: 500 });
  }
}
