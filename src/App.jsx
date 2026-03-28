import EventoDestaque from './components/EventoDestaque'
import PlacaresAoVivo from './components/PlacaresAoVivo'
import TrendingsEsportivos from './components/TrendingsEsportivos'
import LinhaDeTempo from './components/LinhaDeTempo'

function App() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ color: 'white' }}>Sports Dashboard</h1>
      <EventoDestaque />
      <PlacaresAoVivo />
      <TrendingsEsportivos />
      <LinhaDeTempo />
    </div>
  )
}

export default App