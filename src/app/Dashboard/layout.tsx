// @ts-nocheck


"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <div className="flex min-h-screen flex-col bg-gray-900">
        
        <main className="flex-1 p-4">{children}</main>

        
        <footer className="border-t">
            <Footer backgroundColor="bg-gray-900" />
        </footer>
      </div>
    </div>
  );
}
