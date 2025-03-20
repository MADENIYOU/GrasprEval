"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function FormulaireInscription() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Récupération du rôle depuis les paramètres d'URL
  const roleFromUrl = searchParams.get("role") ? searchParams.get("role") : "professeur";
  
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setmot_de_passe] = useState("");
  const [role, setRole] = useState(roleFromUrl || "");
  const [accepte, setAccepte] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!roleFromUrl) {
      router.push("/choix");
    } else {
      setRole(roleFromUrl);
    }
  }, [roleFromUrl, router]);
  
  // Animation de texte
  const [text, setText] = useState("");
  const fullText = "Bienvenue à GrasprEval";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!prenom || !nom || !email || !mot_de_passe || !role || !accepte) {
      alert("Tous les champs sont obligatoires et vous devez accepter les termes");
      setIsLoading(false);
      return;
    }

    const data = {
      prenom,
      nom,
      email,
      mot_de_passe,
      role,
    };

    try {
      const response = await fetch("https://gestion-examens.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Vérification que le token existe dans la réponse
        if (result.token) {
          // Stocker le token et l'email dans le localStorage
          localStorage.setItem("userToken", result.token);
          localStorage.setItem("userEmail", email);
          
          // Afficher le token et l'email dans la console pour vérification
          console.log("Inscription réussie - Informations utilisateur:", {
            email: email,
            token: result.token
          });
          
          alert("Inscription réussie. Vérifiez votre email pour confirmer votre compte.");
          
          // Redirection avec les paramètres dans l'URL
          router.push(`/?token=${encodeURIComponent(result.token)}&email=${encodeURIComponent(email)}`);
        } else {
          // Si le token n'est pas dans la réponse, affichez un message d'erreur
          console.error("Le token n'a pas été reçu du serveur");
          alert("Inscription réussie mais problème de connexion. Veuillez vous connecter manuellement.");
        }
      } else {
        alert(result.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      alert("Erreur serveur: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour afficher le libellé du rôle
  const getRoleLibelle = () => {
    switch(role) {
      case "ETUDIANT":
        return "Étudiant";
      case "PROFESSEUR":
        return "Enseignant";
      default:
        return "";
    }
  };

  // Variantes pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Côté gauche avec illustration SVG */}
        <motion.div 
          className="w-full lg:w-1/2 flex flex-col items-center"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {text}
          </motion.h1>
          
          {/* Illustration SVG éducative */}
          <motion.svg 
            width="300" 
            height="300" 
            viewBox="0 0 300 300" 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            {/* Fond */}
            <circle cx="150" cy="150" r="120" fill="#E8F4FF" />
            
            {/* Livre ouvert */}
            <motion.path 
              d="M75,130 Q150,110 225,130 L225,200 Q150,180 75,200 Z" 
              fill="#ffffff"
              stroke="#4285F4"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
            
            {/* Séparation au milieu du livre */}
            <motion.path 
              d="M150,110 L150,190" 
              stroke="#4285F4" 
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
            
            {/* Lignes de texte sur le livre - gauche */}
            <motion.path 
              d="M90,140 L130,135" 
              stroke="#4285F4" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
            <motion.path 
              d="M90,150 L130,145" 
              stroke="#4285F4" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            />
            <motion.path 
              d="M90,160 L130,155" 
              stroke="#4285F4" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            />
            
            {/* Lignes de texte sur le livre - droite */}
            <motion.path 
              d="M170,135 L210,140" 
              stroke="#4285F4" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={ { pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
            <motion.path 
              d="M170,145 L210,150" 
              stroke="#4285F4" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            />
            <motion.path 
              d="M170,155 L210,160" 
              stroke="#4285F4" 
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            />
            
            {/* Crayon */}
            <motion.g
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
            >
              <path d="M220,80 L240,100 L180,160 L160,140 Z" fill="#FFD700" />
              <path d="M160,140 L180,160 L170,170 L150,150 Z" fill="#F4B400" />
              <path d="M150,150 L170,170 L165,175 L145,155 Z" fill="#EA4335" />
            </motion.g>
            
            {/* Graduation hat */}
            <motion.g
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              <path d="M70,90 L150,60 L230,90 L150,120 Z" fill="#4285F4" />
              <path d="M150,120 L150,140 M150,140 L130,170 M150,140 L170,170" stroke="#4285F4" strokeWidth="2" fill="none" />
              <rect x="145" y="45" width="10" height="15" fill="#4285F4" />
            </motion.g>
            
            {/* Ampoule idée */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 2 }}
            >
              <circle cx="80" cy="60" r="15" fill="#FBBC05" />
              <path d="M80,75 L80,85 M75,80 L85,80" stroke="#FBBC05" strokeWidth="2" />
              <path d="M65,45 L70,50 M95,45 L90,50 M60,60 L65,60 M100,60 L95,60 M65,75 L70,70 M95,75 L90,70" stroke="#FBBC05" strokeWidth="2" />
            </motion.g>
          </motion.svg>
          
          <motion.div 
            className="text-center text-blue-800 max-w-sm"
            variants={itemVariants}
          >
            <p className="mb-2 font-medium">Rejoignez notre plateforme éducative innovante et sécurisée.</p>
            
          </motion.div>
        </motion.div>
        
        {/* Côté droit avec formulaire */}
        <motion.div 
          className="w-full lg:w-1/2"
          variants={itemVariants}
        >
          <Card className="border-blue-200 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold">Créer un compte</CardTitle>
              <CardDescription className="text-blue-100">
                Déjà inscrit ? <a href="/connexion" className="font-medium text-white transition-all duration-200 hover:text-blue-200 hover:underline focus:text-blue-200">Se connecter</a>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <Label htmlFor="prenom" className="text-blue-700">Prénom</Label>
                  <Input
                    id="prenom"
                    type="text"
                    placeholder="Votre prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Label htmlFor="nom" className="text-blue-700">Nom</Label>
                  <Input
                    id="nom"
                    type="text"
                    placeholder="Votre nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Label htmlFor="email" className="text-blue-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-black"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Label htmlFor="password" className="text-blue-700">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    value={mot_de_passe}
                    onChange={(e) => setmot_de_passe(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-black"
                  />
                </motion.div>
                
                {/* Champ caché pour le rôle */}
                <input type="hidden" name="role" value={role} />
                
                {/* Badge indiquant le rôle sélectionné */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center"
                >
                  <div className="bg-blue-600 text-white rounded-full p-1 mr-3">
                    {role === "ETUDIANT" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Rôle sélectionné : <span className="text-blue-900">{getRoleLibelle()}</span></p>
                    <p className="text-xs text-blue-600">
                      <a href="/choix" className="hover:underline">Changer de rôle</a>
                    </p>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex items-center space-x-2">
                  <Checkbox
                    id="accepte"
                    checked={accepte}
                    onCheckedChange={() => setAccepte(!accepte)}
                    className="border-blue-400 text-blue-600 data-[state=checked]:bg-blue-600"
                  />
                  <label
                    htmlFor="accepte"
                    className="text-sm font-medium text-blue-700"
                  >
                    J'accepte les <a href="/conditions" className="text-blue-600 hover:underline">conditions d'utilisation</a>
                  </label>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Création en cours...
                      </div>
                    ) : "Créer un compte"}
                  </Button>
                </motion.div>
                
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}