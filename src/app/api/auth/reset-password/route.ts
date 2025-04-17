import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
};

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hash(newPassword, 10);

    const connection = await mysql.createConnection(dbConfig);

    // Vérifier si un code de réinitialisation existe pour l'email
    const [codeRows] = await connection.execute(
      'SELECT * FROM reset_codes WHERE email = ?',
      [email]
    );

    if ((codeRows as any[]).length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'Aucune demande de réinitialisation trouvée.' }, { status: 400 });
    }

    // Mettre à jour le mot de passe
    await connection.execute(
      'UPDATE utilisateurs SET mot_de_passe = ? WHERE email = ?',
      [hashedPassword, email]
    );

    // Supprimer le code de réinitialisation (sécurité)
    await connection.execute(
      'DELETE FROM reset_codes WHERE email = ?',
      [email]
    );

    await connection.end();

    return NextResponse.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur reset-password :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
