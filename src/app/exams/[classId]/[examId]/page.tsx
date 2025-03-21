"use client"; // Indique que ce composant est un Client Component

import React from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaDownload, FaEdit, FaCheckCircle } from "react-icons/fa"; // Importation des icônes

interface Copy {
  id: string;
  id_etudiant: number;
  id_examen: number;
  fichier_pdf: string;
  date_soumission: string;
  statut_correction: "en attente" | "corrige";
  etudiant: {
    nom: string;
    prenom: string;
    email: string;
  };
}

const ExamCopiesPage: React.FC = () => {
  const params = useParams();
  //@ts-ignore
  const examId = params.examId as string;

  const [copies, setCopies] = React.useState<Copy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (examId) {
      setLoading(true);
      // Appeler l'API pour récupérer les copies de l'examen
      fetch(`/api/exams/${examId}/copies`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des copies");
          }
          return response.json();
        })
        .then((data) => {
          setCopies(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des copies :", error);
          setError("Erreur lors de la récupération des copies");
          setLoading(false);
        });
    }
  }, [examId]);

  // Si examId est undefined (chargement initial)
  if (!examId) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Chargement en cours...</h1>
      </div>
    );
  }

  // Si une erreur est survenue
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Erreur</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Si aucune copie n'est trouvée
  if (!loading && copies.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Copies de l'examen {examId}</h1>
        <p className="text-gray-600">Aucune copie trouvée pour cet examen.</p>
      </div>
    );
  }

  return (
    <div className="bg-sky-950 h-full w-full p-7 flex flex-col">
      <div className="flex md:items-center flex-col md:flex-row gap-5 md:gap-2 justify-between">
        <div className="flex flex-col gap-2 items-start text-white">
          <h3 className="text-lg font-semibold">Copies soumises</h3>
        </div>
      </div>

      <div className="mt-5 overflow-y-auto flex-1"> {/* Flexbox pour que ce conteneur prenne toute la hauteur restante */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-5 text-white">Étudiant</TableHead>
              <TableHead className="py-5 text-white">Email</TableHead>
              <TableHead className="py-5 text-white">Statut</TableHead>
              <TableHead className="py-5 text-white">Fichier PDF</TableHead>
              <TableHead className="py-5 text-white">Corriger</TableHead>
              <TableHead className="py-5 text-white">Modifier la note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {copies.map((copy) => {
                return (
                  <TableRow key={copy.id} className="text-white font-medium">
                    <TableCell className="py-5 flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {copy.nom?.charAt(0) || "?"}
                          {copy.prenom?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium">
                        {copy.nom || "Nom inconnu"} {copy.prenom || "Prénom inconnu"}
                      </p>
                    </TableCell>

                    <TableCell className="py-5">
                      <p>{copy.email || "Email inconnu"}</p>
                    </TableCell>

                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="relative inline-flex">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              copy.statut_correction === "corrige" ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <div
                            className={`w-3 h-3 rounded-full absolute top-0 left-0 animate-ping ${
                              copy.statut_correction === "corrige" ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                        </div>
                        <p>{copy.statut_correction}</p>
                      </div>
                    </TableCell>

                    <TableCell className="py-5">
                      <a
                        href={copy.fichier_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline flex items-center gap-2"
                      >
                        <FaDownload /> Télécharger
                      </a>
                    </TableCell>

                    <TableCell className="py-5">
                      <Button
                        variant="outline"
                        className="bg-transparent bg-green-500 flex items-center gap-2"
                        onClick={() => {
                          console.log("Corriger la copie", copy.id);
                        }}
                      >
                        <FaCheckCircle /> Corriger
                      </Button>
                    </TableCell>

                    <TableCell className="py-5">
                      <Button
                        variant="outline"
                        className="bg-transparent bg-yellow-500 flex items-center gap-2"
                        onClick={() => {
                          console.log("Modifier la note de la copie", copy.id);
                        }}
                      >
                        <FaEdit /> Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExamCopiesPage;
