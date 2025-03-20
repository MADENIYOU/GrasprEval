import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "mysql-n0reyni.alwaysdata.net",
  user: "n0reyni_sall",
  password: "passer123",
  database: "n0reyni_bd",
    });

    const [rows] = await connection.execute("SELECT note FROM distribution_notes");
    await connection.end();

    const data = rows.map((row: any) => {
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