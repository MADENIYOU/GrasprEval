//@ts-nocheck

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const urlEmail = searchParams.get('email');
    const urlCode = searchParams.get('code');

    if (urlEmail && urlCode) {
      setEmail(urlEmail);
      setCode(urlCode);
      autoVerify(urlEmail, urlCode);
    }
  }, [searchParams]);

  const autoVerify = async (email: string, code: string) => {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setStep(2);
    } else {
      const data = await res.json();
      setError(data.error || 'Code invalide.');
    }
  };

  const verifyCode = async () => {
    setError('');
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setStep(2);
    } else {
      const data = await res.json();
      setError(data.error || 'Code invalide.');
    }
  };

  const resetPassword = async () => {
    setError('');
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setSuccess('Mot de passe mis à jour ! Redirection...');
      setTimeout(() => router.push('/auth'), 2000);
    } else {
      const data = await res.json();
      setError(data.error || 'Échec de la réinitialisation.');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-lg rounded-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Réinitialisation du mot de passe
        </h1>

        {step === 1 ? (
          <div className="space-y-4 w-full">
            <Input
              placeholder="Votre email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 text-white placeholder-gray-400"
              required
            />
            <Input
              placeholder="Code reçu par mail"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-gray-700 text-white placeholder-gray-400"
              required
            />
            <Button onClick={verifyCode} className="w-full bg-blue-600 text-white">
              Vérifier le code
            </Button>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <Input
              placeholder="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-700 text-white placeholder-gray-400"
              required
            />
            <Button onClick={resetPassword} className="w-full bg-green-600 text-white">
              Réinitialiser le mot de passe
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4 w-full">
            <AlertTitle className='text-red-600'>Erreur</AlertTitle>
            <AlertDescription className='text-red-600'>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mt-4 w-full">
            <AlertTitle className='text-green-600'>Succès</AlertTitle>
            <AlertDescription className='text-green-600'>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
