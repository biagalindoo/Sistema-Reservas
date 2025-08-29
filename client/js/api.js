const API_BASE_URL = "/api"

// Função auxiliar para fazer requisições
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Erro na requisição")
    }

    return data
  } catch (error) {
    console.error("Erro na API:", error)
    throw error
  }
}

// API de Restaurantes
const restaurantAPI = {
  async getAll() {
    return await apiRequest("/restaurantes")
  },

  async create(restaurantData) {
    return await apiRequest("/restaurantes", {
      method: "POST",
      body: JSON.stringify(restaurantData),
    })
  },

  async update(id, restaurantData) {
    return await apiRequest(`/restaurantes/${id}`, {
      method: "PUT",
      body: JSON.stringify(restaurantData),
    })
  },

  async delete(id) {
    return await apiRequest(`/restaurantes/${id}`, {
      method: "DELETE",
    })
  },
}

// API de Clientes
const clientAPI = {
  async getAll() {
    return await apiRequest("/clientes")
  },

  async create(clientData) {
    return await apiRequest("/clientes", {
      method: "POST",
      body: JSON.stringify(clientData),
    })
  },

  async update(id, clientData) {
    return await apiRequest(`/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(clientData),
    })
  },

  async delete(id) {
    return await apiRequest(`/clientes/${id}`, {
      method: "DELETE",
    })
  },
}

// API de Reservas
const reservationAPI = {
  async getAll() {
    return await apiRequest("/reservas")
  },

  async create(reservationData) {
    return await apiRequest("/reservas", {
      method: "POST",
      body: JSON.stringify(reservationData),
    })
  },

  async update(id, reservationData) {
    return await apiRequest(`/reservas/${id}`, {
      method: "PUT",
      body: JSON.stringify(reservationData),
    })
  },

  async delete(id) {
    return await apiRequest(`/reservas/${id}`, {
      method: "DELETE",
    })
  },
}
