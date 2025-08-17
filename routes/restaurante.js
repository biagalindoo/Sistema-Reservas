const express = require('express');
const Restaurante = require('../models/Restaurante');
const router = express.Router();

// Obter todos os restaurantes
router.get('/', async (req, res) => {
    const restaurantes = await Restaurante.find();
    res.json(restaurantes);
});

// Criar um novo restaurante
router.post('/', async (req, res) => {
    const novoRestaurante = new Restaurante(req.body);
    await novoRestaurante.save();
    res.status(201).json(novoRestaurante);
});

module.exports = router;
