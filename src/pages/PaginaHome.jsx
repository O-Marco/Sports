// src/pages/PaginaHome.jsx
import EventoDestaque from '../components/EventoDestaque'
import PlacaresAoVivo from '../components/PlacaresAoVivo'
import TrendingsEsportivos from '../components/TrendingsEsportivos'
import SecaoNoticias from '../components/SecaoNoticias'
import LinhaDeTempo from '../components/LinhaDeTempo'

function PaginaHome({ temaEscuro }) {
  return (
    <>
      <EventoDestaque />
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
    </>
  )
}

export default PaginaHome