export const auth = {
  guardar: (usuario) => localStorage.setItem('zg_user', JSON.stringify(usuario)),

  obtener: () => {
    try { return JSON.parse(localStorage.getItem('zg_user')) }
    catch { return null }
  },

  cerrar: () => {
    localStorage.removeItem('zg_user')
    router.go('login')
  },

  requiere: () => {
    const u = auth.obtener()
    if (!u) router.go('login')
    return u
  },

  iniciales: (nombre) =>
    nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}
