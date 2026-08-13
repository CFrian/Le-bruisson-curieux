const cvService = require('../services/cvService');

const getCV = async (req, res, next) => {
    try {
        const cv = await cvService.getCV()
        res.json(cv)
    } catch (err) {
        next(err)
    }
};


const updateCV = async (req, res, next) => {
    try {
        const updated = await cvService.updateCV(req.body)
        res.json(updated)
    } catch (err) {
        next(err)
    }

}


module.exports = { getCV, updateCV };