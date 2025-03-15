import Image from "next/image";
import TypingAnimations from "../components/TypingAnimations";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full">
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
              <a href="/Dashboard">Dashbord</a>
            </li>
            <li className="text-gray-200">
              <a href="/Correction">Correction</a>
            </li>
            <li className="text-gray-200">
              <a href="/SoumettreExamen">Nouvel Examen</a>
            </li>
            <li>
              <a
                href="/Connexion"
                className="flex items-center text-gray-200"
              >
                Se connecter
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <section className="mt-24 mx-auto max-w-screen-xl pb-12 px-4 items-center lg:flex md:px-8 flex-1">
        {/* Texte et boutons à gauche */}
        <div className="space-y-4 flex-1 sm:text-center lg:text-left">
          {/* GrasprEval avec animation */}
          <h1 className="text-white font-bold text-4xl xl:text-5xl">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
              Graspr
            </span>
            <span className="text-white font-extrabold">
              Eval
            </span>
          </h1>

          {/* Texte animé */}
          <ol className="list-inside list-decimal text-sm/6 text-left font-[family-name:var(--font-geist-mono)]">
            <div className="mb-2 tracking-[-.01em] text-lg">
              <TypingAnimations text="Une plateforme conviviale de gestion d'examens de vos classes." delay={0.5} />
            </div>
            <div className="tracking-[-.01em] text-lg">
              <TypingAnimations text="Pour une gestion intelligente de vos notes c'est ici !" delay={1} />
            </div>
          </ol>

          {/* Boutons */}
          <div className="pt-10 items-center justify-center space-y-3 sm:space-x-6 sm:space-y-0 sm:flex lg:justify-start">
            <a
              href="/Connexion"
              className="px-7 py-3 w-full bg-white text-gray-800 text-center rounded-md shadow-md block sm:w-auto"
            >
              Se connecter
            </a>
            <a
              href="/Inscription"
              className="px-7 py-3 w-full bg-gray-700 text-gray-200 text-center rounded-md block sm:w-auto"
            >
              S'inscrire
            </a>
          </div>
        </div>

        {/* Image à droite */}
        <div className="flex-1 text-center mt-7 lg:mt-0 lg:ml-3">
          <img
            src="https://i.postimg.cc/HxHyt53c/undraw-heatmap-uyye.png"
            className="w-full mx-auto sm:w-10/12 lg:w-full"
            alt="Illustration"
          />
        </div>
      </section>

      {/* Footer */}
      <Footer backgroundColor="bg-gray-900" />
    </div>
  );
}