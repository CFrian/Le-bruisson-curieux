const express = require('express');
const cors = require('cors');
const cvRoutes = require('./routes/cvRoute')
const projectRoutes = require('./routes/projectRoute')
const errorHandler = require('./middlewares/errorHandler')

const app = express();

//middlewares sont traités dans l'ordre d'enregistrement
app.use(cors());   // 1er
app.use(express.json());  // 2ème

app.use('/api/cv', cvRoutes) // 3ème
app.use('/api/projects', projectRoutes)// 4ème 





app.use(errorHandler) // dernier — uniquement déclenché par next(err) => middleware d'erreur car il a 4 paramètres (err en premier). Il n'est déclenché que via next(err), 
// et doit être enregistré après toutes les routes — sinon les erreurs survenant dans des routes déclarées après lui ne seraient jamais interceptées.

module.exports = app;