const tagRepository = require('../../repositories/sequelize/tagRepository');

function getAllTags() {
    return tagRepository.findAll();
}

async function getTagById(id) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
        const err = new Error('Tag introuvable');
        err.status = 404;
        throw err;
    }
    return tag;
}

function validerDonnees(donnees) {
    if (!donnees.nomTag || donnees.nomTag.trim() === '') {
        const err = new Error('Le nom du tag est obligatoire');
        err.status = 400;
        throw err;
    }
    if (!donnees.slugTag || donnees.slugTag.trim() === '') {
        const err = new Error('Le slug du tag est obligatoire');
        err.status = 400;
        throw err;
    }
}

function createTag(donnees) {
    validerDonnees(donnees);
    return tagRepository.create(donnees);
}

async function updateTag(id, donnees) {
    await getTagById(id);
    validerDonnees(donnees);
    return tagRepository.update(id, donnees);
}

async function deleteTag(id) {
    await getTagById(id);
    return tagRepository.remove(id);
}

module.exports = { getAllTags, getTagById, createTag, updateTag, deleteTag };