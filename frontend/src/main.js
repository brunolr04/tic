import './style.css'
import { router } from './router.js'
import { auth }   from './auth.js'

// Limpiar timers del dashboard al cambiar de ruta
window.addEventListener('hashchange', () => {
  if (typeof window._cleanupDashboard === 'function') {
    window._cleanupDashboard()
    window._cleanupDashboard = null
  }
})

// Hacer auth global (lo usan los onclick del HTML generado)
window.auth = auth

router.init()
