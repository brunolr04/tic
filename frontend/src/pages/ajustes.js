import { api }            from '../api.js'
import { auth }           from '../auth.js'
import { showToast, navHTML } from '../utils.js'

export function renderAjustes(app) {
  document.body.classList.remove('auth-bg')
  const usuario = auth.requiere()
  if (!usuario) return

  app.innerHTML = `
  <div class="page">
    <div class="header">
      <div class="header-top">
        <div>
          <p class="header-greeting">Configuración</p>
          <p class="header-name">Ajustes</p>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="profile-card fade-up">
        <div class="profile-avatar">${auth.iniciales(usuario.nombre)}</div>
        <div>
          <p class="profile-name">${usuario.nombre}</p>
          <p class="profile-sub">${usuario.correo}</p>
          <p class="profile-sub" style="color:var(--teal);margin-top:2px">${usuario.diagnostico??''}</p>
        </div>
      </div>

      <p class="section-title fade-up">Guante</p>
      <div class="settings-group fade-up">
        <div class="settings-item" onclick="abrirModal()">
          <div class="settings-icon teal">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0"/></svg>
          </div>
          <span class="settings-label">Parámetros de vibración</span>
          <svg class="settings-chevron" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="settings-item">
          <div class="settings-icon navy">
            <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <span class="settings-label">Umbral de detección</span>
          <span class="settings-value">4–6 Hz</span>
        </div>
        <div class="settings-item">
          <div class="settings-icon amber">
            <svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>
          </div>
          <span class="settings-label">Estado ESP32</span>
          <span class="settings-value" id="val-esp" style="color:var(--teal)">Verificando...</span>
        </div>
      </div>

      <p class="section-title fade-up fade-up-1">Cuenta</p>
      <div class="settings-group fade-up fade-up-1">
        ${[
          ['navy','<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>','Nombre',usuario.nombre],
          ['navy','<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>','Correo',usuario.correo],
          ['navy','<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>','Diagnóstico',usuario.diagnostico??'—'],
          ['navy','<circle cx="12" cy="12" r="4"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>','Edad',usuario.edad?(usuario.edad+' años'):'—'],
        ].map(([cls,icon,label,val])=>`
        <div class="settings-item" style="cursor:default">
          <div class="settings-icon ${cls}"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div style="flex:1">
            <p class="settings-label">${label}</p>
            <p style="font-size:11px;color:var(--text-2);margin-top:1px">${val}</p>
          </div>
        </div>`).join('')}
      </div>

      <p class="section-title fade-up fade-up-2">Sesión</p>
      <div class="settings-group fade-up fade-up-2">
        <div class="settings-item" onclick="auth.cerrar()">
          <div class="settings-icon red">
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <span class="settings-label red">Cerrar sesión</span>
        </div>
      </div>

      <p style="text-align:center;font-size:10px;color:var(--text-3);padding:8px 0 4px">
        TremorGuard · Zenith Glove v1.0<br>Universidad Diego Portales
      </p>
    </div>

    ${navHTML('ajustes')}
  </div>

  <!-- MODAL -->
  <div class="modal-overlay" id="modal" onclick="cerrarModal(event)">
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      <p class="modal-title">Parámetros de vibración</p>
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:13px;color:var(--text-1);font-weight:500">Intensidad</span>
          <span style="font-size:12px;color:var(--teal);font-family:var(--mono)" id="m-lbl-int">5</span>
        </div>
        <input type="range" id="m-slider-int" min="1" max="10" step="1" value="5"
          oninput="document.getElementById('m-lbl-int').textContent=this.value">
      </div>
      <div style="margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:13px;color:var(--text-1);font-weight:500">Sensibilidad del sensor</span>
          <span style="font-size:12px;color:var(--teal);font-family:var(--mono)" id="m-lbl-sens">5</span>
        </div>
        <input type="range" id="m-slider-sens" min="1" max="10" step="1" value="5"
          oninput="document.getElementById('m-lbl-sens').textContent=this.value">
      </div>
      <div style="margin-bottom:16px">
        <div class="toggle-row">
          <div>
            <p class="toggle-label">Vibración automática</p>
            <p class="toggle-sub">Activar al detectar temblor</p>
          </div>
          <input type="checkbox" class="toggle" id="toggle-auto" checked>
        </div>
      </div>
      <button class="btn" id="modal-btn" onclick="guardarModal()"
        style="background:var(--navy);color:#fff">Guardar cambios</button>
    </div>
  </div>`

  // ── handlers globales ─────────────────────────────────────
  window.abrirModal = async () => {
    try {
      const c = await api.obtenerConfiguracion()
      document.getElementById('m-slider-int').value   = c.intensidad_vibracion??5
      document.getElementById('m-slider-sens').value  = c.sensibilidad_sensor??5
      document.getElementById('m-lbl-int').textContent  = c.intensidad_vibracion??5
      document.getElementById('m-lbl-sens').textContent = c.sensibilidad_sensor??5
    } catch { /* usa defaults */ }
    document.getElementById('modal').classList.add('show')
    document.body.style.overflow = 'hidden'
  }

  window.cerrarModal = (e) => {
    if (!e || e.target===document.getElementById('modal')) {
      document.getElementById('modal').classList.remove('show')
      document.body.style.overflow = ''
    }
  }

  window.guardarModal = async () => {
    const btn = document.getElementById('modal-btn')
    btn.disabled=true; btn.innerHTML='<div class="spinner" style="border-top-color:#fff;border-color:rgba(255,255,255,0.2)"></div>'
    try {
      await api.actualizarConfiguracion({
        intensidad_vibracion: parseInt(document.getElementById('m-slider-int').value),
        sensibilidad_sensor:  parseInt(document.getElementById('m-slider-sens').value)
      })
      window.cerrarModal(); showToast('✓ Configuración guardada')
    } catch { showToast('Error al guardar') }
    finally { btn.disabled=false; btn.textContent='Guardar cambios' }
  }

  // Estado ESP32
  api.obtenerTemblores()
    .then(()=>{ document.getElementById('val-esp').textContent='Conectado'; document.getElementById('val-esp').style.color='var(--teal)' })
    .catch(()=>{ document.getElementById('val-esp').textContent='Sin conexión'; document.getElementById('val-esp').style.color='var(--text-2)' })
}
