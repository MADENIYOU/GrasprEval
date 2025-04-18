// @ts-nocheck
import mysql from "mysql2/promise";

export async function getDashboardData(profId: number) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    // 1. Récupérer les examens publiés par le prof
    const [examens] = await connection.execute(
      "SELECT id, classe FROM examens WHERE id_enseignant = ?",
      [profId]
    );

    const examensIds = examens.map(e => e.id);
    const classes = examens.map(e => e.classe);
    const classesUniques = [...new Set(classes)];

    // 2. Compter les élèves dans les classes du prof
    let studentsCount = 0;
    if (classesUniques.length > 0) {
      const placeholders = classesUniques.map(() => '?').join(',');
      const [etudiants] = await connection.execute(
        `SELECT COUNT(*) as total FROM utilisateurs WHERE role = 'etudiant' AND classe IN (${placeholders})`,
        classesUniques
      );
      studentsCount = etudiants[0]?.total || 0;
    }

    // 3. Récupérer les distributions de notes pour ses examens
    let notesDistributions = [];
    if (examensIds.length > 0) {
      const placeholders = examensIds.map(() => '?').join(',');
      const [distributions] = await connection.execute(
        `SELECT id_examen, note, nombre_etudiants FROM distribution_notes WHERE id_examen IN (${placeholders})`,
        examensIds
      );

      notesDistributions = distributions.map(dist => ({
        id_examen: dist.id_examen,
        note: safeParseNote(dist.note), // Utilisation de la fonction de parsing sécurisé
        nombre_etudiants: dist.nombre_etudiants,
      }));
    }

    return {
      classesCount: classesUniques.length,
      examsCount: examensIds.length,
      studentsCount,
      notesDistributions,
    };
  } catch (error) {
    console.error("Erreur dashboard prof :", error);
    return {
      classesCount: 0,
      examsCount: 0,
      studentsCount: 0,
      notesDistributions: [],
    };
  } finally {
    await connection.end();
  }
}

// Fonction de parsing sécurisé pour éviter les erreurs avec des données mal formatées
function safeParseNote(note: any) {
  try {
    // Si note est une chaîne, essayer de la parser en objet
    return typeof note === "string" ? JSON.parse(note) : note;
  } catch (error) {
    // En cas d'échec, retourner un tableau vide
    console.error("Erreur lors du parsing de la note:", error);
    return [];
  }
}
