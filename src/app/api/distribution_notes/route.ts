// @ts-nocheck
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { RowDataPacket, FieldPacket } from "mysql2";
import { getServerSession } from "next-auth"; // Correctement importé depuis next-auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Assurez-vous que le chemin est correct

export async function GET(request: Request) {
  try {
    // Récupérer la session utilisateur avec getServerSession
    const session = await getServerSession(authOptions, request); // Utilisation correcte de getServerSession

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    const profId = session.user.id;

    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Récupérer les examens publiés par l'enseignant
    const [examens] = await connection.execute(
      "SELECT id FROM examens WHERE id_enseignant = ?",
      [profId]
    );

    const examensIds = examens.map((e) => e.id);

    if (examensIds.length === 0) {
      return NextResponse.json({ error: "Aucun examen trouvé pour cet enseignant" }, { status: 404 });
    }

    // Récupérer les distributions de notes pour les examens de cet enseignant
    const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      `SELECT note FROM distribution_notes WHERE id_examen IN (?)`,
      [examensIds]
    );

    await connection.end();

    if (!Array.isArray(rows)) {
      throw new Error("Le résultat de la requête n'est pas un tableau.");
    }

    // Manipuler les notes pour les rendre exploitables
    const data = rows.map((row) => {
      const notes = JSON.parse(row.note);
      return Object.entries(notes).map(([key, value]) => ({
        key,
        value: Number(value),
      }));
    });

    return NextResponse.json(data); // Réponse correcte avec NextResponse.json
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
