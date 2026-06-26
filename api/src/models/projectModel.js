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


module.exports = mongoose.model('project', projectSchema)