import mysql from 'mysql2/promise';
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { examId: string, copyId: string } }) {
    const { examId, copyId } = params; // Extraire les paramètres
    console.log("Exam id : ", examId);
    console.log("Copy id : ", copyId);
  
    try {
      // Lire la demande JSON pour récupérer la nouvelle note
      const { newNote } = await request.json();
  
      // Validation de la note
      if (newNote == null || isNaN(newNote)) {
        return NextResponse.json(
          { error: "La note doit être un nombre valide" },
          { status: 400 } // Code HTTP 400 pour une mauvaise demande
        );
      }
  
      // Connexion à la base de données
      const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      });
  
      // Commencer une transaction pour assurer l'intégrité des données
      await connection.beginTransaction();
  
      // Mise à jour de la note dans la table corrections
      const [correctionResult] = await connection.execute(
        `UPDATE corrections
         SET note = ?, correcteur = 'enseignant'
         WHERE id_copie = ?`,
        [newNote, copyId] // On met à jour la note de la copie existante
      );

      // correctionResult est de type ResultSetHeader
      if ((correctionResult as mysql.ResultSetHeader).affectedRows === 0) {
        // Annuler la transaction si la copie n'existe pas dans corrections
        await connection.rollback();
        return NextResponse.json(
          { error: "Aucune correction trouvée pour cette copie" },
          { status: 404 }
        );
      }
  
      // Mise à jour du statut de la copie dans la table copies
      const [copyResult] = await connection.execute(
        `UPDATE copies
         SET statut_correction = 'corrige'
         WHERE id = ? AND id_examen = ?`,
        [copyId, examId]
      );

      // copyResult est de type ResultSetHeader
      if ((copyResult as mysql.ResultSetHeader).affectedRows === 0) {
        console.error(`Aucune copie trouvée pour copyId: ${copyId} et examId: ${examId}`);
        await connection.rollback();
        return NextResponse.json(
          { error: "Aucune copie trouvée avec cet ID pour cet examen" },
          { status: 404 }
        );
      }
  
      // Valider la transaction
      await connection.commit();
  
      // Fermer la connexion
      await connection.end();
  
      // Retourner une réponse de succès
      return NextResponse.json(
        { message: "La note a été mise à jour avec succès et la copie est marquée comme corrigée." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la note :", error);
  
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour de la note" },
        { status: 500 } // Code HTTP 500 pour erreur interne
      );
    }
}
