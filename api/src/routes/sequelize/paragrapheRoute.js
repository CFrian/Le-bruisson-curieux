const express = require('express');
const router = express.Router({ mergeParams: true });
const requireAuth = require('../../middlewares/requireAuth');
const paragrapheController = require('../../controllers/sequelize/paragrapheController');
const mediaRoute = require('./mediaRoute');

router.use('/:idParagraphe/medias', mediaRoute);

router.get('/', paragrapheController.getAllByChapitre);
router.get('/:id', paragrapheController.getById);

router.post('/', requireAuth, paragrapheController.create);
router.put('/:id', requireAuth, paragrapheController.update);
router.delete('/:id', requireAuth, paragrapheController.remove);

module.exports = router;