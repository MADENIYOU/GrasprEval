import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Connexion à la base de données
async function connectDB() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { titre: string } }
) {
  const titreExamen = decodeURIComponent(params.titre);
  console.log("Titre d'examen demandé :", titreExamen);

  try {
    const connection = await connectDB();

    const [rows] = await connection.execute(
      `
      SELECT dn.note, dn.nombre_etudiants
      FROM distribution_notes dn
      JOIN examens e ON e.id = dn.id_examen
      WHERE e.titre = ?
      `,
      [titreExamen]
    );

    await connection.end();

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: "Aucune distribution trouvée pour cet examen" },
        { status: 404 }
      );
    }

    const distribution = (rows as any[]).map((row) => ({
      note: row.note,
      nombre_etudiants: row.nombre_etudiants,
    }));

    return NextResponse.json({
      titre: titreExamen,
      distribution,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
