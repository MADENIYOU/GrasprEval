// app/exams/[classId]/page.tsx
"use client"; // Indique que ce composant est un Client Component

import React from "react";
import { useParams } from "next/navigation";

interface Exam {
  id: string;
  titre: string;
  description: string | null;
  fichier_pdf: string | null;
  date_creation: string;
  date_limite: string | null;
  type_examen: string | null;
  classe: string | null;
  matiere: string | null;
}

const ExamsPage: React.FC = () => {
  const params = useParams();
  const classId = params.classId as string;

  const [exams, setExams] = React.useState<Exam[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (classId) {
      // Appeler l'API pour récupérer les examens
      fetch(`/api/exams?classId=${encodeURIComponent(classId)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des examens");
          }
          return response.json();
        })
        .then((data) => {
          setExams(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des examens :", error);
          setError("Erreur lors de la récupération des examens");
          setLoading(false);
        });
    }
  }, [classId]);

  // Si classId est undefined (chargement initial)
  if (!classId) {
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

  // Si aucun examen n'est trouvé
  if (!loading && exams.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Examens de la classe {classId}</h1>
        <p className="text-gray-600">Aucun examen trouvé pour cette classe.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Examens de la classe {classId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl p-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              {/* Titre de l'examen */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {exam.titre}
              </h2>

              {/* Description de l'examen */}
              {exam.description && (
                <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
              )}

              {/* Informations supplémentaires */}
              <div className="space-y-2 text-gray-500 text-xs">
                <p>
                  <span className="font-medium">Date de création :</span>{" "}
                  {exam.date_creation}
                </p>
                {exam.date_limite && (
                  <p>
                    <span className="font-medium">Date limite :</span>{" "}
                    {exam.date_limite}
                  </p>
                )}
                {exam.type_examen && (
                  <p>
                    <span className="font-medium">Type :</span> {exam.type_examen}
                  </p>
                )}
                {exam.matiere && (
                  <p>
                    <span className="font-medium">Matière :</span> {exam.matiere}
                  </p>
                )}
              </div>

              {/* Lien pour télécharger le PDF */}
              {exam.fichier_pdf && (
                <a
                  href={exam.fichier_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-blue-500 text-sm hover:underline"
                >
                  Télécharger le PDF
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsPage;