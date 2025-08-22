const express = require("express")
const router = express.Router()
const Reserva = require("../models/Reserva")
const Cliente = require("../models/Cliente")
const Restaurante = require("../models/Restaurante")

// GET /api/reservaspara listar todas as reservas
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, data, restaurante } = req.query
    const query = {}

    if (status) query.status = status
    if (data) {
      const startDate = new Date(data)
      const endDate = new Date(data)
      endDate.setDate(endDate.getDate() + 1)
      query.dataReserva = { $gte: startDate, $lt: endDate }
    }
    if (restaurante) query.restaurante = restaurante

    const reservas = await Reserva.find(query)
      .populate("cliente", "nome telefone email")
      .populate("restaurante", "nome endereco telefone")
      .sort({ dataReserva: -1, horaReserva: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Reserva.countDocuments(query)

    res.json({
      success: true,
      data: reservas,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/reservas/:id para buscar reserva por ID
router.get("/:id", async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id).populate("cliente").populate("restaurante")

    if (!reserva) {
      return res.status(404).json({ success: false, message: "Reserva não encontrada" })
    }
    res.json({ success: true, data: reserva })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/reservas p criar nova reserva
router.post("/", async (req, res) => {
  try {
    // verificar se cliente existe
    const cliente = await Cliente.findById(req.body.cliente)
    if (!cliente) {
      return res.status(400).json({ success: false, message: "Cliente não encontrado" })
    }

    // verificar se restaurante existe
    const restaurante = await Restaurante.findById(req.body.restaurante)
    if (!restaurante) {
      return res.status(400).json({ success: false, message: "Restaurante não encontrado" })
    }

    // verificar disponibilidade
    const reservaExistente = await Reserva.findOne({
      restaurante: req.body.restaurante,
      dataReserva: req.body.dataReserva,
      horaReserva: req.body.horaReserva,
      status: { $in: ["pendente", "confirmada"] },
    })

    if (reservaExistente) {
      return res.status(400).json({ success: false, message: "Horário já reservado" })
    }

    const reserva = new Reserva(req.body)
    await reserva.save()

    const reservaPopulada = await Reserva.findById(reserva._id)
      .populate("cliente", "nome telefone email")
      .populate("restaurante", "nome endereco telefone")

    res.status(201).json({ success: true, data: reservaPopulada })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// PUT /api/reservas/:id p atualizar reserva
router.put("/:id", async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("cliente", "nome telefone email")
      .populate("restaurante", "nome endereco telefone")

    if (!reserva) {
      return res.status(404).json({ success: false, message: "Reserva não encontrada" })
    }

    res.json({ success: true, data: reserva })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/reservas/:id - Cancelar reserva
router.delete("/:id", async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, { status: "cancelada" }, { new: true })

    if (!reserva) {
      return res.status(404).json({ success: false, message: "Reserva não encontrada" })
    }

    res.json({ success: true, message: "Reserva cancelada com sucesso" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/reservas/disponibilidade/:restauranteId - Verificar disponibilidade
router.get("/disponibilidade/:restauranteId", async (req, res) => {
  try {
    const { data, hora } = req.query

    if (!data || !hora) {
      return res.status(400).json({ success: false, message: "Data e hora são obrigatórias" })
    }

    const reservaExistente = await Reserva.findOne({
      restaurante: req.params.restauranteId,
      dataReserva: new Date(data),
      horaReserva: hora,
      status: { $in: ["pendente", "confirmada"] },
    })

    res.json({
      success: true,
      disponivel: !reservaExistente,
      message: reservaExistente ? "Horário já reservado" : "Horário disponível",
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
