const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middlewares/requireAuth');
const { body, validationResult } = require('express-validator');


//middleware de validation de body login
const validateLogin = [
    body('email')
        .notEmpty().withMessage('Champ requis')
        .isEmail().withMessage('Email invalide')
        .trim()
        .toLowerCase(),
    body('password')
        .notEmpty().withMessage('Champ requis')
        .isLength({ min: 8 }).withMessage('Minimum 8 caractères'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg)
            error.statusCode = 400
            return next(error)
        }
        next()
    }
]
const validateEmail = [
    body('newEmail')
        .notEmpty().withMessage('Champ requis')
        .isEmail().withMessage('Email invalide')
        .trim()
        .toLowerCase(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg)
            error.statusCode = 400
            return next(error)
        }
        next()
    }
]

//Route publiques
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

//Routes protégées avec access token
router.get('/me', requireAuth, authController.me);
router.patch('/email', requireAuth, validateEmail, authController.updateEmail);
router.post('/refresh', authController.refresh);
router.post('/change-password', requireAuth, authController.changePassword);

module.exports = router;