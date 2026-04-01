import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const navLinks = [
  { label: 'Placares',   to: '/placares' },
  { label: 'Notícias',   to: '/noticias' },
  { label: 'Calendário', to: '/calendario' },
]

function Navbar({ temaEscuro, setTemaEscuro }) {
  const [hora, setHora] = useState('')
  const [buscaAberta, setBuscaAberta] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const tick = setInterval(() => {
      setHora(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  return (
    <>
      <style>{`
        .nav-link {
          color: #aab4c4;
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 0 4px;
          height: 56px;
          display: flex;
          align-items: center;
          border-bottom: 3px solid transparent;
          border-top: 3px solid transparent;
          transition: color 0.15s ease, border-color 0.15s ease;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: #ffffff;
          border-bottom-color: #444;
        }
        .nav-link.active {
          color: #ffffff;
          border-bottom-color: #00d1ff;
        }
        .busca-input::placeholder { color: #555; }
        .busca-input:focus { outline: none; border-color: #00d1ff !important; }
      `}</style>

      <nav style={{
        background: '#0a0a0a',
        borderBottom: '1px solid #1f1f1f',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>

        {/* ESQUERDA: Logo + separador + links */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <span
            onClick={() => {
            if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
              navigate('/')
             }
            }}
            style={{
              color: 'white', fontWeight: '900', fontSize: '1.25rem',
              letterSpacing: '-0.5px', textTransform: 'uppercase',
              cursor: 'pointer', userSelect: 'none',
              marginRight: '1.5rem', flexShrink: 0,
            }}
          >
            Sports<span style={{ color: '#00d1ff' }}>Dash</span>
          </span>

          <div style={{ width: '1px', height: '22px', background: '#2a2a2a', marginRight: '1.5rem' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', height: '100%' }}>
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* DIREITA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

          {/* BUSCA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ overflow: 'hidden', width: buscaAberta ? '200px' : '0px', transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <input
                className="busca-input"
                type="text"
                placeholder="Buscar..."
                autoFocus={buscaAberta}
                style={{
                  width: '200px', padding: '6px 12px',
                  background: '#141414', border: '1px solid #2a2a2a',
                  borderRadius: '4px', color: 'white', fontSize: '0.8rem',
                }}
              />
            </div>
            <button
              onClick={() => setBuscaAberta(!buscaAberta)}
              style={{ background: 'none', border: 'none', color: buscaAberta ? '#00d1ff' : '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = buscaAberta ? '#00d1ff' : '#666'}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>

          <div style={{ width: '1px', height: '18px', background: '#2a2a2a' }} />

          {/* TEMA */}
          <button
            onClick={() => setTemaEscuro(!temaEscuro)}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', padding: '4px', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#888'}
          >
            {temaEscuro ? '☀️' : '🌙'}
          </button>

          <div style={{ width: '1px', height: '18px', background: '#2a2a2a' }} />

          {/* HORA + AO VIVO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#ef4444', color: 'white', fontSize: '0.55rem', fontWeight: '900', letterSpacing: '1px', padding: '2px 6px', borderRadius: '3px' }}>
              AO VIVO
            </div>
            <span style={{ color: '#ccc', fontSize: '0.85rem', fontWeight: '700', fontFamily: 'monospace' }}>
              {hora}
            </span>
          </div>

        </div>
      </nav>
    </>
  )
}

export default Navbar