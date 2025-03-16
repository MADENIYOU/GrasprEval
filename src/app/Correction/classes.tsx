import ClassList from "@/components/ClassList";
import { getClasses } from "../../../lib/getClasses";

export default async function ClassesPage() {
  const classesFromDb = await getClasses();

  // Formater les données pour correspondre à l'interface Class
  const classes = classesFromDb.map((classItem) => ({
    id: classItem.id,
    name: classItem.name,
    description: `Description de la classe ${classItem.name}.`, // Description générique
    imageUrl: "https://loremflickr.com/g/320/240/team", // Image générique
    redirectUrl: `/classe/${classItem.id}`, // URL de redirection dynamique
  }));

  return (
    <div>
      <ClassList classes={classes} />
    </div>
  );
}