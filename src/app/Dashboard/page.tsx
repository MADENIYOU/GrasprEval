//@ts-nocheck

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { BarChartVertical } from "@/components/BarChartVertical";
import { Chart } from "@/components/Chart";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [classesCount, setClassesCount] = useState<number | null>(null);
  const [examsCount, setExamsCount] = useState<number | null>(null);
  const [studentsCount, setStudentsCount] = useState<number | null>(null);
  const [notesDistributions, setNotesDistributions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const enseignantId = session.user.id;

      setLoading(true);

      fetch("/api/dashboard")
        .then((response) => response.json())
        .then((data) => {
          setClassesCount(data.classesCount);
          setExamsCount(data.examsCount);
          setStudentsCount(data.studentsCount);
        })
        .catch((err) => {
          console.error("Erreur dashboard : ", err);
          setError("Erreur lors de la récupération des données");
        });

      fetch(`/api/examens/${enseignantId}`)
        .then((response) => response.json())
        .then((data) => {
          setExams(data);
          if (data.length > 0) {
            setSelectedExamId(data[0].id);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur examens : ", err);
          setError("Erreur lors de la récupération des examens");
          setLoading(false);
        });
    }
  }, [status, session?.user?.id]);

  useEffect(() => {
    if (selectedExamId && exams.length > 0) {
      const selectedExam = exams.find((exam) => String(exam.id) === String(selectedExamId));
      if (!selectedExam || !selectedExam.titre) {
        console.warn("Examen introuvable ou sans titre, requêtes annulées.");
        return;
      }

      const titre = encodeURIComponent(selectedExam.titre);

      setLoading(true);
      Promise.all([
        fetch(`/api/statistiques/${selectedExamId}`).then((res) => res.json()),
        fetch(`/api/notes-distribution/${titre}`).then((res) => res.json())
      ])
        .then(([stats, distribution]) => {
          setStatistics(stats);

          // Vérification que "distribution" est un tableau et parsing des notes
          if (Array.isArray(distribution?.distribution)) {
            const parsedDistribution = distribution.distribution.map((entry: any) => ({
              ...entry,
              note: JSON.parse(entry.note) // On parse ici si note est une chaîne JSON
            }));
            setNotesDistributions(parsedDistribution);
          } else {
            console.warn("La distribution des notes n'est pas un tableau.", distribution);
            setError("Les données de distribution sont incorrectes");
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur de chargement : ", err);
          setError("Erreur lors de la récupération des données pour l'examen sélectionné");
          setLoading(false);
        });
    }
  }, [selectedExamId, exams]);

  return (
    <div className="container">
      <header className="w-full bg-gray-900">
        <nav className="items-center pt-5 px-4 mx-auto max-w-screen-xl sm:px-8 sm:flex sm:space-x-6">
          <h1 className="text-white font-bold text-4xl xl:text-5xl">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
              Graspr
            </span>
            <span className="text-white font-extrabold">Eval</span>
          </h1>
          <ul className="py-4 flex-1 items-center flex space-x-3 sm:space-x-6 sm:justify-end">
            <li className="text-gray-200"><a href="/Dashboard" className="text-blue-700">Dashboard</a></li>
            <li className="text-gray-200"><a href="/Correction">Correction</a></li>
            <li className="text-gray-200"><a href="/SoumettreExamen">Nouvel Examen</a></li>
          </ul>
        </nav>
      </header>

      <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 bg-gray-900">
        <Card className="bg-gray-900">
          <CardHeader><CardTitle className="text-white">Classes</CardTitle></CardHeader>
          <CardContent>
            {classesCount !== null ? (
              <>
                <p className="text-2xl font-bold text-white">{classesCount}</p>
                <p className="text-sm text-white">Nombre total de classes</p>
              </>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-6 w-16 bg-gray-700" />
                <Skeleton className="h-4 w-32 bg-gray-700" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900">
          <CardHeader><CardTitle className="text-white">Examens</CardTitle></CardHeader>
          <CardContent>
            {examsCount !== null ? (
              <>
                <p className="text-2xl font-bold text-white">{examsCount}</p>
                <p className="text-sm text-white">Nombre total d'examens</p>
              </>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-6 w-16 bg-gray-700" />
                <Skeleton className="h-4 w-32 bg-gray-700" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900">
          <CardHeader><CardTitle className="text-white">Élèves</CardTitle></CardHeader>
          <CardContent>
            {studentsCount !== null ? (
              <>
                <p className="text-2xl font-bold text-white">{studentsCount}</p>
                <p className="text-sm text-white">Nombre total d'élèves</p>
              </>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-6 w-16 bg-gray-700" />
                <Skeleton className="h-4 w-32 bg-gray-700" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {exams.length > 0 && (
        <div className="mt-6">
          <label className="text-white font-semibold mr-4">Choisissez un examen :</label>
          <select
            className="p-2 rounded bg-gray-800 text-white"
            value={selectedExamId ?? ""}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.titre || "Examen sans titre"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-6">
        <Card className="col-span-4 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white">
              Distribution des notes – {exams.find((exam) => exam.id === selectedExamId)?.titre}
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 text-white">
            {notesDistributions.length > 0 ? (
              <BarChartVertical data={notesDistributions} />
            ) : (
              <Skeleton className="h-6 w-32 bg-gray-700" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white">
              Taux de réussite – {exams.find((exam) => exam.id === selectedExamId)?.titre}
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 text-white">
            {statistics.length > 0 ? (
              <Chart currentExam={exams.find((exam) => exam.id === selectedExamId)} statistics={statistics} />
            ) : (
              <p className="text-white">Aucune statistique disponible</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-center items-center">
        <Button className="bg-amber-50 text-black">Download Report</Button>
      </div>
    </div>
  );
}
