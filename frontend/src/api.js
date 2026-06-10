const API_URL = 'http://localhost:3000'

export const api = {
  login: async (correo, contrasena) => {
    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    })
    if (!res.ok) throw await res.json()
    return res.json()
  },

  registro: async (datos) => {
    const res = await fetch(`${API_URL}/usuarios/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    if (!res.ok) throw await res.json()
    return res.json()
  },

  obtenerTemblores: async () => {
    const res = await fetch(`${API_URL}/temblores`)
    if (!res.ok) throw await res.json()
    return res.json()
  },

  agregarTemblor: async (datos) => {
    const res = await fetch(`${API_URL}/temblores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    if (!res.ok) throw await res.json()
    return res.json()
  },

  obtenerConfiguracion: async () => {
    const res = await fetch(`${API_URL}/configuracion`)
    if (!res.ok) throw await res.json()
    return res.json()
  },

  actualizarConfiguracion: async (datos) => {
    const res = await fetch(`${API_URL}/configuracion`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    if (!res.ok) throw await res.json()
    return res.json()
  }
}
