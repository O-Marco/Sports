import { useState, useEffect } from 'react'

function Navbar({ temaEscuro, setTemaEscuro }) {
  const [hora, setHora] = useState('')

  useEffect(() => {
    const tick = setInterval(() => {
      setHora(new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  const bg       = temaEscuro ? '#040d18' : '#ffffff'
  const borda    = temaEscuro ? '#1e293b' : '#e2e8f0'
  const corTexto = temaEscuro ? '#64748b' : '#475569'
  const corLogo  = temaEscuro ? 'white'   : '#0f172a'

  return (
    <nav style={{
      background: bg,
      borderBottom: `1px solid ${borda}`,
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background 0.3s ease',
    }}>
      {/* Logo sem pontinhos */}
      <span style={{ color: corLogo, fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
        Sports<span style={{ color: '#38bdf8' }}>Dash</span>
      </span>

      {/* Relógio + botão tema */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: corTexto, fontSize: '0.85rem', fontFamily: 'monospace' }}>
          {hora}
        </span>
        <button
          onClick={() => setTemaEscuro(!temaEscuro)}
          style={{
            background: temaEscuro ? '#1e293b' : '#e2e8f0',
            border: 'none',
            borderRadius: '999px',
            padding: '6px 16px',
            cursor: 'pointer',
            fontSize: '0.82rem',
            color: temaEscuro ? '#94a3b8' : '#475569',
            transition: 'all 0.2s'
          }}
        >
          {temaEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar