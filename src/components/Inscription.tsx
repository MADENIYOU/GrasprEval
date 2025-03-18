import React from 'react';

const Etudiant: React.FC = () => {
    return (
        <section className="bg-gray-900 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Formulaire dans une card */}
                <div className="bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">BIENVENUE cher Professeur</h2>
                    <p className="mt-2 text-base text-gray-600">Déjà un compte? <a href="/prof1" className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline">Se Connecter</a></p>

                    <form className="mt-8 space-y-5">
                        <div>
                            <label className="text-base font-medium text-gray-900">Prénom et Nom</label>
                            <input type="text" placeholder="Rentrez votre prénom et nom" className="mt-2.5 block w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white" />
                        </div>

                        <div>
                            <label className="text-base font-medium text-gray-900">Adresse email</label>
                            <input type="email" placeholder="Renseignez votre adresse email" className="mt-2.5 block w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white" />
                        </div>

                        <div>
                            <label className="text-base font-medium text-gray-900">Mot de passe</label>
                            <input type="password" placeholder="Renseignez un mot de passe" className="mt-2.5 block w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white" />
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="agree" className="w-5 h-5 text-blue-600 border-gray-200 rounded" />
                            <label htmlFor="agree" className="ml-3 text-sm text-gray-500">J'accepte les <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">Termes de Service</a> et <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">Politiques de Sécurité</a></label>
                        </div>

                        <button type="submit" className="w-full px-4 py-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all">S'inscrire</button>
                    </form>
                </div>

                {/* Image dans une card avec effet hover */}
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:brightness-75">
                    <img className="w-full h-auto object-cover" src="/ins1.png" alt="Inscription étudiant" />
                </div>
            </div>
        </section>
    );
};

export default Etudiant;
