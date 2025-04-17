// @ts-nocheck

'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    setSuccess('');

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setSuccess('Un code a été envoyé à votre email.');
      setTimeout(() => router.push('/auth/reset-password'), 2000);  // Redirige vers la page pour saisir le code
    } else {
      const data = await res.json();
      setError(data.error || 'Une erreur est survenue.');
    }

    setIsSending(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-lg rounded-lg flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-6">
          Mot de passe oublié
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <Input
            name="email"
            placeholder="Entrez votre email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-gray-700 text-white placeholder-gray-400"
          />

          <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white" disabled={isSending}>
            {isSending ? "Envoi en cours..." : "Envoyer le code"}
          </Button>
        </form>

        {error && (
          <div className="mt-4">
            <Alert variant="destructive" className='text-red-500 bg-gray-800 border-0'>
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {success && (
          <div className="mt-4">
            <Alert variant="success" className="mt-4 text-green-500 bg-gray-800 border-0">
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription className='text-green-600'>{success}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
