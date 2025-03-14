import React from "react";
import SoumettreExamen from "../../components/SoumettreExamen";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* Barre de navigation ou autres éléments communs */}
      <nav className="bg-gray-800 p-4">
        <Link href="/SoumettreExamen" className="text-white mr-4">
          Soumettre un Examen
        </Link>
      </nav>

      {/* Contenu principal */}
      <main>
        {children}
        {/* <SoumettreExamen /> */}
      </main>
    </div>
  );
};

export default Layout;