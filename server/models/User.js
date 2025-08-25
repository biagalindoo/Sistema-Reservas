const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
      minlength: [2, "Nome deve ter pelo menos 2 caracteres"],
      maxlength: [100, "Nome deve ter no máximo 100 caracteres"],
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"],
    },
    phone: {
      type: String,
      required: [true, "Telefone é obrigatório"],
      trim: true,
      match: [/^$$\d{2}$$\s\d{4,5}-\d{4}$/, "Telefone deve estar no formato (XX) XXXXX-XXXX"],
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
      minlength: [6, "Senha deve ter pelo menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// senha hash antes de salvar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compara senha
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Remove senha do objeto retornado
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

module.exports = mongoose.model("User", userSchema)
