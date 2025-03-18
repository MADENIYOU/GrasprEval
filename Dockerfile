# Utilise l'image de base Node.js 18
FROM node:18

# Crée un répertoire pour l'application
WORKDIR /app

# Copie les fichiers du répertoire courant dans le conteneur
COPY . .

# Installe les dépendances
RUN npm install

# Expose le port que ton application utilise (par exemple, 3000)
EXPOSE 3000

# Commande pour démarrer l'application avec npm run dev
CMD ["npm", "run", "dev"]
