const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cvRoutes = require('./routes/cvRoute');
const projectRoutes = require('./routes/projectRoute');
const authRoutes = require('./routes/authRoute');
const uploadRoutes = require('./routes/uploadRoute');
const errorHandler = require('./middlewares/errorHandler');
const articleRoute = require('./routes/sequelize/articleRoute');
const tagRoute = require('./routes/sequelize/tagRoute');
const categorieRoute = require('./routes/sequelize/categorieRoute');

const app = express();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // fenêtre de temps sur laquelle on compte les tentatives.
    max: 4, //nombre de tentative par ip
    message: { message: 'Trop de tentatives, réessayez dans 15 minutes' }
})

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true // autorise l'envoi des cookies cross-origin
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet())

app.use('/api/auth/login', loginLimiter)  // Doit être lu avant les routes ! pour bloquer si trop de connexion
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoute);
app.use('/api/tags', tagRoute);
app.use('/api/categories', categorieRoute);
app.use('/api/cv', cvRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/florian-costes-prestations', (req, res) => {
    res.json({ message: `bienvenue sur le portfolio de ${process.env.ADMIN_NAME} - Développeur Web & Web Mobile` })
})

app.use(errorHandler);  // gestionnaire d'erreur doit être positionné en dernier

module.exports = app;