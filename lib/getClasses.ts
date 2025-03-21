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
    host: "mysql-n0reyni.alwaysdata.net",
  user: "n0reyni_sall",
  password: "passer123",
  database: "n0reyni_bd",
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