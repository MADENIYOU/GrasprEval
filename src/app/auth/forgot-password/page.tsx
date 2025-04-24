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
  const [mode, setMode] = useState<'code' | 'link'>('code');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    setSuccess('');

    const endpoint = mode === 'code'
      ? "/api/auth/forgot-password"
      : "/api/auth/reset-link";

    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      if (mode === 'code') {
        setSuccess('Un code a été envoyé à votre email.');
        setTimeout(() => router.push('/auth/reset-password'), 2000);
      } else {
        setSuccess('Un lien de réinitialisation a été envoyé à votre email.');
      }
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

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              onClick={() => setMode('code')}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
              disabled={isSending}
            >
              {isSending && mode === 'code' ? "Envoi en cours..." : "Envoyer le code"}
            </Button>

            <Button
              type="submit"
              onClick={() => setMode('link')}
              className="w-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
              disabled={isSending}
            >
              {isSending && mode === 'link' ? "Envoi du lien..." : "Générer un lien de réinitialisation"}
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-4">
            <Alert variant="destructive" className="text-red-500 bg-gray-800 border-0">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {success && (
          <div className="mt-4">
            <Alert variant="success" className="mt-4 text-green-500 bg-gray-800 border-0">
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
