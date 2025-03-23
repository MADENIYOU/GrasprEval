import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: Request, { params }: { params: { examId: string } }) {
  // Attendre que params soit résolu avant d'utiliser examId
  const { examId } = await params; // Résolution asynchrone des paramètres

  try {
    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE, // Remplacez par le nom de votre base de données
    });

    // Récupérer les copies et les informations des étudiants
    const [rows] = await connection.execute(
      `SELECT copies.*, utilisateurs.nom, utilisateurs.prenom, utilisateurs.email
       FROM copies
       INNER JOIN utilisateurs ON copies.id_etudiant = utilisateurs.id
       WHERE copies.id_examen = ?`,
      [examId]
    );

    // Fermer la connexion
    await connection.end();

    // console.log(rows);

    // Retourner les résultats
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des copies :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des copies" },
      { status: 500 }
    );
  }
}
