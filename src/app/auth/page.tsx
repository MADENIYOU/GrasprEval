'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', mot_de_passe: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Nouvel état de chargement
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Active le chargement

    if (isLogin) {
      const res = await signIn("credentials", {
        email: form.email,
        mot_de_passe: form.mot_de_passe,
        redirect: false,
      });

      if (res?.ok) router.push("/Dashboard");
      else setError("Identifiants incorrects");

    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsLogin(true);
      } else {
        const data = await res.json();
        setError(data.error || "Erreur");
      }
    }

    setIsLoading(false); // Désactive le chargement une fois la requête terminée
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-lg rounded-lg flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-6">
          {isLogin ? "Connexion" : "Inscription"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {!isLogin && (
            <>
              <Input
                name="nom"
                placeholder="Nom"
                value={form.nom}
                onChange={handleChange}
                required
                className="bg-gray-700 text-white placeholder-gray-400"
              />
              <Input
                name="prenom"
                placeholder="Prénom"
                value={form.prenom}
                onChange={handleChange}
                required
                className="bg-gray-700 text-white placeholder-gray-400"
              />
            </>
          )}

          <Input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-gray-700 text-white placeholder-gray-400"
          />

          <div className="relative">
            <Input
              name="mot_de_passe"
              placeholder="Mot de passe"
              type={showPassword ? "text" : "password"}
              value={form.mot_de_passe}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-2 text-sm text-gray-400"
            >
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white" disabled={isLoading}>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin h-5 w-5 border-4 border-t-4 border-white rounded-full"></div>
              </div>
            ) : (
              isLogin ? "Se connecter" : "Créer un compte"
            )}
          </Button>

          <div className="text-center text-sm text-gray-400">
            {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:underline"
            >
              {isLogin ? "Créer un compte" : "Connexion"}
            </button>
          </div>
          {isLogin && (
            <div className="mt-4">
                <button
                type="button"
                onClick={() => router.push("/auth/forgot-password")}
                className="text-blue-400 hover:underline"
                >
                Mot de passe oublié ?
                </button>
            </div>
            )}

        </form>

        {error && (
          <div className="mt-4">
            <Alert variant="destructive" className='text-red-500 bg-gray-800 border-0'>
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription >{error}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* Illustration Image */}
      <div className="mt-8">
        <img
          src="https://i.postimg.cc/HxHyt53c/undraw-heatmap-uyye.png"
          alt="Illustration"
          className="w-full max-w-sm mx-auto"
        />
      </div>
    </div>
  );
}
