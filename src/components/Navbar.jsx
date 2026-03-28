import { useState, useEffect } from 'react'

const categorias = ['Futebol', 'Basquete', 'E-Sports', 'MMA', 'Atletismo']

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

  const bg = temaEscuro ? '#040d18' : '#ffffff'
  const borda = temaEscuro ? '#1e293b' : '#e2e8f0'
  const corTexto = temaEscuro ? '#64748b' : '#475569'
  const corHover = temaEscuro ? '#1e293b' : '#f1f5f9'
  const corLogo = temaEscuro ? 'white' : '#0f172a'

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
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['#34d399','#818cf8','#e879f9'].map(c => (
            <span key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'block' }}/>
          ))}
        </div>
        <span style={{ color: corLogo, fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
          Sports<span style={{ color: '#38bdf8' }}>Dash</span>
        </span>
      </div>

      {/* Categorias */}
      <div style={{ display: 'flex', gap: '0.2rem' }}>
        {categorias.map(cat => (
          <button key={cat} style={{
            background: 'transparent',
            border: 'none',
            color: corTexto,
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.color = temaEscuro ? 'white' : '#0f172a'; e.target.style.background = corHover }}
          onMouseLeave={e => { e.target.style.color = corTexto; e.target.style.background = 'transparent' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Direita: relógio + tema + ao vivo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: corTexto, fontSize: '0.8rem', fontFamily: 'monospace' }}>
          {hora}
        </span>

        {/* Botão de tema */}
        <button
          onClick={() => setTemaEscuro(!temaEscuro)}
          style={{
            background: temaEscuro ? '#1e293b' : '#e2e8f0',
            border: 'none',
            borderRadius: '999px',
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: temaEscuro ? '#94a3b8' : '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          {temaEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>

        <span style={{
          background: '#dc2626',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'white',
            animation: 'piscar 1s infinite',
            display: 'block'
          }}/>
          AO VIVO
        </span>
      </div>

      <style>{`@keyframes piscar { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </nav>
  )
}

export default Navbar