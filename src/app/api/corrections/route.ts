import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { promises as fs } from "fs";
import { join } from "path";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();;


const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

export async function POST(request: Request) {
  try {
    const { copyId, pdfUrl } = await request.json();
    console.log("Copy ID:", copyId);
    console.log("PDF Path:", pdfUrl);

    if (!pdfUrl) {
      throw new Error("Le chemin du PDF (pdfUrl) est manquant dans la requête.");
    }

    const absolutePdfPath = join(process.cwd(), "public", "uploads", pdfUrl);
    console.log("Chemin absolu du fichier PDF:", absolutePdfPath);

    try {
      await fs.access(absolutePdfPath);
    } catch (err) {
      throw new Error(`Fichier PDF introuvable à l'emplacement: ${absolutePdfPath}`);
    }

    const pdfBuffer = await fs.readFile(absolutePdfPath);
    console.log("PDF téléchargé, taille du fichier:", pdfBuffer.length);

    // Extraction du texte depuis le PDF
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
    const pdf = await loadingTask.promise;
    let pdfText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      pdfText += textContent.items.map((item: any) => item.str).join(" ");
    }

    console.log("Texte extrait du PDF:", pdfText);

    if (!pdfText.trim()) {
      throw new Error("Le fichier PDF est vide ou l'extraction a échoué.");
    }

    // Construction du prompt pour Gemini
    const prompt = `
Tu es un enseignant expérimenté spécialisé dans la correction de copies d'examen. Voici une copie soumise par un élève :

--- Début de la copie ---
${pdfText}
--- Fin de la copie ---

Corrige cette copie et attribue une note sur 20.

Format attendu :
Note: [nombre sur 20]
Commentaire: [commentaire détaillé]
`;

    console.log("Envoi de la requête à Gemini");

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }
    );

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Réponse brute de Gemini:", responseText);

    if (!responseText) {
      throw new Error("Aucune réponse reçue de Gemini.");
    }

    // Extraction de la note et du commentaire
    const noteMatch = responseText.match(/Note:\s*(\d+)/);
    // @ts-ignore
    const commentaireMatch = responseText.match(/Commentaire:\s*(.*)/s);
    

    if (!noteMatch) throw new Error("Impossible d'extraire la note");
    const note = parseFloat(noteMatch[1]);
    const commentaire = commentaireMatch ? commentaireMatch[1].trim() : "";

    // Sauvegarde en base de données
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    console.log("Connexion à la base de données établie.");
    await connection.execute(
      `INSERT INTO corrections (id_copie, note, commentaire, correcteur) VALUES (?, ?, ?, 'IA')`,
      [copyId, note, commentaire]
    );

    console.log("Correction sauvegardée dans la base de données.");
    await connection.end();

    return NextResponse.json({ success: true, note, commentaire });
  } catch (error: any) {
    console.error("Erreur lors de la correction :", error.message);
    return NextResponse.json({ error: "Erreur lors de la correction", details: error.message }, { status: 500 });
  }
}
