const mongoose = require('mongoose');
const CV = require('../src/models/cvModel');
require('dotenv').config({ quiet: true });

const cvData = {
    identite: {
        photo: null,
        nom: 'Florian Costes',
        titre: 'Développeur Web & Web Mobile',
        statut: 'en formation',
        recherche: 'Alternance sept. 2026'
    },
    profil: "Après 11 ans dans l'enseignement et la production audio, je me reconvertis aujourd'hui dans le développement. Actuellement en formation de développeur full-stack, je m'appuie sur la curiosité, la rigueur et l'esprit collaboratif développés au fil de mon parcours. Je recherche une alternance pour poursuivre ma montée en compétences et contribuer activement aux projets.",
    contact: {
        telephone: '06 64 03 29 90',
        email: 'costes.fl@gmail.com',
        localisation: { ville: 'Limendous', codePostal: '64420', zones: ['Pau', 'Tarbes', 'Lourdes'] },
        reseaux: [
            { plateforme: 'GitHub', url: 'https://github.com/CFrian' },
            { plateforme: 'LinkedIn', url: 'https://www.linkedin.com/in/costes-florian/' }
        ]
    },
    competencesTransverses: [
        { categorie: 'Pédagogie', details: ['9 ans enseignement', 'Vulgarisation', 'Documentation'] },
        { categorie: 'Rigueur', details: ['Workflows', 'Délais', 'Organisation'] },
        { categorie: 'Collaboration', details: ["Dev/Design", "Esprit d'équipe"] },
        { categorie: 'Autoformation', details: ['Rapide', 'Autonome'] }
    ],
    blocsTechniques: [{
        contexte: 'En formation Développeur Web (mars-sept. 2026)',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Stack MERN', 'API REST', 'Figma (UI/UX)', 'POO', 'UML', 'Git/GitHub', 'Méthodes Agile/Scrum', 'Tests unitaires', 'CI/CD', 'DevOps', 'AWS']
    }],
    langues: [
        { langue: 'Français', niveau: 'Langue maternelle' },
        { langue: 'Anglais', niveau: 'B2' }
    ],
    interets: [
        { categorie: 'Sport', items: ['Judo', 'Escalade'] },
        { categorie: 'Créatif', items: ['Guitare', 'Bricolage', 'Rénovation'] },
        { categorie: 'Curiosités', items: ['Géopolitique', 'Arboriculture fruitière'] }
    ],
    formations: [
        {
            intitule: 'Développeur Web et Web Mobile',
            etablissement: 'La Fabrique Numérique Paloise',
            niveau: 'Titre professionnel niveau 5 (Bac+2)',
            dateDebut: new Date('2026-03-01'),
            dateFin: null,
            description: 'Fullstack MERN, Agile, DevOps, AWS',
            stages: [
                { label: 'Avril-Mai', dateDebut: new Date('2026-04-01'), dateFin: new Date('2026-05-15') },
                { label: 'Juillet-Août', dateDebut: new Date('2026-07-01'), dateFin: new Date('2026-08-31') }
            ]
        },
        {
            intitule: "Concepteur Développeur d'Applications",
            niveau: 'Titre professionnel niveau 6 (Bac+3)',
            modalite: 'Alternance 12-18 mois',
            specialisation: 'Option IA',
            dateDebut: new Date('2026-09-01'),
            dateFin: null
        },
        {
            intitule: 'Diplôme Musique et Sound Design',
            specialisation: 'Intégration jeux vidéo',
            etablissement: 'ISART Digital Paris',
            dateDebut: new Date('2013-09-01'),
            dateFin: new Date('2015-06-30')
        },
        {
            intitule: 'Diplôme Technicien du Son',
            etablissement: 'Studio M Montpellier',
            niveau: 'Niveau 5 (Bac+2)',
            dateDebut: new Date('2011-09-01'),
            dateFin: new Date('2013-06-30')
        }
    ],
    experiences: [
        {
            poste: 'Stage - Développeur web & web mobile',
            contexte: 'Site vitrine artisan',
            type: 'stage',
            dateDebut: new Date('2026-04-01'),
            dateFin: new Date('2026-05-15'),
            missions: ['Maquettage site (Figma)', 'Développement Frontend', 'HTML - Tailwind CSS - JavaScript']
        },
        {
            poste: 'Enseignant - Écoles de jeu vidéo',
            contexte: 'Post-bac',
            type: 'salarie',
            dateDebut: new Date('2017-01-01'),
            dateFin: null,
            missions: ['Direction artistique sonore', 'Accompagnement projets (préproduction à livraison)', 'Collaboration dev/design', 'Vulgarisation technique']
        },
        {
            poste: 'Sound Designer & Ingénieur du son',
            contexte: 'Freelance audiovisuel et jeu vidéo',
            type: 'freelance',
            dateDebut: new Date('2015-01-01'),
            dateFin: null,
            missions: ['Création sonore et intégration en jeu vidéo', 'Production technique', 'Collaboration équipes dev', 'Workflows rigoureux et délais serrés']
        },
        {
            poste: 'Auto-entrepreneur - Activité culturelle',
            contexte: 'Ateliers pédagogiques',
            type: 'freelance',
            dateDebut: new Date('2015-01-01'),
            dateFin: null,
            missions: ['Ateliers son/bruitage', 'Démarchage B2B structures culturelles', 'Création parcours pédagogiques']
        }
    ],
    disponibilites: [
        { type: 'stage', dateDebut: new Date('2026-07-20'), dateFin: new Date('2026-08-14'), note: 'Possibilité 6 semaines' },
        { type: 'alternance', dateDebut: new Date('2026-09-01'), formationCiblee: "Concepteur Développeur d'Application option IA" }
    ]
};

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await CV.deleteMany({}); // évite les doublons si tu relances le script
    await CV.create(cvData);
    console.log('CV inséré avec succès');
    await mongoose.disconnect();
};

seed();