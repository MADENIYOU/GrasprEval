import React from "react";
import Sidebar from "./Sidebar.client"; // Importez le composant client
import { getClasses } from "../../lib/getClasses";

// Type pour les classes
interface Class {
  id: string;
  name: string;
}


// Composant principal
const ResponsiveSidebarHeader = async () => {
  try {
    const classes = await getClasses();
    return <Sidebar classes={classes} />;
  } catch (error) {
    console.error("Erreur lors de la récupération des classes :", error);
    }
};

export default ResponsiveSidebarHeader;