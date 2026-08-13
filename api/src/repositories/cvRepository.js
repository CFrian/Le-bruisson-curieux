const CV = require('../models/cvModel')

const findCV = () => CV.findOne()

const createCV = (data) => CV.create(data)

const updateCV = (id, data) => CV.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true })


module.exports = { findCV, createCV, updateCV };