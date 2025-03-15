import React from "react";
import Footer from "../../components/Footer";
import Link from "next/link";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* En-tête personnalisé */}
      <header className="w-full">
        <nav className="items-center pt-5 px-4 mx-auto max-w-screen-xl sm:px-8 sm:flex sm:space-x-6">
          {/* Logo ou titre */}
          <h1 className="text-white font-bold text-4xl xl:text-5xl">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
              Graspr
            </span>
            <span className="text-white font-extrabold">
              Eval
            </span>
          </h1>

          {/* Liens de navigation */}
          <ul className="py-4 flex-1 items-center flex space-x-3 sm:space-x-6 sm:justify-end">
            <li className="text-gray-200">
              <Link href="/Dashboard">Dashboard</Link>
            </li>
            <li className="text-gray-200">
              <Link href="/Correction">Correction</Link>
            </li>
            <li className="text-gray-200">
              <Link href="/SoumettreExamen">Nouvel Examen</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Contenu principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer backgroundColor="bg-gray-900" />
    </div>
  );
};

export default Layout;