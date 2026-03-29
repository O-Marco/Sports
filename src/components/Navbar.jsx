import { useState, useEffect } from 'react'

function Navbar({ temaEscuro, setTemaEscuro }) {
  const [hora, setHora] = useState('')
  const [buscaAberta, setBuscaAberta] = useState(false)

  useEffect(() => {
    const tick = setInterval(() => {
      setHora(new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit'
      }))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  return (
    <nav style={{
      background: '#000000',
      borderBottom: '2px solid #1a1a1a',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* ESQUERDA: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <span style={{ color: 'white', fontWeight: '900', fontSize: '1.6rem', letterSpacing: '-1px', textTransform: 'uppercase', cursor: 'pointer' }}>
          Sports<span style={{ color: '#00d1ff', textShadow: '0 0 10px rgba(0, 209, 255, 0.5)' }}>Dash</span>
        </span>
      </div>

      {/* DIREITA: Busca, Tema, Hora e Admin */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        
        {/* BUSCA QUE EXPANDE */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Buscar..." 
            style={{
              width: buscaAberta ? '200px' : '0px',
              opacity: buscaAberta ? 1 : 0,
              padding: buscaAberta ? '8px 15px 8px 35px' : '0px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              background: '#121212',
              border: '1px solid #333',
              borderRadius: '20px',
              color: 'white',
              outline: 'none',
              overflow: 'hidden'
            }}
          />
          <button 
            onClick={() => setBuscaAberta(!buscaAberta)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00d1ff',
              fontSize: '1.2rem',
              cursor: 'pointer',
              position: buscaAberta ? 'absolute' : 'relative',
              left: buscaAberta ? '10px' : '0',
              zIndex: 1,
              transition: 'all 0.4s'
            }}
          >
            🔍
          </button>
        </div>

        {/* BOTÃO DE TEMA (O SOL/LUA) */}
        <button
          onClick={() => setTemaEscuro(!temaEscuro)}
          style={{
            background: '#121212',
            border: '1px solid #333',
            color: '#00d1ff',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: '0.3s'
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#00d1ff'}
          onMouseLeave={(e) => e.target.style.borderColor = '#333'}
        >
          {temaEscuro ? '☀️' : '🌙'}
        </button>

        {/* HORA */}
        <div style={{ textAlign: 'right', minWidth: '60px' }}>
          <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold' }}>{hora}</div>
          <div style={{ color: '#00d1ff', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '1px' }}></div>
        </div>

        {/* ADMIN */}
        <button
          style={{
            background: '#00d1ff',
            color: '#000',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '800',
            cursor: 'pointer',
            textTransform: 'uppercase'
          }}
        >
          Admin
        </button>
      </div>
    </nav>
  )
}

export default Navbar