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

module.exports = { getCV }