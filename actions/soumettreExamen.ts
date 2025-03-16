// actions/soumettreExamen.ts
"use server";

import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';

export async function soumettreExamen(formData: FormData) {
  const nomExamen = formData.get('nomExamen') as string;
  const description = formData.get('description') as string;
  const typeExamen = formData.get('typeExamen') as string;
  const dateLimite = formData.get('dateLimite') as string;
  const classes = formData.get('classes') as string;
  const fichier = formData.get('fichier') as File;

  try {
    // Connexion à la base de données
    const db = await mysql.createConnection({
      host: 'mysql-n0reyni.alwaysdata.net',
      user: 'n0reyni_sall',
      password: 'passer123',
      database: 'n0reyni_bd',
    });

    const classesArray = JSON.parse(classes);

    // Gérer l'upload du fichier
    let fichierPath = null;
    if (fichier) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const fileName = `${Date.now()}-${fichier.name}`; // Nom unique pour éviter les conflits
      fichierPath = path.join('/uploads', fileName); // Chemin relatif pour la base de données

      // Écrire le fichier dans le dossier `public/uploads`
      const fileBuffer = await fichier.arrayBuffer();
      await fs.writeFile(path.join(uploadsDir, fileName), Buffer.from(fileBuffer));
    }

    // Insérer les données dans la base de données
    for (const classe of classesArray) {
      await db.execute(
        `INSERT INTO examens (titre, description, type_examen, date_limite, classe, fichier_pdf) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nomExamen, description, typeExamen, dateLimite, classe, fichierPath]
      );
    }

    await db.end();
    return { message: 'Examen soumis avec succès !' };
  } catch (error) {
    console.error('Erreur lors de la soumission de l\'examen :', error);
    throw new Error('Erreur lors de la soumission de l\'examen');
  }
}