const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// conectar ao MongoDB
mongoose.connect('mongodb://localhost/sistema-reservas', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// definir rotas
const restauranteRoutes = require('./routes/restaurante');
const reservaRoutes = require('./routes/reserva');

app.use('/restaurantes', restauranteRoutes);
app.use('/reservas', reservaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
