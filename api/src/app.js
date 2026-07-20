const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cvRoutes = require('./routes/cvRoute');
const projectRoutes = require('./routes/projectRoute');
const authRoutes = require('./routes/authRoute');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/projects', projectRoutes);

app.use(errorHandler);

module.exports = app;