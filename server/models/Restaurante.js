const mongoose = require("mongoose")

const restauranteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
      maxlength: [100, "Nome não pode ter mais de 100 caracteres"],
    },
    endereco: {
      rua: { type: String, required: true },
      numero: { type: String, required: true },
      bairro: { type: String, required: true },
      cidade: { type: String, required: true },
      cep: { type: String, required: true },
      estado: { type: String, required: true },
    },
    telefone: {
      type: String,
      required: [true, "Telefone é obrigatório"],
      validate: {
        validator: (v) => /\d{10,11}/.test(v.replace(/\D/g, "")),
        message: "Telefone deve ter 10 ou 11 dígitos",
      },
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      lowercase: true,
      validate: {
        validator: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: "Email inválido",
      },
    },
    capacidade: {
      type: Number,
      required: [true, "Capacidade é obrigatória"],
      min: [1, "Capacidade deve ser pelo menos 1"],
    },
    tipoComida: {
      type: [String],
      required: true,
      enum: [
        "italiana",
        "brasileira",
        "japonesa",
        "mexicana",
        "francesa",
        "chinesa",
        "indiana",
        "vegetariana",
        "vegana",
        "outras",
      ],
    },
    horarioFuncionamento: {
      abertura: { type: String, required: true },
      fechamento: { type: String, required: true },
    },
    precoMedio: {
      type: Number,
      min: [0, "Preço médio não pode ser negativo"],
    },
    avaliacao: {
      type: Number,
      min: [0, "Avaliação mínima é 0"],
      max: [5, "Avaliação máxima é 5"],
      default: 0,
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

module.exports = mongoose.model("Restaurante", restauranteSchema)
