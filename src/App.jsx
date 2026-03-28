import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import TickerNoticias from './components/TickerNoticias'
import EventoDestaque from './components/EventoDestaque'
import PlacaresAoVivo from './components/PlacaresAoVivo'
import TrendingsEsportivos from './components/TrendingsEsportivos'
import LinhaDeTempo from './components/LinhaDeTempo'
import SecaoNoticias from './components/SecaoNoticias'

function App() {
  const [temaEscuro, setTemaEscuro] = useState(false)

  useEffect(() => {
    document.body.className = temaEscuro ? 'tema-escuro' : 'tema-claro'
  }, [temaEscuro])

  return (
    <div>
      <Navbar temaEscuro={temaEscuro} setTemaEscuro={setTemaEscuro} />
      <TickerNoticias temaEscuro={temaEscuro} />

      {/* Hero fora do container — largura total */}
      <EventoDestaque />

      {/* Resto dentro do container */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: '1.5rem',
          marginTop: '1.5rem',
          alignItems: 'start'
        }}>
          <PlacaresAoVivo temaEscuro={temaEscuro} />
          <TrendingsEsportivos temaEscuro={temaEscuro} />
        </div>

        <SecaoNoticias temaEscuro={temaEscuro} />
        <LinhaDeTempo temaEscuro={temaEscuro} />
      </div>
    </div>
  )
}

export default App