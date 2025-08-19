const mongoose = require('mongoose');

const RestauranteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    endereco: { type: String, required: true },
    telefone: { type: String, required: true }
});

module.exports = mongoose.model('Restaurante', RestauranteSchema);
