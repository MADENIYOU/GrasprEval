"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Professeur() {
    const [email, setEmail] = useState('');
    const [mot_de_passe, setMotDePasse] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('https://gestion-examens.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    mot_de_passe: mot_de_passe,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                    
                    //je stocke l'email de l'utilisateur
                    localStorage.setItem('email', email);

                    sessionStorage.setItem('access_token', data.access_token);
                    sessionStorage.setItem('email', email)
                }
                
                setMessage(data.message || 'Connexion réussie !');
                
                // on redirige après un court délai pour que l'utilisateur puisse voir le message de succès
                setTimeout(() => {
                    router.push('/Dashboard');
                }, 1000);
            } else {
                setMessage(data.message || 'Erreur de connexion');
            }
        } catch (error) {
            setMessage('Erreur de connexion, veuillez réessayer plus tard');
            console.error('Erreur de connexion:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Animation pour les nuages
    const [clouds, setClouds] = useState([]);
    
    useEffect(() => {
        // Créer des nuages aléatoires
        const newClouds = Array.from({ length: 6 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 30,
            speed: 0.5 + Math.random() * 1,
            size: 50 + Math.random() * 100,
            delay: Math.random() * 10
        }));
        
        setClouds(newClouds);
    }, []);

    return (
        <section className="min-h-screen py-16 relative overflow-hidden" style={{ backgroundColor: '#87CEEB' }}>
            {/* Nuages animés */}
            {clouds.map((cloud) => (
                <motion.div
                    key={cloud.id}
                    className="absolute opacity-75"
                    style={{
                        left: `${cloud.left}%`,
                        top: `${cloud.top}%`,
                    }}
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                        duration: cloud.speed * 60,
                        repeat: Infinity,
                        delay: cloud.delay,
                        ease: "linear"
                    }}
                >
                    <svg width={cloud.size} height={cloud.size * 0.6} viewBox="0 0 100 60" fill="white">
                        <path d="M95,27.5c0-7-5.7-12.7-12.7-12.7c-1.6,0-3.2,0.3-4.6,0.9C75.1,6.9,66.8,0,56.7,0c-10.8,0-19.7,8-21.2,18.5 c-1-0.3-2.1-0.5-3.2-0.5c-5.5,0-10,4.5-10,10c0,0.7,0.1,1.3,0.2,1.9C9.8,31.3,0,41.8,0,54.5C0,57.5,2.5,60,5.5,60h77 c9.7,0,17.5-7.8,17.5-17.5C100,35.7,98.1,30.9,95,27.5z"/>
                    </svg>
                </motion.div>
            ))}
            
            {/* Soleil animé */}
            <motion.div 
                className="absolute right-8 top-8"
                animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1]
                }}
                transition={{ 
                    rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                <svg width="120" height="120" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="25" fill="#FFD700" />
                    {Array.from({ length: 12 }).map((_, i) => {
                        // Calculer avec une précision fixe
                        const angle = Math.PI * 2 * i / 12;
                        const x2 = parseFloat((50 + 40 * Math.cos(angle)).toFixed(6));
                        const y2 = parseFloat((50 + 40 * Math.sin(angle)).toFixed(6));
                        
                        return (
                            <line 
                                key={i}
                                x1="50"
                                y1="50"
                                x2={x2}
                                y2={y2}
                                stroke="#FFD700"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        );
                    })}
                </svg>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white shadow-lg rounded-2xl p-8 backdrop-blur-sm bg-opacity-90"
                >
                    <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
                        <span className="text-blue-600">B</span>ienvenue, 
                        <span className="block">Cher Utilisateur ! </span>
                    </h2>
                    <p className="mt-4 text-base text-gray-600">
                        Pas encore de compte ? 
                        <motion.a 
                            href="/Inscription" 
                            className="ml-1 font-medium text-blue-600 hover:text-blue-700 hover:underline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            S'inscrire maintenant
                        </motion.a>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="text-base font-medium text-gray-900">Adresse email</label>
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Votre adresse email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 block w-full p-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="text-base font-medium text-gray-900">Mot de passe</label>
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Votre mot de passe"
                                    value={mot_de_passe}
                                    onChange={(e) => setMotDePasse(e.target.value)}
                                    className="pl-10 block w-full p-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            className="w-full px-6 py-4 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg"
                            disabled={isLoading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion en cours...
                                </div>
                            ) : 'Se Connecter'}
                        </motion.button>
                    </form>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-4 p-3 rounded-lg text-center ${message.includes('réussie') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                            {message}
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white shadow-xl rounded-2xl overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-800/50 to-transparent z-10"></div>
                    <img 
                        className="w-full h-full object-cover" 
                        src="/fing.png" 
                        alt="Inscription professeur" 
                    />
                    
                    {/* Petite illustration d'un professeur */}
                    <motion.div
                        className="absolute bottom-6 right-6 z-20"
                        animate={{
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* SVG simplifié d'un professeur */}
                            <circle cx="50" cy="30" r="20" fill="#FFDBAC" />
                            <path d="M30 80C30 69 40 60 50 60C60 60 70 69 70 80" fill="#3B82F6" />
                            <rect x="45" y="50" width="10" height="20" fill="#FFDBAC" />
                            <path d="M35 30C35 30 40 35 50 35C60 35 65 30 65 30" stroke="black" strokeWidth="2" />
                            <circle cx="40" cy="25" r="3" fill="black" />
                            <circle cx="60" cy="25" r="3" fill="black" />
                            <path d="M30 25L40 20" stroke="black" strokeWidth="2" />
                            <path d="M70 25L60 20" stroke="black" strokeWidth="2" />
                            <path d="M45 40C45 40 50 43 55 40" stroke="black" strokeWidth="2" />
                        </svg>
                    </motion.div>
                </motion.div>
            </div>
            
            {/* Éléments décoratifs du bas */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220">
                    <path fill="#ffffff" fillOpacity="0.2" d="M0,160L48,138.7C96,117,192,75,288,69.3C384,64,480,96,576,122.7C672,149,768,171,864,165.3C960,160,1056,128,1152,106.7C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
        </section>
    );
}