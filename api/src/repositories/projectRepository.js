const Project = require('../models/projectModel');

const findAll = () => Project.find().sort({ ordre: 1 });
const findById = (id) => Project.findById(id);
const create = (data) => Project.create(data);
const update = (id, data) => Project.findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after', runValidators: true });
const remove = (id) => Project.findByIdAndDelete(id);

module.exports = { findAll, findById, create, update, remove };