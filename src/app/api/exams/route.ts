// app/api/exams/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");

  if (!classId) {
    return NextResponse.json(
      { error: "classId est requis" },
      { status: 400 }
    );
  }

  try {
    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,// Remplacez par le nom de votre base de données
    });

    // Exécuter la requête SQL
    const [rows] = await connection.execute(
      `SELECT * FROM examens WHERE id_enseignant = ? AND classe = ?`,
      [1, classId] // Filtre par id_enseignant = 1 et classe = classId
    );

    // Fermer la connexion
    await connection.end();

    // Retourner les résultats
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des examens :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des examens" },
      { status: 500 }
    );
  }
}