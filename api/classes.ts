import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Récupérer les classes uniques depuis la table utilisateurs
    const classes = await prisma.$queryRaw`
      SELECT DISTINCT classe
      FROM utilisateurs
      WHERE classe IS NOT NULL
    `;

    // Formater les données
    const uniqueClasses = classes.map((row: { classe: string }) => ({
      id: row.classe, // Utilisez la classe comme ID
      name: row.classe, // Utilisez la classe comme nom
    }));

    res.status(200).json(uniqueClasses);
  } catch (error) {
    console.error("Erreur lors de la récupération des classes :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}