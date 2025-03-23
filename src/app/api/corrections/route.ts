import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { promises as fs } from "fs";
import { join } from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from "pdfjs-dist";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

      const pdfBuffer = await fs.readFile(absolutePdfPath); // Lecture du fichier PDF
      console.log("PDF téléchargé, taille du fichier:", pdfBuffer.length);

      // Charger le PDF avec pdfjs-dist
      const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer }); // Utilisation directe du Buffer
      const pdf = await loadingTask.promise;
      let pdfText = "";

      // Extraire le texte de chaque page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // @ts-ignore
        pdfText += textContent.items.map((item) => item.str).join(" ");
      }

      console.log("Texte extrait du PDF:", pdfText);

      if (!pdfText || pdfText.trim().length === 0) {
        throw new Error("Le fichier PDF est vide ou l'extraction a échoué.");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Corrige cette copie et attribue une note sur 20 :
      
      ${pdfText}
      
      Format attendu :
      Note: [nombre sur 20]
      Commentaire: [commentaire détaillé]`;

      console.log("Prompt envoyé à Gemini :", prompt);

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      console.log("Réponse brute de Gemini :", responseText);

      if (!responseText) {
        throw new Error("Aucune réponse reçue de Gemini.");
      }

      const noteMatch = responseText.match(/Note:\s*(\d+)/);
      // @ts-ignore
      const commentaireMatch = responseText.match(/Commentaire:\s*(.*)/s);

      console.log("Réponse extraite :");
      console.log("Note extraite :", noteMatch ? noteMatch[1] : "Non trouvée");
      console.log("Commentaire extrait :", commentaireMatch ? commentaireMatch[1].trim() : "Aucun commentaire");

      if (!noteMatch) throw new Error("Impossible d'extraire la note");
      const note = parseFloat(noteMatch[1]);
      const commentaire = commentaireMatch ? commentaireMatch[1].trim() : "";

      const connection = await mysql.createConnection({
        host: "mysql-n0reyni.alwaysdata.net",
        user: "n0reyni_sall",
        password: "passer123",
        database: "n0reyni_bd",
      });

      console.log("Connexion à la base de données établie.");
      await connection.execute(
        `INSERT INTO corrections (id_copie, note, commentaire, correcteur) VALUES (?, ?, ?, 'IA')`,
        [copyId, note, commentaire]
      );

      console.log("Correction sauvegardée dans la base de données.");
      await connection.end();

      return NextResponse.json({ success: true, note, commentaire });
    } catch (error) {
      console.error("Erreur lors de la correction :", error);
      return NextResponse.json({ error: "Erreur lors de la correction" }, { status: 500 });
    }
}