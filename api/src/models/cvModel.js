const mongoose = require('mongoose');

// --- Objets uniques (non-listes)>>_id désactivé ---

const localisationSchema = new mongoose.Schema({
    ville: String,
    codePostal: String,
    zones: [String]
}, { _id: false });

// --- Éléments de listes >>_id par défaut (ciblage individuel possible) ---

const reseauSchema = new mongoose.Schema({
    plateforme: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: null }
});

const competenceTransverseSchema = new mongoose.Schema({
    categorie: { type: String, required: true },
    details: [String]
});

const blocTechniqueSchema = new mongoose.Schema({
    contexte: { type: String, required: true },
    technologies: [String]
});

const langueSchema = new mongoose.Schema({
    langue: { type: String, required: true },
    niveau: { type: String, required: true }
});

const interetSchema = new mongoose.Schema({
    categorie: { type: String, required: true },
    items: [String]
});

const formationSchema = new mongoose.Schema({
    intitule: { type: String, required: true },
    etablissement: String,
    niveau: String,
    modalite: String,
    specialisation: String,
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, default: null },
    description: String,
});

const experienceSchema = new mongoose.Schema({
    poste: { type: String, required: true },
    contexte: String,
    type: {
        type: String,
        enum: ['stage', 'salarie', 'freelance', 'auto-entrepreneur'],
        required: true
    },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, default: null },
    missions: [String]
});

const disponibiliteSchema = new mongoose.Schema({
    type: { type: String, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: Date,
    note: String,
    formationCiblee: String
});

// --- Objet unique imbriqué qui dépend des schémas ci-dessus ---

const contactSchema = new mongoose.Schema({
    telephone: String,
    email: { type: String, required: true },
    localisation: localisationSchema,
    reseaux: [reseauSchema]
}, { _id: false });

// --- Schéma principal ---

const cvSchema = new mongoose.Schema({
    identite: {
        nom: { type: String, required: true },
        titre: { type: String, required: true },
        statut: String,
        recherche: String
    },
    profil: { type: String, required: true },
    contact: contactSchema,
    competencesTransverses: [competenceTransverseSchema],
    blocsTechniques: [blocTechniqueSchema],
    langues: [langueSchema],
    interets: [interetSchema],
    formations: [formationSchema],
    experiences: [experienceSchema],
    disponibilites: [disponibiliteSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cv', cvSchema, 'cvs');