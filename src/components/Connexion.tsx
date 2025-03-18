import React from 'react';

const Connexion: React.FC = () => {
    return (
        <section className="bg-gray-900 py-16">
            <div className=" max-w-6xl mx-auto">
                {/* Formulaire dans une card */}
                <div className="bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">CONNEXION</h2>
                    <p className="mt-2 text-base text-gray-600">Pas encore de compte? <a href="/inscription" className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline">S'inscrire</a></p>

                    <form className="mt-8 space-y-5">
                        <div>
                            <label className="text-base font-medium text-gray-900">Adresse email</label>
                            <input type="email" placeholder="Renseignez votre adresse email" className="mt-2.5 block w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white" />
                        </div>

                        <div>
                            <label className="text-base font-medium text-gray-900">Mot de passe</label>
                            <input type="password" placeholder="Renseignez votre mot de passe" className="mt-2.5 block w-full p-4 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="w-5 h-5 text-blue-600 border-gray-200 rounded" />
                                <label htmlFor="remember" className="ml-3 text-sm text-gray-500">Se souvenir de moi</label>
                            </div>

                            <a href="/mot-de-passe-oublie" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">Mot de passe oublié?</a>
                        </div>

                        <button type="submit" className="w-full px-4 py-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all">Se connecter</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Connexion;