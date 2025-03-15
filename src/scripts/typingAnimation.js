// Fonction pour l'animation de frappe
function startTypingAnimation() {
    const typingElements = document.querySelectorAll(".typing-animation");
  
    typingElements.forEach((element) => {
      const text = element.getAttribute("data-text"); // Texte à afficher
      const delay = parseFloat(element.getAttribute("data-delay")) || 0; // Délai avant le début de l'animation
      const duration = 0.05; // Durée entre chaque lettre (en secondes)
  
      let currentIndex = 0;
  
      setTimeout(() => {
        const interval = setInterval(() => {
          if (currentIndex < text.length) {
            element.textContent += text[currentIndex]; // Ajoute une lettre
            currentIndex++;
          } else {
            clearInterval(interval); // Arrête l'animation
          }
        }, duration * 1000);
      }, delay * 1000);
    });
  }
  
  // Démarrer l'animation une fois la page chargée
  document.addEventListener("DOMContentLoaded", startTypingAnimation);