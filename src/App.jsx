import Navbar from './components/Navbar'
import TickerNoticias from './components/TickerNoticias'
import EventoDestaque from './components/EventoDestaque'
import PlacaresAoVivo from './components/PlacaresAoVivo'
import TrendingsEsportivos from './components/TrendingsEsportivos'
import LinhaDeTempo from './components/LinhaDeTempo'
import SecaoNoticias from './components/SecaoNoticias'

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#040d18' }}>
      <Navbar />
      <TickerNoticias />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
        <EventoDestaque />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
          <PlacaresAoVivo />
          <TrendingsEsportivos />
        </div>

        <SecaoNoticias />
        <LinhaDeTempo />
      </div>
    </div>
  )
}

export default App