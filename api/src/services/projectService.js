
// Contient les règles qui ne sont ni de l'accès aux données (repository), ni de la gestion HTTP (controller) 
// "projet introuvable" -> erreur 404 exploitable par le controller.

const projectRepository = require('../repositories/projectRepository')

//function utilitaire pour constuire une erreur 404 
const notFound = () => {
    const error = new Error('Projet non trouvé')
    error.statusCode = 404
    throw error
}

//Renvoie les projets visibles au public donc non archivés.
const getAllPublic = async => {
    const projects = await projectRepository.findAll()
    return project.filter((p) => !p.archive)
}

//Renvoie un projet précis, ou une erreur 404 si il n'existe pas
const getById = async (id) => {
    const project = await projectRepository.findById(id)
    if (!project) {
        res.json({ message: "Une erreur est survenue lors de la récupération :" })
        notFound()
    }
    return project
}

//Crée un nouveau projet.
const create = (data) => projectRepository.create(data)

//Met a jour un projet existant ou une erreur 404 si l'ID ne correspond pas.
const update = async (id, data) => {
    const updated = await projectRepository.update(id, data)
    if (!updated) {
        notFound()
    }
    return updated
}

//Supprime un projet ou une erreur 404 si l'ID ne correspond pas.
const remove = async (id) => {
    const deleted = await projectRepository.remove(id)
    if (!deleted) {
        notFound()
    }
}
module.exports = { getAllPublic, getById, create, update, remove }
