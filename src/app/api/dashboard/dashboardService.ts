import mysql from "mysql2/promise";

// Fonction pour récupérer toutes les données du dashboard
export async function getDashboardData() {
  const connection = await mysql.createConnection({
    host: "mysql_db", 
    user: "root",
    password: "password", // Assurez-vous que le mot de passe est correct
    database: "mydatabase", // Assurez-vous que la base de données existe
  });

  try {
    // Exécuter la requête SQL pour récupérer les données
    const [rows] = await connection.execute(`
      SELECT
        (SELECT COUNT(DISTINCT classe) FROM utilisateurs WHERE classe IS NOT NULL) AS classesCount,
        (SELECT COUNT(*) FROM examens) AS examsCount,
        (SELECT COUNT(*) FROM utilisateurs WHERE role = 'etudiant') AS studentsCount
    `);

    // Extraire les résultats
    const data = {
      classesCount: (rows as { classesCount: number }[])[0].classesCount,
      examsCount: (rows as { examsCount: number }[])[0].examsCount,
      studentsCount: (rows as { studentsCount: number }[])[0].studentsCount,
    };

    console.log("Données récupérées :", data); // Log pour déboguer

    // Convertir l'objet en JSON
    const jsonData = JSON.stringify(data);
    return jsonData; // Retourner les données en JSON
  } catch (error) {
    console.error("Erreur lors de la récupération des données du dashboard :", error); // Log l'erreur complète

    // Retourner des valeurs par défaut en JSON en cas d'erreur
    const errorData = JSON.stringify({ classesCount: 0, examsCount: 0, studentsCount: 0 });
    return errorData;
  } finally {
    // Fermer la connexion
    await connection.end();
  }
}