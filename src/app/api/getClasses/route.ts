import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Fonction pour récupérer les classes depuis la base de données
export async function GET() {
  const connection = await mysql.createConnection({
    host: "mysql-n0reyni.alwaysdata.net",
    user: "n0reyni_sall",
    password: "passer123",
    database: "n0reyni_bd",
  });

  try {
    const [rows] = await connection.execute(`
      SELECT DISTINCT classe
      FROM utilisateurs
      WHERE classe IS NOT NULL
    `);

    const classes = (rows as { classe: string }[]).map((row) => ({
      id: row.classe,
      name: row.classe,
    }));

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Erreur lors de la récupération des classes :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await connection.end();
  }
}
