import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

const dbConfig = {
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
};

// ✅ Utilisateur
export async function getUserByEmail(email: string) {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT * FROM utilisateurs WHERE email = ?',
    [email]
  );
  await connection.end();
  return rows.length > 0 ? rows[0] : null;
}

// ✅ Enregistrer ou mettre à jour un code
export async function saveResetCode(email: string, code: string, expiresAt: Date) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute(
    `INSERT INTO reset_codes (email, code, expiration, attempts)
     VALUES (?, ?, ?, 0)
     ON DUPLICATE KEY UPDATE code = VALUES(code), expiration = VALUES(expiration), attempts = 0`,
    [email, code, expiresAt]
  );
  await connection.end();
}

// ✅ Récupérer les données du code
export async function getResetCodeData(email: string) {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT code, expiration AS expiresAt, attempts FROM reset_codes WHERE email = ?`,
    [email]
  );
  await connection.end();
  return rows.length > 0 ? rows[0] : null;
}

// ✅ Incrémenter les tentatives
export async function incrementAttempt(email: string) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute(
    `UPDATE reset_codes SET attempts = attempts + 1 WHERE email = ?`,
    [email]
  );
  await connection.end();
}

// ✅ Réinitialiser les tentatives
export async function resetAttempts(email: string) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute(
    `UPDATE reset_codes SET attempts = 0 WHERE email = ?`,
    [email]
  );
  await connection.end();
}

// ✅ Bloquer l’utilisateur (Il n'y a pas de champ 'is_blocked' dans la table, donc cette fonction est ignorée dans cette version)
export async function blockUser(email: string) {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      `UPDATE reset_codes SET is_blocked = 1 WHERE email = ?`,
      [email]
    );
    await connection.end();
  }