import { api }       from '../api.js'
import { auth }      from '../auth.js'
import { showToast } from '../utils.js'

export function renderLogin(app) {
  // Si ya hay sesión, ir directo al dashboard
  if (auth.obtener()) { window.router.go('dashboard'); return }

  document.body.classList.add('auth-bg')

  app.innerHTML = `
  <div class="auth-page">
    <div class="logo-wrap">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24">
          <path d="M18 11V7a6 6 0 0 0-12 0v4"/>
          <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          <path d="M8 11h8v8a4 4 0 0 1-8 0v-8z"/>
        </svg>
      </div>
      <p class="logo-title">TremorGuard</p>
      <p class="logo-sub">Control de temblores Parkinson</p>
    </div>

    <div class="auth-tabs">
      <div class="auth-tab active" id="tab-login"    onclick="switchTab('login')">Ingresar</div>
      <div class="auth-tab"        id="tab-registro" onclick="switchTab('registro')">Registrarse</div>
    </div>

    <!-- LOGIN -->
    <form class="auth-form active" id="form-login" onsubmit="handleLogin(event)">
      <div id="err-login" class="error-msg"></div>
      <div class="form-group">
        <label class="form-label">Correo electrónico</label>
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <input class="form-input" type="email" id="login-correo" placeholder="usuario@email.com" autocomplete="email" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Contraseña</label>
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <input class="form-input" type="password" id="login-pass" placeholder="••••••••" autocomplete="current-password" required>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" id="btn-login"><span>Ingresar</span></button>
    </form>

    <!-- REGISTRO -->
    <form class="auth-form" id="form-registro" onsubmit="handleRegistro(event)">
      <div id="err-registro" class="error-msg"></div>
      <div class="form-group">
        <label class="form-label">Nombre completo</label>
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <input class="form-input" type="text" id="reg-nombre" placeholder="Carlos Méndez" autocomplete="name" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Correo electrónico</label>
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <input class="form-input" type="email" id="reg-correo" placeholder="usuario@email.com" autocomplete="email" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Contraseña</label>
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <input class="form-input" type="password" id="reg-pass" placeholder="••••••••" autocomplete="new-password" required>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Edad</label>
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <input class="form-input" type="number" id="reg-edad" placeholder="65" min="18" max="120" required>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Diagnóstico</label>
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <select class="form-input" id="reg-diagnostico" required>
              <option value="">Seleccionar</option>
              <option value="Parkinson leve">Leve</option>
              <option value="Parkinson moderado">Moderado</option>
              <option value="Parkinson severo">Severo</option>
              <option value="Temblor esencial">T. esencial</option>
            </select>
          </div>
        </div>
      </div>
      <div style="height:14px"></div>
      <button type="submit" class="btn btn-primary" id="btn-registro"><span>Crear cuenta</span></button>
    </form>

    <p class="footer-txt">Zenith Glove · Universidad Diego Portales</p>
  </div>`

  // ── handlers globales temporales ─────────────────────────
  window.switchTab = (tab) => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'))
    document.getElementById('tab-' + tab).classList.add('active')
    document.getElementById('form-' + tab).classList.add('active')
  }

  window.handleLogin = async (e) => {
    e.preventDefault()
    const errEl = document.getElementById('err-login')
    errEl.classList.remove('show')
    const btn = document.getElementById('btn-login')
    btn.disabled = true
    btn.innerHTML = '<div class="spinner"></div>'
    try {
      const data = await api.login(
        document.getElementById('login-correo').value.trim(),
        document.getElementById('login-pass').value
      )
      auth.guardar(data.usuario)
      document.body.classList.remove('auth-bg')
      window.router.go('dashboard')
    } catch (err) {
      errEl.textContent = err.mensaje || 'Error al iniciar sesión'
      errEl.classList.add('show')
      btn.disabled = false
      btn.innerHTML = '<span>Ingresar</span>'
    }
  }

  window.handleRegistro = async (e) => {
    e.preventDefault()
    const errEl = document.getElementById('err-registro')
    errEl.classList.remove('show')
    const btn = document.getElementById('btn-registro')
    btn.disabled = true
    btn.innerHTML = '<div class="spinner"></div>'
    try {
      await api.registro({
        nombre:      document.getElementById('reg-nombre').value.trim(),
        correo:      document.getElementById('reg-correo').value.trim(),
        contrasena:  document.getElementById('reg-pass').value,
        edad:        parseInt(document.getElementById('reg-edad').value),
        diagnostico: document.getElementById('reg-diagnostico').value
      })
      showToast('✓ Cuenta creada, inicia sesión')
      setTimeout(() => window.switchTab('login'), 1200)
    } catch (err) {
      errEl.textContent = err.mensaje || err.sqlMessage || 'Error al registrarse'
      errEl.classList.add('show')
    } finally {
      btn.disabled = false
      btn.innerHTML = '<span>Crear cuenta</span>'
    }
  }
}
