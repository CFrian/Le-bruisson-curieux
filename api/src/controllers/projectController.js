// Reçoit la requête HTTP (req), appelle le service correspondant, et traduit le résultat (ou l'erreur) en réponse HTTP (res).
// ne parle jamais directement à Mongoose.

const projetService = require('../services/projectService')

//GET => projects - liste publique des projets donc non archivés

const getAllProjects = async (req, res, next) => {
    try {
        const projects = await projetService.getAllPublic()
        res.json(projects)
    } catch (err) {
        next(err)
    }
}


// GET => /:id - récupérer un projet précis
const getOneProject = async (req, res, next) => {
    try {
        const project = await projetService.getById(req.params.id)
        res.json(project)
    } catch (err) {
        next(err)
    }
}


//POST => projects - creation d'un projet
const createProject = async (req, res, next) => {
    try {
        const project = await projetService.create(req.body)
        res.status(201).json({ message: "Projet créé avec succès", project })
    } catch (err) {
        next(err)
    }
}

//PATCH => /:id - mise a jour d'un projet
const updateProject = async (req, res, next) => {
    try {
        const project = await projetService.update(req.params.id, req.body)
        res.json({ message: "Le projet a été mit à jour", project })
    } catch (err) {
        next(err)
    }
}

//REMOVE => :/id - supprime un projet précis
const removeProject = async (req, res, next) => {
    try {
        const project = await projetService.remove(req.params.id)
        res.status(200).json({ message: "Le projet a été supprimé avec succès" })
    } catch (err) {
        next(err)
    }
}

module.exports = { getAllProjects, getOneProject, createProject, updateProject, removeProject }