// src/app/api/examens/[enseignant_id]/route.ts

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Connexion à la base de données (PAS besoin de await ici)
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// GET method
export async function GET(
  req: Request,
  context: { params: { enseignant_id: string } }
) {
  const enseignantId = context.params.enseignant_id;

  if (!enseignantId) {
    return NextResponse.json({ error: "Enseignant ID est requis" }, { status: 400 });
  }

  try {
    const [rows] = await db.query(
      "SELECT id, titre FROM examens WHERE id_enseignant = ?",
      [enseignantId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des examens" }, { status: 500 });
  }
}
