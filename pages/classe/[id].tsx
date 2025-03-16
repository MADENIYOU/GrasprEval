import { useRouter } from "next/router";
import React from "react";

const ClassPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Récupère l'ID de la classe depuis l'URL

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Classe {id}</h1>
        <p className="text-slate-500">
          Vous êtes sur la page de la classe {id}. Ici, vous pouvez afficher des
          détails spécifiques à cette classe.
        </p>
      </div>
    </div>
  );
};

export default ClassPage;