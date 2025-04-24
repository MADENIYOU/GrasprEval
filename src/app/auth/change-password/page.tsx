// @ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // Step 1 = Verify code, Step 2 = Reset password
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Récupérer le code de réinitialisation depuis l'URL
  useEffect(() => {
    if (router.query?.code) {
      const code = router.query.code as string;
      setCode(code);  // Set the code from the URL
      handleVerifyCode(code); // Vérifier le code à partir de l'URL dès que la page est chargée
    }
  }, [router.query]);

  // Fonction de vérification du code
  const handleVerifyCode = async (code: string) => {
    if (!code) {
      setError('Code de réinitialisation manquant.');
      return;
    }

    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (res.ok) {
      setStep(2); // Passer à l'étape 2 si le code est valide
      setMessage('Code vérifié. Vous pouvez maintenant choisir un nouveau mot de passe.');
      setError('');
    } else {
      setError(data.error || 'Erreur lors de la vérification du code.');
    }
  };

  // Fonction pour réinitialiser le mot de passe
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

        {/* Etape 1: Vérification du code */}
        {step === 1 && (
          <div>
            <p className="text-white mb-4">Nous avons envoyé un code de vérification à votre email. Si vous avez déjà reçu le code, veuillez entrer votre email et le code ici :</p>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Button onClick={() => handleVerifyCode(code)} className="w-full">Vérifier le code</Button>
          </div>
        )}

        {/* Etape 2: Changer le mot de passe */}
        {step === 2 && (
          <div>
            <Input
              placeholder="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handlePasswordChange} className="w-full">Mettre à jour</Button>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <Alert variant="destructive" className="mt-4 text-red-500 bg-gray-800 border-0">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Message de succès */}
        {message && (
          <Alert variant="success" className="mt-4 text-green-500 bg-gray-800 border-0">
            <AlertTitle>Succès</AlertTitle>
            <AlertDescription className="text-green-600">{message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
