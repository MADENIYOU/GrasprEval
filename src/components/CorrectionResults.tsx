export default function CorrectionResults({ correctionResult }: { correctionResult: any }) {
  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="font-bold mb-4">Résultat</h2>
      <div className="bg-white p-4 shadow rounded min-h-[100px]">
        {correctionResult ? (
          <pre>{JSON.stringify(correctionResult, null, 2)}</pre> // Affiche le résultat formaté
        ) : (
          "Aucun résultat encore..."
        )}
      </div>
    </div>
  );
}