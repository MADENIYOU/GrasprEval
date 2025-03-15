"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Overview } from "@/components/templates/dashboard/Overview";

export default function DashboardPage() {
  return (
    <div className="container">
        <header className="w-full bg-gray-900">
        <nav className="items-center pt-5 px-4 mx-auto max-w-screen-xl sm:px-8 sm:flex sm:space-x-6">
        <h1 className="text-white font-bold text-4xl xl:text-5xl">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
              Graspr
            </span>
            <span className="text-white font-extrabold">
              Eval
            </span>
          </h1>
          <ul className="py-4 flex-1 items-center flex space-x-3 sm:space-x-6 sm:justify-end">
            <li className="text-gray-200">
              <a href="/Dashboard" className="text-blue-700">Dashbord</a>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Carte 1 */}
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$45,231.89</p>
            <p className="text-sm text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Carte 2 */}
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+2350</p>
            <p className="text-sm text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Carte 3 */}
        <Card>
          <CardHeader>
            <CardTitle>Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+12,234</p>
            <p className="text-sm text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique */}
      <div className="mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
      </div>

      {/* Bouton d'action */}
      <div className="mt-6 flex justify-center items-center">
        <Button className="bg-amber-50 text-black">Download Report</Button>
      </div>
    </div>
  );
}