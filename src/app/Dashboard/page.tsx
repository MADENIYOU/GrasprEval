// @ts-nocheck
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BarChartVertical } from "@/components/BarChartVertical";

export default function DashboardPage() {
  const [classesCount, setClassesCount] = useState<number | null>(null);
  const [examsCount, setExamsCount] = useState<number | null>(null);
  const [studentsCount, setStudentsCount] = useState<number | null>(null);
  const [notesDistributions, setNotesDistributions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((response) => response.json())
      .then((data) => {
        setClassesCount(data.classesCount);
        setExamsCount(data.examsCount);
        setStudentsCount(data.studentsCount);
        setNotesDistributions(data.notesDistributions);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données :", err);
        setError("Erreur lors de la récupération des données");
      });
  }, []);

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
            <li className="text-gray-200">
              <a href="/Dashboard" className="text-blue-700">Dashboard</a>
            </li>
            <li className="text-gray-200">
              <a href="/Correction">Correction</a>
            </li>
            <li className="text-gray-200">
              <a href="/SoumettreExamen">Nouvel Examen</a>
            </li>
          </ul>
        </nav>
      </header>

      <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 bg-gray-900">
        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {classesCount !== null ? classesCount : "Chargement..."}
            </p>
            <p className="text-sm text-muted-foreground">Nombre total de classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Examens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {examsCount !== null ? examsCount : "Chargement..."}
            </p>
            <p className="text-sm text-muted-foreground">Nombre total d'examens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Élèves</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {studentsCount !== null ? studentsCount : "Chargement..."}
            </p>
            <p className="text-sm text-muted-foreground">Nombre total d'élèves</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="col-span-4 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white">Distribution des notes</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <BarChartVertical data={notesDistributions.map((dist) => dist.note)} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-center items-center">
        <Button className="bg-amber-50 text-black">Download Report</Button>
      </div>
    </div>
  );
}
