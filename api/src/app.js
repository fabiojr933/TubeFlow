const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const downloadRoutes = require('./routes/downloadRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());
// Servir arquivos estáticos da pasta public
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Rotas
app.use('/api/download', downloadRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'YouTube Downloader API 🎬', status: 'online' });
});

module.exports = app;