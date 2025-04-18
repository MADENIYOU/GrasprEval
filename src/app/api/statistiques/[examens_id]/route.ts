// @ts-nocheck
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export async function GET(
  req: Request,
  context: { params: { examens_id: string } }
) {
  const examensStr =  context.params.examens_id;
  if (!examensStr) {
    return NextResponse.json({ error: "IDs d'examen requis" }, { status: 400 });
  }

  // 1. Convertir "15,16,17" → [15, 16, 17]
  const examensIds = examensStr.split(",").map((id) => parseInt(id.trim())).filter(Boolean);

  try {
    const resultats: { id_examen: number; taux_reussite: number }[] = [];

    for (const id of examensIds) {
      const [rows] = await db.query(
        "SELECT taux_reussite FROM statistiques WHERE id_examen = ?",
        [id]
      );
      const taux = (rows as any[])[0]?.taux_reussite ?? null;
      resultats.push({ id_examen: id, taux_reussite: taux });
    }

    return NextResponse.json(resultats);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
