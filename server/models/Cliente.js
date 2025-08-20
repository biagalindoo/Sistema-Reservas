const mongoose = require("mongoose")

const clienteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
      maxlength: [100, "Nome não pode ter mais de 100 caracteres"],
    },
    telefone: {
      type: String,
      required: [true, "Telefone é obrigatório"],
      unique: true,
      validate: {
        validator: (v) => /\d{10,11}/.test(v.replace(/\D/g, "")),
        message: "Telefone deve ter 10 ou 11 dígitos",
      },
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: "Email inválido",
      },
    },
    endereco: {
      rua: String,
      numero: String,
      bairro: String,
      cidade: String,
      cep: String,
      estado: String,
    },
    dataNascimento: Date,
    preferencias: {
      tipoComida: [String],
      restricoes: String,
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Cliente", clienteSchema)
