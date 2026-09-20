# Le Bruisson Curieux

Projet de fin d'études : Titre professionnel Développeur Web et Web Mobile (DWWM).

Site fullstack combinant un **portfolio** et un **blog** dédié au son (musique, bruitages, sound design dans les films, séries et jeux vidéo). 

🔗 Démo : https://le-bruisson-curieux-kazx.onrender.com

## Objectifs

- Concevoir et développer une application web complète.
- Mettre en œuvre une architecture back-end avec deux bases de données (SQL et NoSQL) selon la nature des données.
- Construire une interface d'administration permettant de gérer tout le contenu sans intervention en base.
- Appliquer les bonnes pratiques professionnelles : sécurité, séparation des responsabilités, responsive design, documentation.

## Technologies utilisées

Front-end
- React (Vite)
- React Router
- Tailwind CSS

Back-end
- Node.js / Express
- MongoDB + Mongoose (données du portfolio : CV, projets, prestations)
- MySQL + Sequelize (données du blog : articles, chapitres, paragraphes, auteurs, catégories, tags, médias)
- JWT (authentification admin)
- Cloudinary (hébergement des médias uploadés)

Outils / méthodologie
- Looping (modélisation Merise MCD/MLD pour la base MySQL)
- Docker (conteneurisation du back-end)
- Git / GitHub

## Fonctionnalités

### Portfolio
- Présentation du profil et du CV (formations, expériences, compétences, disponibilités)
- Présentation des projets réalisés
- Présentation des prestations proposées

### Blog
- Liste des articles avec filtres (catégorie, tag) et tri par date
- Page article détaillée : chapitres, paragraphes, médias (image / vidéo / audio intégrés)
- Système de favoris (stockage local navigateur)

### Administration
- Authentification sécurisée (JWT)
- CRUD complet sur toutes les entités du portfolio et du blog
- Gestion des médias (upload différé vers Cloudinary, déclenché uniquement à l'enregistrement)
- Interface distincte du site public (navigation dédiée)

### À venir
- Soundboard (en conception)
- Hébergement de la base MySQL en ligne

## Architecture

Le back-end expose une seule API Express connectée à deux bases de données, chacune organisée dans sa propre couche (modèles / repositories / services / contrôleurs / routes) :

- MongoDB / Mongoose → contenu du portfolio
- MySQL / Sequelize → contenu du blog, modélisé selon la méthode Merise (MCD/MLD)

Cette séparation permet d'illustrer la maîtrise des deux paradigmes (NoSQL orienté documents, SQL relationnel) sur un même projet.

## Sécurité

- Accès à la base MySQL via un utilisateur dédié.
- Authentification admin par JWT.
- En-têtes de sécurité HTTP via Helmet.

## Déploiement

- Back-end conteneurisé avec Docker (image Node, build testé et fonctionnel).
- Application déployée sur Render.

## État du projet

Septembre 2026 : Portfolio et blog sont fonctionnels de bout en bout (back-end, administration, pages publiques). Le responsive design est en cours de finalisation. La soundboard n'est pas encore développée.


## Auteur

CFrian - projet réalisé dans le cadre du titre professionnel DWWM.