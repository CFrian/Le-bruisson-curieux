const express = require('express');
const router = express.Router();
const auteurController = require('../../controllers/sequelize/auteurController');
const requireAuth = require('../../middlewares/requireAuth');

router.get('/', auteurController.getAll);
router.get('/:id', auteurController.getById);

router.post('/', requireAuth, auteurController.create);
router.put('/:id', requireAuth, auteurController.update);
router.delete('/:id', requireAuth, auteurController.remove);

module.exports = router;