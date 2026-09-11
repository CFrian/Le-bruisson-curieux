const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const requireAuth = require('../middlewares/requireAuth')


//Routes publiques sans token
router.get('/', projectController.getAllProjects)
router.get('/:id', projectController.getOneProject)


//Routes protégées avec token
router.post('/', requireAuth, projectController.createProject)
router.patch('/:id', requireAuth, projectController.updateProject)
router.delete('/:id', requireAuth, projectController.removeProject)


module.exports = router