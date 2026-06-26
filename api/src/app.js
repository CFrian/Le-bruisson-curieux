const express = require('express');
const cors = require('cors');
const cvRoutes = require('./routes/cvRoute')
const errorHandler = require('./middlewares/errorHandler')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cv', cvRoutes)

app.use(errorHandler) // toujours en dernier Express l'identifie comme middleware d'erreur car il a 4 paramètres (err en premier). Il n'est déclenché que via next(err), 
// et doit être enregistré après toutes les routes — sinon les erreurs survenant dans des routes déclarées après lui ne seraient jamais interceptées.





module.exports = app;