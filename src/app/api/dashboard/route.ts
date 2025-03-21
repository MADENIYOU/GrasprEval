// @ts-nocheck


import { getDashboardData } from "./dashboardService";

export async function GET() {
  try {
    const data = await getDashboardData(); // Récupérer les données du service
    return new Response(data, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur lors de la récupération des données" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
