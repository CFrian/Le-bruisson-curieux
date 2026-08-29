const express = require('express');
const router = express.Router();
const tagController = require('../../controllers/sequelize/tagController');
const requireAuth = require('../../middlewares/requireAuth');

router.get('/', tagController.getAll);
router.get('/:id', tagController.getById);

router.post('/', requireAuth, tagController.create);
router.put('/:id', requireAuth, tagController.update);
router.delete('/:id', requireAuth, tagController.remove);

module.exports = router;