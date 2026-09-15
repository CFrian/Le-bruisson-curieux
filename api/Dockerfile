
#Socle node 24 + linux léger version alpine
FROM node:24-alpine

# Dossier dans lequel seront stocker les fichiers de l'image que l'on va créer
WORKDIR /app

# Copie uniquement package.json et package-lock.json dans le WORKDIR /app
#Tant que ces deux fichiers ne changent pas, Docker réutilise le cache de "npm install" 
# évite de retélécharger toutes les dépendances à chaque modification du code source, seulement quand les dépendances changent vraiment.
COPY package*.json ./

# Installe les dépendances de production,  OMETTRE devDependencies
RUN npm install --omit=dev

# Copie maintenant le reste du code source de l'application
COPY . .

# Documente le port utilisé par l'application 
EXPOSE 3000

# Commande exécutée au démarrage du conteneur équivalent de `node server.js`,
CMD ["node", "server.js"]