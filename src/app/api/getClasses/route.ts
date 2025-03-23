// @ts-nocheck


import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Fonction pour récupérer les classes depuis la base de données
export async function GET() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
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
