"use client";
import React, { useState } from "react"; // Importez l'action côté serveur
import { toast } from "react-toastify";

const SoumettreExamen = () => {
  const [nomExamen, setNomExamen] = useState("");
  const [description, setDescription] = useState("");
  const [typeExamen, setTypeExamen] = useState("");
  const [dateLimite, setDateLimite] = useState("");
  const [classes, setClasses] = useState<string[]>(["DUT1", "DST1", "DUT2", "DIC1", "DIC2", "DIC3"]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [nouvelleClasse, setNouvelleClasse] = useState("");
  const [fichier, setFichier] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("nomExamen", nomExamen);
  formData.append("description", description);
  formData.append("typeExamen", typeExamen);
  formData.append("dateLimite", dateLimite);
  formData.append("classes", JSON.stringify(selectedClasses));
  if (fichier) {
    formData.append("fichier", fichier);
  }

  try {
    const response = await fetch("/api/soumettreExamen", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la soumission");
    }

    const result = await response.json();
    toast.success(result.message);
    toast.success("Emails envoyés aux étudiants concernés");
  } catch (error) {
    console.error("Erreur :", error);
    toast.error("Erreur lors de la soumission de l'examen");
  }
};


  const ajouterClasse = () => {
    if (nouvelleClasse.trim() !== "" && !classes.includes(nouvelleClasse)) {
      setClasses([...classes, nouvelleClasse]);
      setNouvelleClasse("");
    }
  };

  const handleClassSelection = (classe: string) => {
    if (selectedClasses.includes(classe)) {
      setSelectedClasses(selectedClasses.filter((c) => c !== classe));
    } else {
      setSelectedClasses([...selectedClasses, classe]);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Section du formulaire avec dégradé */}
      <div className="bg-gray-900">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center pt-10 sm:pt-16 lg:pt-24">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Soumettre un Examen
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-white">
              Remplissez le formulaire ci-dessous pour soumettre un nouvel examen.
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal avec fond noir */}
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-6xl mx-auto mt-12 overflow-hidden bg-white rounded-md shadow-md lg:mt-20">
          <div className="grid items-stretch grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="p-6 sm:p-10">
                <h3 className="text-2xl font-semibold text-black">Formulaire de Soumission</h3>

                <form onSubmit={handleSubmit} className="mt-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                    {/* Champ pour le nom de l'examen */}
                    <div>
                      <label htmlFor="nomExamen" className="text-base font-medium text-gray-900">
                        Nom de l'examen
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          type="text"
                          id="nomExamen"
                          value={nomExamen}
                          onChange={(e) => setNomExamen(e.target.value)}
                          placeholder="Entrez le nom de l'examen"
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                          required
                        />
                      </div>
                    </div>

                    {/* Champ pour la description */}
                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="text-base font-medium text-gray-900">
                        Description
                      </label>
                      <div className="mt-2.5 relative">
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Entrez la description de l'examen"
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md resize-y bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                          required
                        />
                      </div>
                    </div>

                    {/* Champ pour le type d'examen */}
                    <div>
                      <label htmlFor="typeExamen" className="text-base font-medium text-gray-900">
                        Type d'examen
                      </label>
                      <div className="mt-2.5 relative">
                        <select
                          id="typeExamen"
                          value={typeExamen}
                          onChange={(e) => setTypeExamen(e.target.value)}
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                          required
                        >
                          <option value="" disabled>
                            Sélectionnez un type
                          </option>
                          <option value="TP">Travail Pratique</option>
                          <option value="TD">Travail Dirigé</option>
                          <option value="CC">Contrôle Continu</option>
                          <option value="DS">Devoir Surveillé</option>
                        </select>
                      </div>
                    </div>

                    {/* Champ pour la date limite */}
                    <div>
                      <label htmlFor="dateLimite" className="text-base font-medium text-gray-900">
                        Date limite
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          type="date"
                          id="dateLimite"
                          value={dateLimite}
                          onChange={(e) => setDateLimite(e.target.value)}
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                          required
                        />
                      </div>
                    </div>

                    {/* Nouveau champ : Sélection des classes avec des cases à cocher */}
                    <div className="sm:col-span-2">
                      <label className="text-base font-medium text-gray-900">
                        Classes concernées
                      </label>
                      <div className="mt-2.5 relative grid grid-cols-2 gap-2">
                        {classes.map((classe) => (
                          <div key={classe} className="flex items-center">
                            <input
                              type="checkbox"
                              id={classe}
                              checked={selectedClasses.includes(classe)}
                              onChange={() => handleClassSelection(classe)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={classe} className="ml-2 text-sm text-gray-900">
                              {classe}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Champ pour ajouter une nouvelle classe */}
                    <div className="sm:col-span-2">
                      <label htmlFor="nouvelleClasse" className="text-base font-medium text-gray-900">
                        Ajouter une nouvelle classe (si non présente)
                      </label>
                      <div className="mt-2.5 relative flex gap-2">
                        <input
                          type="text"
                          id="nouvelleClasse"
                          value={nouvelleClasse}
                          onChange={(e) => setNouvelleClasse(e.target.value)}
                          placeholder="Entrez le nom de la nouvelle classe"
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                        />
                        <button
                          type="button"
                          onClick={ajouterClasse}
                          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>

                    {/* Champ pour uploader le fichier */}
                    <div className="sm:col-span-2">
                      <label htmlFor="fichier" className="text-base font-medium text-gray-900">
                        Fichier de l'examen
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          type="file"
                          id="fichier"
                          onChange={(e) => setFichier(e.target.files?.[0] || null)}
                          className="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                          required
                        />
                      </div>
                    </div>

                    {/* Bouton de soumission */}
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center w-full px-4 py-4 mt-2 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
                      >
                        Soumettre
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Section d'informations supplémentaires */}
            <div className="bg-gray-100 lg:col-span-2">
              <div className="h-full p-6 sm:p-10">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h4 className="text-2xl font-semibold text-black">Informations supplémentaires</h4>
                    <div className="mt-8 space-y-7">
                      <div className="flex items-start">
                        <svg
                          className="flex-shrink-0 text-blue-600 w-7 h-7"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="block ml-3 text-base text-gray-900">
                          GrasprEval <br></br>
                          Sénégal <br></br>
                          Dakar <br></br>
                          Université Cheikh Anta Diop <br></br>
                          Ecole Supérieure Polytechnique BP 21000, Dakar<br></br>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoumettreExamen;