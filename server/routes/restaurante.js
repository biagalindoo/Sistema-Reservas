const express = require("express")
const router = express.Router()
const Restaurante = require("../models/Restaurante")

// GET para listar todos os restaurantes
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, nome, cidade, tipoComida } = req.query
    const query = { ativo: true }

    if (nome) query.nome = new RegExp(nome, "i")
    if (cidade) query["endereco.cidade"] = new RegExp(cidade, "i")
    if (tipoComida) query.tipoComida = { $in: [tipoComida] }

    const restaurantes = await Restaurante.find(query)
      .sort({ nome: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Restaurante.countDocuments(query)

    res.json({
      success: true,
      data: restaurantes,
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

// GET id para buscar restaurante por ID
router.get("/:id", async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id)
    if (!restaurante) {
      return res.status(404).json({ success: false, message: "Restaurante não encontrado" })
    }
    res.json({ success: true, data: restaurante })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST para criar novo restaurante
router.post("/", async (req, res) => {
  try {
    const restaurante = new Restaurante(req.body)
    await restaurante.save()
    res.status(201).json({ success: true, data: restaurante })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// PUT procura por id para atualizar restaurante
router.put("/:id", async (req, res) => {
  try {
    const restaurante = await Restaurante.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!restaurante) {
      return res.status(404).json({ success: false, message: "Restaurante não encontrado" })
    }

    res.json({ success: true, data: restaurante })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE delta por id para deletar restaurante
router.delete("/:id", async (req, res) => {
  try {
    const restaurante = await Restaurante.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true })

    if (!restaurante) {
      return res.status(404).json({ success: false, message: "Restaurante não encontrado" })
    }

    res.json({ success: true, message: "Restaurante desativado com sucesso" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
