const express = require('express');
const Reserva = require('../models/Reserva');
const router = express.Router();

// Obter todas as reservas
router.get('/', async (req, res) => {
    const reservas = await Reserva.find().populate('restauranteId');
    res.json(reservas);
});

// Criar uma nova reserva
router.post('/', async (req, res) => {
    const novaReserva = new Reserva(req.body);
    await novaReserva.save();
    res.status(201).json(novaReserva);
});

module.exports = router;
