const mongoose = require("mongoose")

const reservaSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: [true, "Cliente é obrigatório"],
    },
    restaurante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: [true, "Restaurante é obrigatório"],
    },
    dataReserva: {
      type: Date,
      required: [true, "Data da reserva é obrigatória"],
      validate: {
        validator: (v) => v >= new Date(),
        message: "Data da reserva deve ser futura",
      },
    },
    horaReserva: {
      type: String,
      required: [true, "Hora da reserva é obrigatória"],
      validate: {
        validator: (v) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
        message: "Formato de hora inválido (HH:MM)",
      },
    },
    numeroPessoas: {
      type: Number,
      required: [true, "Número de pessoas é obrigatório"],
      min: [1, "Deve ter pelo menos 1 pessoa"],
      max: [20, "Máximo 20 pessoas por reserva"],
    },
    status: {
      type: String,
      enum: ["pendente", "confirmada", "cancelada", "finalizada"],
      default: "pendente",
    },
    observacoes: {
      type: String,
      maxlength: [500, "Observações não podem ter mais de 500 caracteres"],
    },
    precoEstimado: {
      type: Number,
      min: [0, "Preço estimado não pode ser negativo"],
    },
  },
  {
    timestamps: true,
  },
)

// para evitar reservas duplicadas
reservaSchema.index({ restaurante: 1, dataReserva: 1, horaReserva: 1 })

module.exports = mongoose.model("Reserva", reservaSchema)
