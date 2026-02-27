const express = require('express');
const path = require('path');

const webRoutes = require('./routes/webRoutes');

const app = express();

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas
app.use('/', webRoutes);

module.exports = app;
