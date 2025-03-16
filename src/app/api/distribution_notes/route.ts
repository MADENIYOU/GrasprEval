import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "projet",
    });

    // Récupérer les données
    const [rows] = await connection.execute("SELECT note FROM distribution_notes");
    await connection.end();

    // Transformer les données pour D3
    let noteCounts: Record<string, number> = {};
    rows.forEach((row: any) => {
      const notes = JSON.parse(row.note);
      Object.entries(notes).forEach(([note, count]) => {
        noteCounts[note] = (noteCounts[note] || 0) + count;
      });
    });

    // Convertir en tableau pour le graphique
    const data = Object.entries(noteCounts).map(([key, value]) => ({
      key,
      value: Number(value),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
