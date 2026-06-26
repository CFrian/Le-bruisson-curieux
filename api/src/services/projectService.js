
// Contient les règles qui ne sont ni de l'accès aux données (repository),
// ni de la gestion HTTP (controller) : ici, la règle "un projet archivé
// n'apparaît jamais dans la liste publique", et la transformation
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
    if (!project) notFound()
    return project
}