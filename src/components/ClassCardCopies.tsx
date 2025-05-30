// components/ClassCard.tsx
import React from "react";
import Link from "next/link";

interface ClassCardProps {
  id: string; // ID de l'examen
  name: string; // Nom de l'examen
  imageUrl: string; // URL de l'image de l'examen
  description: string; // Description de l'examen
  redirectUrl?: string; // URL de redirection (optionnel)
}

const ClassCard: React.FC<ClassCardProps> = ({
  id,
  name,
  imageUrl,
  description,
  redirectUrl,
}) => {
  // URL de redirection par défaut vers la page des copies de l'examen
  const href = redirectUrl || `/exams/${encodeURIComponent(name)}/${id}`;

  return (
    <Link href={href} passHref className="w-full">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300 border border-gray-200 max-w-xs">
        {/* Image de la carte */}
        <img
          className="w-full h-48 object-cover"
          src={imageUrl}
          alt={name}
        />

        {/* Contenu de la carte */}
        <div className="p-6">
          {/* Titre de la carte */}
          <div className="text-xl font-semibold text-gray-800 mb-2">{name}</div>

          {/* Description de la carte */}
          <p className="text-gray-600 text-sm">{description}</p>

          {/* Informations supplémentaires */}
          <div className="mt-4 text-gray-500 text-xs">
            <span className="font-medium">Enseignant :</span> {description}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClassCard;