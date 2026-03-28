import { useState, useEffect } from 'react'

const categorias = ['Futebol', 'Basquete', 'E-Sports', 'MMA', 'Atletismo']

function Navbar() {
  const [hora, setHora] = useState('')

  useEffect(() => {
    const tick = setInterval(() => {
      setHora(new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  return (
    <nav style={{
      background: '#040d18',
      borderBottom: '1px solid #1e293b',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'block' }}/>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#818cf8', display: 'block' }}/>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e879f9', display: 'block' }}/>
        </div>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
          Sports<span style={{ color: '#38bdf8' }}>Dash</span>
        </span>
      </div>

      {/* Categorias */}
      <div style={{ display: 'flex', gap: '0.2rem' }}>
        {categorias.map(cat => (
          <button key={cat} style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.background = '#1e293b' }}
          onMouseLeave={e => { e.target.style.color = '#64748b'; e.target.style.background = 'transparent' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Relógio + badge ao vivo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#334155', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          {hora}
        </span>
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