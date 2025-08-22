const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/restaurante")
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err))

// Rotas da API
app.use("/api/restaurantes", require("./routes/restaurante"))
app.use("/api/reservas", require("./routes/reserva"))
app.use("/api/clientes", require("./routes/cliente"))

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: "Erro interno do servidor" })
})

// Rota 404
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Rota não encontrada" })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`🔗 API disponível em: http://localhost:${PORT}/api`)

})

module.exports = app
