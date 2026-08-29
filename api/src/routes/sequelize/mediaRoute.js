const express = require('express');
const router = express.Router({ mergeParams: true });
const mediaController = require('../../controllers/sequelize/mediaController');
const requireAuth = require('../../middlewares/requireAuth');

router.get('/', mediaController.getAll);
router.get('/:id', mediaController.getById);

router.post('/', requireAuth, mediaController.create);
router.put('/:id', requireAuth, mediaController.update);
router.delete('/:id', requireAuth, mediaController.remove);

module.exports = router;