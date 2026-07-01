import { api } from '../api.js'
import { auth } from '../auth.js'
import { showToast, navHTML, iconSVG } from '../utils.js'

export function renderDashboard(app) {
  document.body.classList.remove('auth-bg')
  const usuario = auth.requiere()
  if (!usuario) return

  app.innerHTML = `
  <div class="page">
    <div class="header">
      <div class="header-top">
        <div>
          <p class="header-greeting">Bienvenido</p>
          <p class="header-name">${usuario.nombre}</p>
        </div>
        <div class="avatar" onclick="window.router.go('ajustes')">${auth.iniciales(usuario.nombre)}</div>
      </div>
      <div class="glove-status">
        <div class="status-dot pulse" id="status-dot"></div>
        <span class="status-label" id="status-label">Conectando...</span>
        <svg style="width:14px;height:14px;stroke:var(--teal);fill:none;stroke-width:1.8;margin-left:auto" viewBox="0 0 24 24">
          <path d="M8.56 2.9A7 7 0 0 1 19 9v4"/><path d="M17 17H3s3-2 3-9a4 4 0 0 1 .76-2.34"/>
          <path d="M10.12 21.88a2 2 0 0 0 3.76 0"/>
        </svg>
      </div>
    </div>

    <div class="content">
      <div class="metrics-grid fade-up fade-up-1">
        <div class="metric-card">
          <p class="metric-label">Frecuencia</p>
          <p class="metric-value" id="val-frecuencia">—</p>
          <p class="metric-unit">Hz</p>
        </div>
        <div class="metric-card">
          <p class="metric-label">Intensidad</p>
          <p class="metric-value teal" id="val-intensidad">—</p>
          <p class="metric-unit">nivel</p>
        </div>
      </div>

      <div class="card card-padded fade-up fade-up-2" style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <p class="card-title">Temblor en tiempo real</p>
          <span class="freq-badge"><span class="freq-dot"></span><span id="freq-val">0.0 Hz</span></span>
        </div>
        <div class="rt-chart-wrap"><canvas id="rt-canvas"></canvas></div>
        <div class="chart-legend">
          <div class="legend-item"><div class="legend-dot" style="background:var(--teal)"></div>Señal detectada</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--navy);opacity:.3"></div>Línea base</div>
        </div>
      </div>

      <p class="section-title fade-up fade-up-3">Última medición</p>
      <div class="last-reading card fade-up fade-up-3">
        <div>
          <p class="reading-label">Frecuencia pico</p>
          <p class="reading-val" id="last-hz">—</p>
          <p class="reading-unit">Hz</p>
        </div>
        <div style="text-align:right">
          <p class="reading-label">Duración</p>
          <p style="font-size:20px;font-weight:300;color:#fff;font-family:var(--mono)" id="last-dur">—</p>
          <p class="reading-unit">segundos</p>
        </div>
        <div style="text-align:right">
          <p class="reading-label">Vibración</p>
          <p style="font-size:12px;font-weight:500;margin-top:4px" id="last-vib">—</p>
        </div>
      </div>

      <p class="section-title fade-up fade-up-4">Configuración del guante</p>
      <div class="card card-padded fade-up fade-up-4" style="margin-bottom:10px">
        <div style="margin-bottom:16px">
          <div class="config-row">
            <span style="font-size:12px;color:var(--text-1);font-weight:500">Intensidad vibración</span>
            <span class="config-val" id="lbl-intensidad">—</span>
          </div>
          <input type="range" id="slider-intensidad" min="1" max="10" step="1" value="5"
            oninput="document.getElementById('lbl-intensidad').textContent=this.value">
        </div>
        <div style="margin-bottom:16px">
          <div class="config-row">
            <span style="font-size:12px;color:var(--text-1);font-weight:500">Sensibilidad sensor</span>
            <span class="config-val" id="lbl-sensibilidad">—</span>
          </div>
          <input type="range" id="slider-sensibilidad" min="1" max="10" step="1" value="5"
            oninput="document.getElementById('lbl-sensibilidad').textContent=this.value">
        </div>
        <button class="btn btn-primary" id="btn-guardar" onclick="guardarConfig()">
          ${iconSVG('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>', 'color:var(--navy)')}
          Guardar configuración
        </button>
      </div>
    </div>

    ${navHTML('dashboard')}
  </div>`

  // ── Gráfica ───────────────────────────────────────────────
  const canvas = document.getElementById('rt-canvas')
  const ctx = canvas.getContext('2d')
  const POINTS = 60
  const data = Array(POINTS).fill(0.5)
  let ultimaHz = 0
  let lastId = null

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth * devicePixelRatio
    canvas.height = 72 * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
  }
  setTimeout(resizeCanvas, 0)
  window.addEventListener('resize', resizeCanvas)

  function drawChart() {
    const W = canvas.offsetWidth, H = 72
    ctx.clearRect(0, 0, W, H)
    const step = W / (POINTS - 1)
    ctx.beginPath(); ctx.setLineDash([3, 3])
    ctx.strokeStyle = 'rgba(11,26,46,0.2)'; ctx.lineWidth = 1
    ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke(); ctx.setLineDash([])
    ctx.beginPath()
    data.forEach((v, i) => {
      const x = i * step, y = H / 2 - (v - 0.5) * (H * 0.8)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.lineTo((POINTS - 1) * step, H); ctx.lineTo(0, H); ctx.closePath()
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, 'rgba(100,201,168,0.25)'); g.addColorStop(1, 'rgba(100,201,168,0)')
    ctx.fillStyle = g; ctx.fill()
    ctx.beginPath(); ctx.strokeStyle = '#64C9A8'; ctx.lineWidth = 1.8; ctx.lineJoin = 'round'
    data.forEach((v, i) => {
      const x = i * step, y = H / 2 - (v - 0.5) * (H * 0.8)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }); ctx.stroke()
  }

  function pushPoint(hz) {
    const base = Math.min(hz / 12, 0.9)
    const noise = (Math.random() - 0.5) * 0.15
    data.shift(); data.push(Math.max(0.05, Math.min(0.95, 0.5 + (base - 0.3) + noise)))
    drawChart()
  }

  // idle animation
  let idleTimer = setInterval(() => {
    const v = 0.5 + Math.sin(Date.now() / 600) * 0.08 + (Math.random() - 0.5) * 0.05
    data.shift(); data.push(v); drawChart()
  }, 100)

  // polling timer — una sola llamada cada 5s
  const pollTimer = setInterval(() => {
    actualizarDashboard()
  }, 5000)

  const animTimer = setInterval(() => {
    if (!idleTimer) pushPoint(ultimaHz)
  }, 150)

  // cleanup al abandonar la página
  window._cleanupDashboard = () => {
    clearInterval(pollTimer); clearInterval(animTimer); clearInterval(idleTimer)
    window.removeEventListener('resize', resizeCanvas)
  }

  // ── Cargar config ─────────────────────────────────────────
  async function cargarConfig() {
    try {
      const c = await api.obtenerConfiguracion()
      const si = c.intensidad_vibracion ?? 5
      const ss = c.sensibilidad_sensor ?? 5
      document.getElementById('slider-intensidad').value = si
      document.getElementById('slider-sensibilidad').value = ss
      document.getElementById('lbl-intensidad').textContent = si
      document.getElementById('lbl-sensibilidad').textContent = ss
    } catch { document.getElementById('lbl-intensidad').textContent = '5'; document.getElementById('lbl-sensibilidad').textContent = '5' }
  }

  window.guardarConfig = async () => {
    const btn = document.getElementById('btn-guardar')
    btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>'
    try {
      await api.actualizarConfiguracion({
        intensidad_vibracion: parseInt(document.getElementById('slider-intensidad').value),
        sensibilidad_sensor: parseInt(document.getElementById('slider-sensibilidad').value)
      })
      showToast('✓ Configuración guardada')
    } catch { showToast('Error al guardar') }
    finally {
      btn.disabled = false
      btn.innerHTML = `${iconSVG('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>', 'color:var(--navy)')} Guardar configuración`
    }
  }

  // ── Actualizar dashboard (una sola llamada a la API por tick) ────────────
  async function actualizarDashboard() {
    try {
      const list = await api.obtenerTemblores()

      // ── Estado del guante ──
      const ahora = Date.now()
      const hayReciente = list.length > 0 &&
        (ahora - new Date(list[0].fecha_hora).getTime()) < 30000

      if (hayReciente) {
        document.getElementById('status-dot').className = 'status-dot pulse'
        document.getElementById('status-label').textContent = 'Guante conectado · ESP32-GLOVE-01'
        document.getElementById('status-label').className = 'status-label'
      } else {
        document.getElementById('status-dot').className = 'status-dot offline'
        document.getElementById('status-label').textContent = 'Guante sin señal reciente'
        document.getElementById('status-label').className = 'status-label offline'
      }

      // ── Última medición ──
      if (!list.length) return
      const t = list[0]
      const hz = parseFloat(t.frecuencia_hz)

      document.getElementById('last-hz').textContent = hz.toFixed(1)
      document.getElementById('last-dur').textContent = t.duracion_segundos ?? '—'
      const vibEl = document.getElementById('last-vib')
      vibEl.textContent = t.vibracion_activada ? 'Activa' : 'Inactiva'
      vibEl.style.color = t.vibracion_activada ? 'var(--teal)' : 'rgba(255,255,255,0.4)'
      document.getElementById('val-frecuencia').textContent = hz.toFixed(1)
      document.getElementById('val-intensidad').textContent = t.intensidad ?? '—'
      document.getElementById('freq-val').textContent = hz.toFixed(1) + ' Hz'

      // Solo anima si llegó un registro nuevo
      if (t.id_medicion !== lastId) {
        lastId = t.id_medicion
        ultimaHz = hz
        if (idleTimer) { clearInterval(idleTimer); idleTimer = null }
        pushPoint(ultimaHz)
      }
    } catch {
      document.getElementById('status-dot').className = 'status-dot offline'
      document.getElementById('status-label').textContent = 'Sin conexión al servidor'
      document.getElementById('status-label').className = 'status-label offline'
    }
  }

  cargarConfig(); actualizarDashboard(); setTimeout(drawChart, 0)
}
