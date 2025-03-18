import Footer from '@/components/Footer';
import Link from 'next/link';
import React from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div>
      <header className='bg-gray-900'>
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
              <Link href="/Dashboard">Dashboard</Link>
            </li>
            <li className="text-gray-200">
              <Link href="/Correction">Correction</Link>
            </li>
            <li className="text-gray-200">
              <Link href="/SoumettreExamen" className="text-blue-700">Nouvel Examen</Link>
            </li>
          </ul>
        </nav>
      </header>
        {/* Contenu principal */}
        <main>
          {children}
        </main>

        {/* Footer (optionnel) */}
        <footer className="bg-gray-900 text-white text-center">
          <Footer backgroundColor='bg-gray-900'/>
        </footer>
    </div>
  );
};

export default RootLayout;