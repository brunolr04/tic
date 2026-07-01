import { api }                          from '../api.js'
import { auth }                         from '../auth.js'
import { navHTML, formatFecha, clasificar } from '../utils.js'

export function renderHistorial(app) {
  document.body.classList.remove('auth-bg')
  const usuario = auth.requiere()
  if (!usuario) return

  app.innerHTML = `
  <div class="page">
    <div class="header">
      <div class="header-top">
        <div>
          <p class="header-greeting">Registro de mediciones</p>
          <p class="header-name">Historial</p>
        </div>
        <div class="avatar" onclick="window.router.go('ajustes')">${auth.iniciales(usuario.nombre)}</div>
      </div>
      <div class="filter-row" id="filtros">
        <div class="filter-chip active" onclick="filtrar('todos',this)">Todos</div>
        <div class="filter-chip" onclick="filtrar('bueno',this)">Buenas</div>
        <div class="filter-chip" onclick="filtrar('regular',this)">Regulares</div>
        <div class="filter-chip" onclick="filtrar('alto',this)">Alta frecuencia</div>
      </div>
    </div>

    <div class="content">
      <div class="week-summary" id="week-summary">
        <div class="week-stat skeleton" style="height:70px"></div>
        <div class="week-stat skeleton" style="height:70px"></div>
        <div class="week-stat skeleton" style="height:70px"></div>
      </div>
      <div id="lista-mediciones">
        <div class="card skeleton" style="height:80px;margin-bottom:10px"></div>
        <div class="card skeleton" style="height:80px;margin-bottom:10px"></div>
        <div class="card skeleton" style="height:80px"></div>
      </div>
    </div>

    ${navHTML('historial')}
  </div>`

  let todas = []
  let filtroActivo = 'todos'

  function fechaCorta(str) {
    if (!str) return '—'
    const d = new Date(str), hoy = new Date(), ayer = new Date(hoy)
    ayer.setDate(hoy.getDate()-1)
    if (d.toDateString()===hoy.toDateString())  return 'Hoy'
    if (d.toDateString()===ayer.toDateString()) return 'Ayer'
    return d.toLocaleDateString('es-CL',{day:'numeric',month:'long'})
  }

  function renderResumen(datos) {
    if (!datos.length) {
      document.getElementById('week-summary').innerHTML =
        '<div style="grid-column:1/-1;text-align:center;font-size:12px;color:var(--text-2);padding:8px 0">Sin datos</div>'
      return
    }
    const hzs   = datos.map(t=>parseFloat(t.frecuencia_hz)).filter(Boolean)
    const prom  = (hzs.reduce((a,b)=>a+b,0)/hzs.length).toFixed(1)
    const conV  = datos.filter(t=>t.vibracion_activada).length
    const pct   = Math.round(conV/datos.length*100)
    document.getElementById('week-summary').innerHTML = `
      <div class="week-stat"><p class="week-stat-val">${datos.length}</p><p class="week-stat-label">Mediciones</p></div>
      <div class="week-stat"><p class="week-stat-val">${prom}</p><p class="week-stat-label">Hz promedio</p></div>
      <div class="week-stat"><p class="week-stat-val teal">${pct}%</p><p class="week-stat-label">Mitigación</p></div>`
  }

  function renderLista(datos) {
    const el = document.getElementById('lista-mediciones')
    if (!datos.length) {
      el.innerHTML = `<div class="empty">
        <svg class="empty-icon" viewBox="0 0 24 24"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>
        <p class="empty-title">Sin mediciones</p>
        <p class="empty-desc">No hay datos con el filtro seleccionado.</p></div>`
      return
    }
    const grupos = {}
    datos.forEach(t => {
      const k = fechaCorta(t.fecha_hora)
      if (!grupos[k]) grupos[k] = []
      grupos[k].push(t)
    })
    let html = ''
    for (const [fecha, items] of Object.entries(grupos)) {
      html += `<p class="date-header">${fecha}</p><div class="card" style="margin-bottom:10px">`
      items.forEach((t, i) => {
        const c = clasificar(t)
        const border = i < items.length-1 ? 'border-bottom:0.5px solid var(--border)' : ''
        html += `
        <div class="session-item" onclick="verDetalle(${t.id_medicion})" style="${border}">
          <div class="session-row">
            <div>
              <p class="card-title">Medición #${t.id_medicion}</p>
              <p class="card-subtitle">${formatFecha(t.fecha_hora)}</p>
            </div>
            <span class="badge ${c.cls}">${c.label}</span>
          </div>
          <div class="session-stats">
            <div><p class="session-stat-label">Frecuencia</p><p class="session-stat-val">${parseFloat(t.frecuencia_hz).toFixed(1)} Hz</p></div>
            <div><p class="session-stat-label">Intensidad</p><p class="session-stat-val">${t.intensidad??'—'}</p></div>
            <div><p class="session-stat-label">Vibración</p><p class="session-stat-val ${t.vibracion_activada?'teal':''}">${t.vibracion_activada?'Sí':'No'}</p></div>
            <div><p class="session-stat-label">Duración</p><p class="session-stat-val">${t.duracion_segundos??'—'}s</p></div>
          </div>
        </div>`
      })
      html += '</div>'
    }
    el.innerHTML = html
  }

  window.filtrar = (tipo, el) => {
    filtroActivo = tipo
    document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'))
    el.classList.add('active')
    renderLista(filtroActivo==='todos' ? todas : todas.filter(t=>clasificar(t).filtro===filtroActivo))
  }

  window.verDetalle = (id) => {
    sessionStorage.setItem('medicion_id', id)
    window.router.go('sesion')
  }

  async function cargar() {
    try {
      todas = await api.obtenerTemblores()
      renderResumen(todas)
      renderLista(todas)
    } catch {
      document.getElementById('lista-mediciones').innerHTML = `
        <div class="empty">
          <svg class="empty-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p class="empty-title">Error de conexión</p>
          <p class="empty-desc">No se pudo conectar con el servidor. Intenta de nuevo.</p>
        </div>`
      document.getElementById('week-summary').innerHTML = ''
    }
  }

  cargar()
}
