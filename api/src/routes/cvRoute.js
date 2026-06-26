const express = require('express')
const router = express.Router()
const cvController = require('../controllers/cvController')

router.get('/', cvController.getCV)

module.exports = router