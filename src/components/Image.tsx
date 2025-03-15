import Image from "next/image";
import logo from "../assets/images/download.svg"; // Importez le fichier SVG

const CustomImage = () => {
  return (
    <Image
      src={logo} // Source de l'image
      alt="Logo" // Texte alternatif
      width={100} // Largeur de l'image
      height={50} // Hauteur de l'image
    />
  );
};

export default CustomImage;