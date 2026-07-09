//mapping route

// Endpoints REST pour les projets.
// Fait le lien entre une URL/méthode HTTP et le controller correspondant.


const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')

router.get('/', projectController.getAllProjects)
router.get('/:id', projectController.getOneProject)
router.post('/', projectController.createProject)
router.patch('/:id', projectController.updateProject)
router.delete('/:id', projectController.removeProject)


module.exports = router