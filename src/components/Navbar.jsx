import { useState, useEffect } from 'react'

function Navbar({ temaEscuro, setTemaEscuro }) {
  const [hora, setHora] = useState('')
  const [buscaAberta, setBuscaAberta] = useState(false)
  const [hoverBusca, setHoverBusca] = useState(false) // Novo estado para o hover

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
      
      {/* ESQUERDA: Logo com scroll para o topo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <span 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ 
            color: 'white', 
            fontWeight: '900', 
            fontSize: '1.6rem', 
            letterSpacing: '-1px', 
            textTransform: 'uppercase', 
            cursor: 'pointer',
            userSelect: 'none'
          }}>
          Sports<span style={{ color: '#00d1ff' }}>Dash</span>
        </span>
      </div>

      {/* DIREITA: Ações */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* BUSCA COM HOVER AZUL */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar evento..."
            style={{
              width: buscaAberta ? '200px' : '0px',
              opacity: buscaAberta ? 1 : 0,
              padding: buscaAberta ? '8px 35px 8px 12px' : '0px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '20px',
              border: '1px solid #333',
              background: '#121212',
              color: 'white',
              outline: 'none',
              fontSize: '0.85rem'
            }}
          />
          <button
            onClick={() => setBuscaAberta(!buscaAberta)}
            onMouseEnter={() => setHoverBusca(true)}   // Ativa hover
            onMouseLeave={() => setHoverBusca(false)}  // Desativa hover
            style={{
              background: 'none',
              border: 'none',
              // Cor muda se estiver aberto OU se o mouse estiver em cima
              color: (buscaAberta || hoverBusca) ? '#00d1ff' : '#94a3b8', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '5px',
              marginLeft: buscaAberta ? '-30px' : '0px',
              transition: 'color 0.3s ease', // Transição suave da cor
              zIndex: 1
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* TEMA */}
        <button
          onClick={() => setTemaEscuro(!temaEscuro)}
          style={{
            background: '#121212',
            border: '1px solid #333',
            color: '#ffb100',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: '0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00d1ff'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333'}
        >
          {temaEscuro ? '☀️' : '🌙'}
        </button>

        {/* HORA */}
        <div style={{ textAlign: 'right', borderLeft: '1px solid #333', paddingLeft: '1.5rem' }}>
          <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{hora}</div>
          <div style={{ color: '#00d1ff', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '1px', textAlign: 'center' }}>LIVE</div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar