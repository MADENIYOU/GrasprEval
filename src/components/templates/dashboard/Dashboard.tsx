// @ts-nocheck


import { DashboardHeader } from "@/components/templates/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/templates/dashboard/DashboardContent";

export const Dashboard = () => {
  return (
    <div className="flex-col md:flex">
      <DashboardHeader />
      <DashboardContent />
    </div>
  );
};