// @ts-nocheck


import mysql from "mysql2/promise";

// Type pour les classes
interface Class {
  id: string;
  name: string;
}

// Fonction pour récupérer les classes depuis la base de données
export const getClasses = async (): Promise<Class[]> => {
  // Configuration de la connexion à la base de données
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

    return classes;
  } catch (error) {
    console.error("Erreur lors de la récupération des classes :", error);
    return [];
  } finally {
    
    await connection.end();
  }
};