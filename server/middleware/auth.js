const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Token de acesso requerido" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    const user = await User.findById(decoded.userId)

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Token inválido" })
    }

    req.user = decoded
    next()
  } catch (error) {
    console.error("Erro na autenticação:", error)
    res.status(401).json({ message: "Token inválido" })
  }
}

module.exports = auth
