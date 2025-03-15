import { TeamSwitcher } from "@/components/templates/dashboard/TeamSwitcher";
import { MainNav } from "@/components/templates/dashboard/MainNav";
import { Search } from "@/components/templates/dashboard/Search";
import { UserNav } from "@/components/templates/dashboard/DashboardUserNav";

export const DashboardHeader = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <TeamSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <UserNav />
        </div>
      </div>
    </div>
  );
};