// @ts-nocheck


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  
  export function TeamSwitcher() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Team A</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Team A</DropdownMenuItem>
          <DropdownMenuItem>Team B</DropdownMenuItem>
          <DropdownMenuItem>Team C</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }