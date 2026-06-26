const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String, required: true },
    stack: [String],
    lienDemo: { type: String },
    lienRepo: { type: String },
    image: { type: String, default: null },
    ordre: { type: Number, default: 0 },
    archive: { type: Boolean, default: false }
}, { timestamps: true })


module.exports = mongoose.model('Project', projectSchema, 'projects');
// 1er argument : nom du modèle (singulier, PascalCase) — utilisé dans le code JS et les futures relations (ref: 'Project')
// 2e argument : le schéma défini ci-dessus
// 3e argument : nom exact de la collection MongoDB (explicite, pour ne pas dépendre de la pluralisation automatique de Mongoose)