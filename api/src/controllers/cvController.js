const cvService = require('../services/cvService');

const getCV = async (req, res, next) => {
    try {
        const cv = await cvService.getCV()
        res.json(cv)
    } catch (err) {
        next(err)
    }
};

module.exports = { getCV };