import { renderLogin }     from './pages/login.js'
import { renderDashboard } from './pages/dashboard.js'
import { renderHistorial } from './pages/historial.js'
import { renderSesion }    from './pages/sesion.js'
import { renderAjustes }   from './pages/ajustes.js'

const routes = {
  login:     renderLogin,
  dashboard: renderDashboard,
  historial: renderHistorial,
  sesion:    renderSesion,
  ajustes:   renderAjustes,
}

export const router = {
  go: (page, params = {}) => {
    const hash = params.id ? `#${page}?id=${params.id}` : `#${page}`
    window.location.hash = hash
  },

  params: () => {
    const hash  = window.location.hash.slice(1)
    const [page, qs] = hash.split('?')
    const params = {}
    if (qs) qs.split('&').forEach(p => { const [k,v] = p.split('='); params[k] = v })
    return params
  },

  init: () => {
    const render = () => {
      const hash = window.location.hash.slice(1).split('?')[0] || 'login'
      const fn   = routes[hash] || routes.login
      const app  = document.getElementById('app')
      app.innerHTML = ''
      fn(app)
    }
    window.addEventListener('hashchange', render)
    render()
  }
}

// hacer router global para que auth.js pueda usarlo
window.router = router
