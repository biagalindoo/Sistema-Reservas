const mongoose = require("mongoose")
const Restaurante = require("../models/Restaurante")
const Cliente = require("../models/Cliente")
const Reserva = require("../models/Reserva")
require("dotenv").config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/restaurante")
    console.log("✅ Conectado ao MongoDB")

    // Limpar dados existentes
    await Restaurante.deleteMany({})
    await Cliente.deleteMany({})
    await Reserva.deleteMany({})
    console.log("🧹 Dados antigos removidos")

    // Criar restaurantes
    const restaurantes = await Restaurante.insertMany([
      {
        nome: "Bella Vista",
        endereco: {
          rua: "Rua das Flores",
          numero: "123",
          bairro: "Centro",
          cidade: "São Paulo",
          cep: "01234-567",
          estado: "SP",
        },
        telefone: "11987654321",
        email: "contato@bellavista.com",
        capacidade: 50,
        tipoComida: ["italiana"],
        horarioFuncionamento: { abertura: "11:00", fechamento: "23:00" },
        precoMedio: 85.0,
        avaliacao: 4.5,
      },
      {
        nome: "Ocean Breeze",
        endereco: {
          rua: "Av. Atlântica",
          numero: "456",
          bairro: "Copacabana",
          cidade: "Rio de Janeiro",
          cep: "22070-001",
          estado: "RJ",
        },
        telefone: "21987654321",
        email: "reservas@oceanbreeze.com",
        capacidade: 80,
        tipoComida: ["brasileira", "outras"],
        horarioFuncionamento: { abertura: "12:00", fechamento: "00:00" },
        precoMedio: 120.0,
        avaliacao: 4.8,
      },
      {
        nome: "Mountain Top",
        endereco: {
          rua: "Rua da Serra",
          numero: "789",
          bairro: "Savassi",
          cidade: "Belo Horizonte",
          cep: "30112-000",
          estado: "MG",
        },
        telefone: "31987654321",
        email: "info@mountaintop.com",
        capacidade: 40,
        tipoComida: ["francesa"],
        horarioFuncionamento: { abertura: "18:00", fechamento: "23:30" },
        precoMedio: 150.0,
        avaliacao: 4.7,
      },
      {
        nome: "City Lights",
        endereco: {
          rua: "Rua Augusta",
          numero: "321",
          bairro: "Consolação",
          cidade: "São Paulo",
          cep: "01305-100",
          estado: "SP",
        },
        telefone: "11876543210",
        email: "contato@citylights.com",
        capacidade: 60,
        tipoComida: ["japonesa"],
        horarioFuncionamento: { abertura: "17:00", fechamento: "01:00" },
        precoMedio: 95.0,
        avaliacao: 4.3,
      },
    ])
    console.log("🍽️ Restaurantes criados")

    // Criar clientes
    const clientes = await Cliente.insertMany([
      {
        nome: "João Silva",
        telefone: "11999888777",
        email: "joao.silva@email.com",
        endereco: {
          rua: "Rua A",
          numero: "100",
          bairro: "Vila Madalena",
          cidade: "São Paulo",
          cep: "05433-000",
          estado: "SP",
        },
        dataNascimento: new Date("1985-03-15"),
        preferencias: { tipoComida: ["italiana", "brasileira"] },
      },
      {
        nome: "Maria Santos",
        telefone: "21888777666",
        email: "maria.santos@email.com",
        endereco: {
          rua: "Rua B",
          numero: "200",
          bairro: "Ipanema",
          cidade: "Rio de Janeiro",
          cep: "22411-040",
          estado: "RJ",
        },
        dataNascimento: new Date("1990-07-22"),
        preferencias: { tipoComida: ["japonesa", "francesa"] },
      },
      {
        nome: "Pedro Costa",
        telefone: "31777666555",
        email: "pedro.costa@email.com",
        endereco: {
          rua: "Rua C",
          numero: "300",
          bairro: "Funcionários",
          cidade: "Belo Horizonte",
          cep: "30130-010",
          estado: "MG",
        },
        dataNascimento: new Date("1988-11-08"),
        preferencias: { tipoComida: ["francesa", "italiana"] },
      },
    ])
    console.log("👥 Clientes criados")

    // Criar reservas
    const hoje = new Date()
    const amanha = new Date(hoje)
    amanha.setDate(hoje.getDate() + 1)
    const depoisDeAmanha = new Date(hoje)
    depoisDeAmanha.setDate(hoje.getDate() + 2)

    await Reserva.insertMany([
      {
        cliente: clientes[0]._id,
        restaurante: restaurantes[0]._id,
        dataReserva: amanha,
        horaReserva: "19:00",
        numeroPessoas: 2,
        status: "confirmada",
        observacoes: "Mesa próxima à janela",
        precoEstimado: 170.0,
      },
      {
        cliente: clientes[1]._id,
        restaurante: restaurantes[1]._id,
        dataReserva: amanha,
        horaReserva: "20:00",
        numeroPessoas: 4,
        status: "pendente",
        observacoes: "Aniversário",
        precoEstimado: 480.0,
      },
      {
        cliente: clientes[2]._id,
        restaurante: restaurantes[2]._id,
        dataReserva: depoisDeAmanha,
        horaReserva: "18:30",
        numeroPessoas: 2,
        status: "confirmada",
        precoEstimado: 300.0,
      },
    ])
    console.log("📅 Reservas criadas")

    console.log("🎉 Seed concluído com sucesso!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Erro no seed:", error)
    process.exit(1)
  }
}

seedData()
