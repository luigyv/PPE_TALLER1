import { defineStore } from 'pinia'
import { iniciarSesion, registrar } from '../services/authService'

function obtenerDatosToken(token) {
  if (!token) return null

  try {
    const partePayload = token.split('.')[1]
    const payload = JSON.parse(atob(partePayload))

    return payload
  } catch (e) {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('access_token') || null
    const datosToken = obtenerDatosToken(token)

    return {
      token,
      nombre: datosToken?.nombre || null,
      email: datosToken?.email || null,
      userId: datosToken?.sub || null,
    }
  },

  getters: {
    estaAutenticado: (state) => !!state.token,
  },

  actions: {
    async login(credenciales) {
      const data = await iniciarSesion(credenciales)

      this.token = data.access_token

      const datosToken = obtenerDatosToken(data.access_token)

      this.nombre = datosToken?.nombre || null
      this.email = datosToken?.email || null
      this.userId = datosToken?.sub || null

      localStorage.setItem('access_token', data.access_token)
    },

    async register(credenciales) {
      return registrar(credenciales)
    },

    logout() {
      this.token = null
      this.nombre = null
      this.email = null
      this.userId = null

      localStorage.removeItem('access_token')
    },
  },
})