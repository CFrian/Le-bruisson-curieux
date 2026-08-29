const express = require('express');
const router = express.Router({ mergeParams: true });
const ficheInfoController = require('../../controllers/sequelize/ficheInfoController');
const requireAuth = require('../../middlewares/requireAuth');

router.get('/', ficheInfoController.getAllByArticle);
router.get('/:id', ficheInfoController.getById);

router.post('/', requireAuth, ficheInfoController.create);
router.put('/:id', requireAuth, ficheInfoController.update);
router.delete('/:id', requireAuth, ficheInfoController.remove);

module.exports = router;