const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Registra
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // faz a checagem se o email já está em uso
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email já está em uso" })
    }

    // cria o usuário
    const user = new User({ name, email, password })
    await user.save()

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erro no registro:", error)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: messages.join(", ") })
    }
    res.status(500).json({ message: "Erro interno do servidor" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // encontra o usuário
    const user = await User.findOne({ email, isActive: true })
    if (!user) {
      return res.status(401).json({ message: "Email ou senha inválidos" })
    }

    // faz a verificação da senha
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou senha inválidos" })
    }

    // atualiza o último login
    user.lastLogin = new Date()
    await user.save()

    // Gera JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erro no login:", error)
    res.status(500).json({ message: "Erro interno do servidor" })
  }
})

// pega os dados do usuário logado
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    res.status(500).json({ message: "Erro interno do servidor" })
  }
})

// Logout (client-side token removal)
router.post("/logout", auth, (req, res) => {
  res.json({ message: "Logout realizado com sucesso" })
})

module.exports = router
