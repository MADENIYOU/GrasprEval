import { useState } from "react";

interface CorrectionButtonProps {
  setCorrectionResult: (result: any) => void;
  taskId: string | null;
  setTaskId: (taskId: string) => void;
}

export default function CorrectionButton({
  setCorrectionResult,
  taskId,
  setTaskId,
}: CorrectionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const startCorrection = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/start_correction", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Erreur lors du démarrage de la correction");

      const data = await response.json();
      console.log("Tâche démarrée avec ID :", data.task_id);
      setTaskId(data.task_id);
      setMessage("Correction démarrée avec succès !");
    } catch (error) {
      console.error("Erreur :", error);
      setMessage("Erreur lors du démarrage de la correction.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!taskId) {
      alert("Aucune tâche en cours !");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/task_status/${taskId}`);
      const data = await response.json();

      if (data.status === "Terminé") {
        setCorrectionResult(data.result);
        setMessage("Correction terminée !");
      } else {
        setMessage(`Statut de la tâche : ${data.status}`);
      }
    } catch (error) {
      console.error("Erreur :", error);
      setMessage("Erreur lors de la vérification du statut.");
    }
  };

  return (
    <div>
      <button
        onClick={startCorrection}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "Démarrage en cours..." : "Démarrer la correction"}
      </button>
      <button
        onClick={checkStatus}
        disabled={!taskId || isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 ml-4"
      >
        Voir le statut
      </button>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
}