const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/sequelize/articleController');
const chapitreRoute = require('./chapitreRoute');
const ficheInfoRoute = require('./ficheInfoRoute');
const mediaRoute = require('./mediaRoute');

const requireAuth = require('../../middlewares/requireAuth');

router.use('/:idArticle/chapitres', chapitreRoute);
router.use('/:idArticle/fiche-info', ficheInfoRoute);
router.use('/:idArticle/medias', mediaRoute);

// Public
router.get('/', articleController.getAll);
router.get('/slug/:slug', articleController.getBySlug);
router.get('/:id', articleController.getById);

// Protégé (admin)
router.post('/', requireAuth, articleController.create);
router.put('/:id', requireAuth, articleController.update);
router.delete('/:id', requireAuth, articleController.remove);

module.exports = router;