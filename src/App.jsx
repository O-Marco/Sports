import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import TickerNoticias from './components/TickerNoticias'
import Rodape from './components/Rodape'
import EventoDestaque from './components/EventoDestaque'
import PlacaresAoVivo from './components/PlacaresAoVivo'
import TrendingsEsportivos from './components/TrendingsEsportivos'
import LinhaDeTempo from './components/LinhaDeTempo'
import SecaoNoticias from './components/SecaoNoticias'
import PaginaPlacares from './pages/PaginaPlacares'
import PaginaNoticias from './pages/PaginaNoticias'
import PaginaCalendario from './pages/PaginaCalendario'
import PaginaEventos from './pages/PaginaEventos'
import PaginaDetalheNoticia from './pages/PaginaDetalheNoticia'
import PainelAdmin from './pages/PainelAdmin'

function PaginaHome({ temaEscuro }) {
  return (
    <>
      <EventoDestaque />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', marginTop: '1.5rem', alignItems: 'start' }}>
          <PlacaresAoVivo temaEscuro={temaEscuro} />
          <TrendingsEsportivos temaEscuro={temaEscuro} />
        </div>
        <SecaoNoticias temaEscuro={temaEscuro} />
        <LinhaDeTempo temaEscuro={temaEscuro} />
      </div>
    </>
  )
}

function Layout({ temaEscuro, setTemaEscuro }) {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  return (
    <>
      <Navbar temaEscuro={temaEscuro} setTemaEscuro={setTemaEscuro} />
      {!isAdmin && <TickerNoticias temaEscuro={temaEscuro} />}
      <Routes>
        <Route path="/" element={<PaginaHome temaEscuro={temaEscuro} />} />
        <Route path="/placares" element={<PaginaPlacares temaEscuro={temaEscuro} />} />
        <Route path="/noticias" element={<PaginaNoticias temaEscuro={temaEscuro} />} />
        <Route path="/noticias/:id" element={<PaginaDetalheNoticia temaEscuro={temaEscuro} />} />
        <Route path="/calendario" element={<PaginaCalendario temaEscuro={temaEscuro} />} />
        <Route path="/eventos" element={<PaginaEventos temaEscuro={temaEscuro} />} />
        <Route path="/admin" element={<PainelAdmin temaEscuro={temaEscuro} />} />
      </Routes>
      {!isAdmin && <Rodape temaEscuro={temaEscuro} />}
    </>
  )
}

function App() {
  const [temaEscuro, setTemaEscuro] = useState(false)

  useEffect(() => {
    document.body.className = temaEscuro ? 'tema-escuro' : 'tema-claro'
  }, [temaEscuro])

  return (
    <BrowserRouter>
      <Layout temaEscuro={temaEscuro} setTemaEscuro={setTemaEscuro} />
    </BrowserRouter>
  )
}

export default App