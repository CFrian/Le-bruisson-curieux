const cvRepository = require('../repositories/cvRepository')

const getCV = async () => {
    const cv = await cvRepository.findCV()
    if (!cv) {
        const error = new Error('CV non trouvé')
        error.statusCode = 404
        throw error
    }
    return cv
}

// Met à jour le CV existant. Commme il n'y a qu'un seul document CV (singleton),
// on le retrouve d'abord via findCV() pour récupérer son _id,
// plutôt que d'exiger que le front connaisse cet id à l'avance.

const updateCV = async (data) => {
    const existingCV = await cvRepository.findCV()
    if (!existingCV) {
        const error = new Error('CV non trouvé')
        error.statusCode = 404
        throw error
    }
    const updated = await cvRepository.updateCV(existingCV._id, data)
    return updated
}

module.exports = { getCV, updateCV }