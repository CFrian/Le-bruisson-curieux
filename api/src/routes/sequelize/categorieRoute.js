const express = require('express');
const router = express.Router();
const categorieController = require('../../controllers/sequelize/categorieController');
const requireAuth = require('../../middlewares/requireAuth');

router.get('/', categorieController.getAll);
router.get('/:id', categorieController.getById);

router.post('/', requireAuth, categorieController.create);
router.put('/:id', requireAuth, categorieController.update);
router.delete('/:id', requireAuth, categorieController.remove);

module.exports = router;