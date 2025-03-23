// @ts-nocheck


import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { RowDataPacket, FieldPacket } from "mysql2";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      "SELECT note FROM distribution_notes"
    );
    await connection.end();

    if (!Array.isArray(rows)) {
      throw new Error("Le résultat de la requête n'est pas un tableau.");
    }

    const data = rows.map((row) => {
      const notes = JSON.parse(row.note);
      return Object.entries(notes).map(([key, value]) => ({
        key,
        value: Number(value),
      }));
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
