const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
    restauranteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurante', required: true },
    nomeCliente: { type: String, required: true },
    dataHora: { type: Date, required: true }
});

module.exports = mongoose.model('Reserva', ReservaSchema);
