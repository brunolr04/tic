export function showToast(msg) {
  const t = document.getElementById('toast')
  t.textContent = msg
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 2500)
}

export function navHTML(active) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>` },
    { id: 'historial', label: 'Historial', icon: `<path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/>` },
    { id: 'ajustes',   label: 'Ajustes',   icon: `<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>` },
  ]
  return `
  <nav class="bottom-nav">
    ${items.map(i => `
      <div class="nav-item ${i.id === active ? 'active' : ''}"
           onclick="window.router.go('${i.id}')">
        <svg viewBox="0 0 24 24">${i.icon}</svg>
        ${i.label}
      </div>`).join('')}
  </nav>`
}

export function formatFecha(str) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleString('es-CL', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export function clasificar(t) {
  const hz = parseFloat(t.frecuencia_hz)
  if (hz < 3)  return { label: 'Baja',    cls: 'badge-good', filtro: 'bueno'   }
  if (hz <= 6) return { label: 'Normal',  cls: 'badge-mid',  filtro: 'regular' }
  return             { label: 'Alta',    cls: 'badge-bad',  filtro: 'alto'    }
}

export function spinnerHTML(light = false) {
  return `<div class="spinner" style="${light ? 'border-top-color:#fff;border-color:rgba(255,255,255,0.2);' : ''}"></div>`
}

export function iconSVG(paths, extra = '') {
  return `<svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;${extra}" viewBox="0 0 24 24">${paths}</svg>`
}
