import React from "react";
import ClassCard from "./ClassCard";
import { getClasses } from "../../lib/getClasses"; // Importez la fonction getClasses

interface Class {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  redirectUrl: string; // URL de redirection
}

interface ClassListProps {
  classes: Class[]; // Props pour les classes
}

const ClassList: React.FC<ClassListProps> = ({ classes }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="space-y-5 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.id}
            id={classItem.id}
            name={classItem.name}
            description={classItem.description}
            imageUrl="/images/imageCard.jpg"
            redirectUrl={classItem.redirectUrl}
          />
        ))}
      </div>
    </div>
  );
};

// Récupérer les classes côté serveur
export const getServerSideProps = async () => {
  const classesFromDb = await getClasses();
  console.log(classesFromDb);
  
  const classes: Class[] = classesFromDb.map((classItem: { id: any; name: any; }) => ({
    id: classItem.id,
    name: classItem.name,
    description: `Description de la classe ${classItem.name}.`, // Description générique
    imageUrl: "https://loremflickr.com/g/320/240/team", // Image générique
    redirectUrl: `/api/classe/${classItem.id}`, // URL de redirection dynamique
  }));

  console.log(classes);

  return {
    props: {
      classes, // Passer les classes en tant que props
    },
  };
};

export default ClassList;