const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const requireAuth = require('../middlewares/requireAuth')

//Route publiques
router.post('/login', authController.login)
router.post('/logout', authController.logout)

//Routes protégées avec access token
router.post('/change-password', requireAuth, authController.changePassword)

module.exports = router