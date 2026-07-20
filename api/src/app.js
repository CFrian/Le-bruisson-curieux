const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cvRoutes = require('./routes/cvRoute');
const projectRoutes = require('./routes/projectRoute');
const authRoutes = require('./routes/authRoute');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // fenêtre de temps sur laquelle on compte les tentatives.
    max: 4, //nombre de tentative par ip
    message: { message: 'Trop de tentatives, réessayez dans 15 minutes' }
})

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet())

app.use('/api/auth/login', loginLimiter)  // Doit être lu avant les routes ! pour bloquer si trop de connexion
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/projects', projectRoutes);

app.use(errorHandler);

module.exports = app;