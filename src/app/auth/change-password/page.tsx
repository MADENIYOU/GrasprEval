//@ts-nocheck

'use client';

import { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleVerifyCode = async () => {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (res.ok) {
      setStep(2);
      setMessage('Code vérifié. Vous pouvez maintenant choisir un nouveau mot de passe.');
      setError('');
    } else {
      setError(data.error || 'Erreur');
    }
  };

  const handlePasswordChange = async () => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    if (res.ok) {
      setMessage('Mot de passe mis à jour. Redirection...');
      setTimeout(() => router.push('/auth'), 2000);
    } else {
      const data = await res.json();
      setError(data.error || 'Erreur lors de la mise à jour.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Réinitialiser le mot de passe</h1>

        {step === 1 && (
          <>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Input
              placeholder="Code reçu"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handleVerifyCode} className="w-full">Vérifier</Button>
          </>
        )}

        {step === 2 && (
          <>
            <Input
              placeholder="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handlePasswordChange} className="w-full">Mettre à jour</Button>
          </>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4 text-red-500 bg-gray-800 border-0">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert variant="success" className="mt-4 text-green-500 bg-gray-800 border-0">
            <AlertTitle>Succès</AlertTitle>
            <AlertDescription className='text-green-600'>{message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
