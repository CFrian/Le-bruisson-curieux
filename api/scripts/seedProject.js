// Ajout des "projects" manuellement avec des données de test/démo.


const mongoose = require('mongoose');
const Project = require('../src/models/projectModel');
require('dotenv').config({ quiet: true }); // charge MONGO_URI depuis ton .env

const projectsData = [
    {
        titre: "Site vitrine artisan couturière",
        description: "Création du site vitrine pour une artisane couturière : présentation, galerie de réalisations, formulaire de contact.",
        stack: ["HTML", "CSS", "JavaScript", "dev"],
        lienDemo: "", // à compléter si en ligne
        lienRepo: "https://github.com/CFrian/Site-Vitrine-couture", // lien GitHub du repo
        image: "/public/atelier_couture.JPG", // à compléter une fois l'upload (multer) en place
        ordre: 1,
        archive: false
    },
    {
        titre: "Le bruisson curieux",
        description: "Blog avec e-commerce intégré, gestion de compte utilisateur et base de données.",
        stack: ["React", "Node.js", "Express", "MongoDB", "dev"],
        lienDemo: "",
        lienRepo: "https://github.com/CFrian/Le-bruisson-curieux",
        image: "/public/img-test_bruisson.jpg",
        ordre: 2,
        archive: false
    },
    {
        titre: "Sonodeck",
        description: "Projet audio interactif — à compléter selon le contenu réel.",
        stack: ["JavaScript", "Web Audio API", "audio", "dev"],
        lienDemo: "",
        lienRepo: "https://github.com/CFrian/Le-bruisson-curieux",
        image: "/public/img-test_sonodeck.png",
        ordre: 3,
        archive: false
    },
];

async function seed() {
    try {
        // Connexion à MongoDB avec la même URI que ton serveur principal
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connecté à MongoDB");

        // Supprime les anciens projets avant de réinsérer (évite les doublons si tu relances le script)
        await Project.deleteMany({});
        console.log("Anciens projets supprimés");

        // Insère tous les projets définis ci-dessus en une seule opération
        await Project.insertMany(projectsData);
        console.log(`${projectsData.length} projets ajoutés avec succès`);

    } catch (error) {
        console.error("Erreur pendant le seed :", error);
    } finally {
        // Ferme proprement la connexion, sinon le script Node reste bloqué en arrière-plan
        await mongoose.disconnect();
        console.log("Déconnecté de MongoDB");
    }
}

seed();