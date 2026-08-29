const express = require('express');
const router = express.Router({ mergeParams: true }); // nécessaire pour accéder à :idArticle depuis la route parente.  MergeParams fusionne les paramètres des deux niveaux dans req.params.
const requireAuth = require('../../middlewares/requireAuth');
const chapitreController = require('../../controllers/sequelize/chapitreController');
const paragrapheRoute = require('./paragrapheRoute');
const mediaRoute = require('./mediaRoute');

router.use('/:idChapitre/paragraphes', paragrapheRoute);
router.use('/:idChapitre/medias', mediaRoute);

router.get('/', chapitreController.getAllByArticle);
router.get('/:id', chapitreController.getById);

router.post('/', requireAuth, chapitreController.create);
router.put('/:id', requireAuth, chapitreController.update);
router.delete('/:id', requireAuth, chapitreController.remove);

module.exports = router;