const express = require('express')
const router = express.Router()
const cvController = require('../controllers/cvController')
const requireAuth = require('../middlewares/requireAuth')

router.get('/', cvController.getCV)
router.patch('/', requireAuth, cvController.updateCV)

module.exports = router