import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  const { nom, prenom, email, mot_de_passe } = await request.json();

  if (!nom || !prenom || !email || !mot_de_passe) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const db = await mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  const [existingUser] = await db.query("SELECT id FROM utilisateurs WHERE email = ?", [email]);

  if (Array.isArray(existingUser) && existingUser.length > 0) {
    return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
  }

  const hashedPassword = await hash(mot_de_passe, 10);

  await db.query(
    "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, 'enseignant')",
    [nom, prenom, email, hashedPassword]
  );

  return NextResponse.json({ success: true });
}
