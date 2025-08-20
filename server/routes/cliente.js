const express = require("express")
const router = express.Router()
const Cliente = require("../models/Cliente")

// GET para listar todos os clientes
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, nome, email } = req.query
    const query = { ativo: true }

    if (nome) query.nome = new RegExp(nome, "i")
    if (email) query.email = new RegExp(email, "i")

    const clientes = await Cliente.find(query)
      .sort({ nome: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Cliente.countDocuments(query)

    res.json({
      success: true,
      data: clientes,
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

// GET :id para buscar cliente por ID
router.get("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id)
    if (!cliente) {
      return res.status(404).json({ success: false, message: "Cliente não encontrado" })
    }
    res.json({ success: true, data: cliente })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST para criar novo cliente
router.post("/", async (req, res) => {
  try {
    const cliente = new Cliente(req.body)
    await cliente.save()
    res.status(201).json({ success: true, data: cliente })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// PUT :id para atualizar cliente
router.put("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!cliente) {
      return res.status(404).json({ success: false, message: "Cliente não encontrado" })
    }

    res.json({ success: true, data: cliente })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE:id para deletar cliente
router.delete("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, { ativo: false }, { new: true })

    if (!cliente) {
      return res.status(404).json({ success: false, message: "Cliente não encontrado" })
    }

    res.json({ success: true, message: "Cliente desativado com sucesso" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
