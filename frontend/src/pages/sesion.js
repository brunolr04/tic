import { api }            from '../api.js'
import { auth }           from '../auth.js'
import { navHTML, formatFecha } from '../utils.js'

export function renderSesion(app) {
  document.body.classList.remove('auth-bg')
  auth.requiere()

  app.innerHTML = `
  <div class="page">
    <div class="detail-header">
      <div class="back-btn" onclick="window.router.go('historial')">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        Historial
      </div>
      <p class="header-name" style="margin-top:4px" id="detail-title">Medición</p>
      <p style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px" id="detail-sub">—</p>
    </div>

    <div class="content">
      <div style="margin-bottom:12px" class="fade-up">
        <span class="badge" id="detail-badge">—</span>
      </div>

      <div class="card card-padded fade-up fade-up-1" style="margin-bottom:10px">
        <p class="card-title" style="margin-bottom:10px">Patrón de temblor</p>
        <canvas class="session-chart" id="session-canvas"></canvas>
        <div style="display:flex;justify-content:space-between;margin-top:6px">
          <span style="font-size:9px;color:var(--text-2)">Inicio</span>
          <span style="font-size:9px;color:var(--red)">↑ Pico</span>
          <span style="font-size:9px;color:var(--text-2)">Fin</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px" class="fade-up fade-up-2">
        <div class="metric-card" style="text-align:center">
          <p class="metric-label" style="text-align:center">Frecuencia</p>
          <p class="metric-value" style="font-size:22px" id="d-hz">—</p>
          <p class="metric-unit" style="text-align:center">Hz</p>
        </div>
        <div class="metric-card" style="text-align:center">
          <p class="metric-label" style="text-align:center">Intensidad</p>
          <p class="metric-value teal" style="font-size:22px" id="d-int">—</p>
          <p class="metric-unit" style="text-align:center">nivel</p>
        </div>
        <div class="metric-card" style="text-align:center">
          <p class="metric-label" style="text-align:center">Duración</p>
          <p class="metric-value" style="font-size:22px" id="d-dur">—</p>
          <p class="metric-unit" style="text-align:center">seg</p>
        </div>
      </div>

      <div class="card card-padded fade-up fade-up-2" style="margin-bottom:10px">
        <p class="card-title" style="margin-bottom:10px">Nivel de intensidad</p>
        <div class="intensity-bar">
          <div class="intensity-marker" id="int-marker" style="left:50%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:8px">
          <span style="font-size:9px;color:var(--text-2)">Bajo (1)</span>
          <span style="font-size:9px;color:var(--text-2)">Medio (5)</span>
          <span style="font-size:9px;color:var(--text-2)">Alto (10)</span>
        </div>
      </div>

      <div class="card card-padded fade-up fade-up-3" style="margin-bottom:10px">
        <p class="card-title" style="margin-bottom:2px">Detalles</p>
        <div class="stat-row">
          <span class="stat-row-label">
            <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>Frecuencia Hz
          </span>
          <span class="stat-row-val" id="dr-hz">—</span>
        </div>
        <div class="stat-row">
          <span class="stat-row-label">
            <svg viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>Intensidad
          </span>
          <span class="stat-row-val" id="dr-int">—</span>
        </div>
        <div class="stat-row">
          <span class="stat-row-label">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>Duración
          </span>
          <span class="stat-row-val" id="dr-dur">—</span>
        </div>
        <div class="stat-row">
          <span class="stat-row-label">
            <svg viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>Vibración activa
          </span>
          <span class="stat-row-val teal" id="dr-vib">—</span>
        </div>
        <div class="stat-row">
          <span class="stat-row-label">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>Fecha y hora
          </span>
          <span class="stat-row-val" style="font-size:11px;font-family:var(--font)" id="dr-fecha">—</span>
        </div>
      </div>

      <div class="notes-card fade-up fade-up-4" style="margin-bottom:10px">
        <p class="notes-title">Análisis automático</p>
        <p class="notes-body" id="notas-auto">Cargando...</p>
      </div>
    </div>

    ${navHTML('historial')}
  </div>`

  function drawChart(hz) {
    const canvas = document.getElementById('session-canvas')
    const ctx    = canvas.getContext('2d')
    canvas.width  = canvas.offsetWidth * devicePixelRatio
    canvas.height = 100 * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    const W = canvas.offsetWidth, H = 100
    const pts = 40, amp = Math.min(hz/10,0.85)*(H*0.4)
    const data = Array.from({length:pts},(_,i)=>{
      const t = i/(pts-1)
      return H/2 - Math.sin(Math.PI*t)*amp*Math.sin(t*Math.PI*hz*0.8)+(Math.random()-0.5)*4
    })
    const g = ctx.createLinearGradient(0,0,0,H)
    g.addColorStop(0,'rgba(100,201,168,0.2)'); g.addColorStop(1,'rgba(100,201,168,0)')
    ctx.beginPath()
    data.forEach((y,i)=>{ const x=(i/(pts-1))*W; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y) })
    ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath()
    ctx.fillStyle=g; ctx.fill()
    ctx.beginPath(); ctx.strokeStyle='#64C9A8'; ctx.lineWidth=1.8; ctx.lineJoin='round'
    data.forEach((y,i)=>{ const x=(i/(pts-1))*W; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y) }); ctx.stroke()
    const minY=Math.min(...data), peakX=(data.indexOf(minY)/(pts-1))*W
    ctx.beginPath(); ctx.strokeStyle='rgba(226,75,74,0.6)'; ctx.lineWidth=0.8; ctx.setLineDash([2,2])
    ctx.moveTo(peakX,0); ctx.lineTo(peakX,H); ctx.stroke(); ctx.setLineDash([])
  }

  function notas(t) {
    const hz=parseFloat(t.frecuencia_hz)
    let n = hz<3 ? 'Frecuencia de temblor baja. El sistema operó dentro de rangos normales.'
          : hz<=6 ? `Temblor en rango típico Parkinson (4–6 Hz). ${t.vibracion_activada?'Vibración activada correctamente.':'Sistema de vibración no fue necesario.'}`
          : `Frecuencia elevada (${hz.toFixed(1)} Hz). Se recomienda revisar medicación con el médico.`
    if (t.duracion_segundos>60) n += ` Episodio prolongado de ${t.duracion_segundos}s; considera ajustar la sensibilidad.`
    return n
  }

  async function cargar() {
    const id = sessionStorage.getItem('medicion_id')
    try {
      const todas = await api.obtenerTemblores()
      const t = todas.find(x=>String(x.id_medicion)===String(id))
      if (!t) { document.getElementById('detail-title').textContent='Sin datos'; return }
      const hz=parseFloat(t.frecuencia_hz), int=t.intensidad??5
      document.getElementById('detail-title').textContent=`Medición #${t.id_medicion}`
      document.getElementById('detail-sub').textContent=formatFecha(t.fecha_hora)
      const badge=document.getElementById('detail-badge')
      if (hz<3) { badge.className='badge badge-good'; badge.textContent='Frecuencia baja' }
      else if (hz<=6) { badge.className='badge badge-mid';  badge.textContent='Rango Parkinson' }
      else { badge.className='badge badge-bad';  badge.textContent='Frecuencia alta' }
      document.getElementById('d-hz').textContent  = hz.toFixed(1)
      document.getElementById('d-int').textContent = int
      document.getElementById('d-dur').textContent = t.duracion_segundos??'—'
      document.getElementById('dr-hz').textContent   = hz.toFixed(1)+' Hz'
      document.getElementById('dr-int').textContent  = int
      document.getElementById('dr-dur').textContent  = (t.duracion_segundos??'—')+' s'
      document.getElementById('dr-vib').textContent  = t.vibracion_activada?'Sí':'No'
      if (!t.vibracion_activada) document.getElementById('dr-vib').className='stat-row-val'
      document.getElementById('dr-fecha').textContent = formatFecha(t.fecha_hora)
      document.getElementById('int-marker').style.left = ((parseInt(int)-1)/9*100)+'%'
      document.getElementById('notas-auto').textContent = notas(t)
      drawChart(hz)
    } catch { document.getElementById('notas-auto').textContent = 'Error al cargar la medición.' }
  }

  cargar()
}
