// src/pages/PaginaNoticias.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const coresCategorias = {
  'Transferência': '#dc2626',
  'Contratação':   '#7c3aed',
  'Resultado':     '#059669',
  'Próximo Evento':'#d97706',
}
const icones = { Futebol: '⚽', Basquete: '🏀', 'E-Sports': '🎮', MMA: '🥊', Atletismo: '🏃' }

function tempoRelativo(dataString) {
  const diff = (new Date() - new Date(dataString)) / 60000
  if (diff < 60) return `${Math.floor(diff)}min atrás`
  if (diff < 1440) return `${Math.floor(diff / 60)}h atrás`
  return `${Math.floor(diff / 1440)}d atrás`
}

function PaginaNoticias({ temaEscuro }) {
  const [noticias, setNoticias] = useState([])
  const [filtroMod, setFiltroMod] = useState('Todos')
  const [filtroCat, setFiltroCat] = useState('Todos')

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase.from('noticias').select('*').order('criado_em', { ascending: false })
      if (data) setNoticias(data)
    }
    buscar()
  }, [])

  const modalidades = ['Todos', ...new Set(noticias.map(n => n.modalidade).filter(Boolean))]
  const categorias  = ['Todos', ...new Set(noticias.map(n => n.categoria).filter(Boolean))]
  const filtradas = noticias.filter(n =>
    (filtroMod === 'Todos' || n.modalidade === filtroMod) &&
    (filtroCat === 'Todos' || n.categoria === filtroCat)
  )

  const bgCard = temaEscuro ? '#0d1b2e' : '#ffffff'
  const bgHover = temaEscuro ? '#112240' : '#f8fafc'
  const bordaCard = temaEscuro ? '#1e293b' : '#e2e8f0'
  const bordaHover = temaEscuro ? '#2d4a6e' : '#cbd5e1'
  const corTitulo = temaEscuro ? '#f1f5f9' : '#0f172a'
  const corMeta = temaEscuro ? '#64748b' : '#94a3b8'
  const borda = temaEscuro ? '#1e293b' : '#e2e8f0'
  const bgFiltro = temaEscuro ? '#0d1625' : '#ffffff'

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: temaEscuro ? '#f1f5f9' : '#0f172a', fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.25rem' }}>📰 Notícias</h1>
        <p style={{ color: corMeta, fontSize: '0.9rem' }}>{filtradas.length} matérias encontradas</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ color: corMeta, fontSize: '0.75rem', fontWeight: '600', alignSelf: 'center', letterSpacing: '1px' }}>ESPORTE</span>
          {modalidades.map(m => (
            <button key={m} onClick={() => setFiltroMod(m)} style={{ padding: '5px 14px', borderRadius: '20px', border: `1px solid ${filtroMod === m ? '#1d4ed8' : borda}`, background: filtroMod === m ? '#1d4ed8' : bgFiltro, color: filtroMod === m ? 'white' : corMeta, fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>{m}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ color: corMeta, fontSize: '0.75rem', fontWeight: '600', alignSelf: 'center', letterSpacing: '1px' }}>CATEGORIA</span>
          {categorias.map(c => (
            <button key={c} onClick={() => setFiltroCat(c)} style={{ padding: '5px 14px', borderRadius: '20px', border: `1px solid ${filtroCat === c ? '#1d4ed8' : borda}`, background: filtroCat === c ? '#1d4ed8' : bgFiltro, color: filtroCat === c ? 'white' : corMeta, fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filtradas.map(noticia => {
          const corCat = coresCategorias[noticia.categoria] || '#475569'
          return (
            <div key={noticia.id} style={{ borderRadius: '12px', background: bgCard, border: `1px solid ${bordaCard}`, cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = bgHover; e.currentTarget.style.borderColor = bordaHover }}
              onMouseLeave={e => { e.currentTarget.style.background = bgCard; e.currentTarget.style.borderColor = bordaCard }}
            >
              {noticia.imagem_url && <div style={{ height: '160px', backgroundImage: `url(${noticia.imagem_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}/>}
              <div style={{ padding: '1rem' }}>
                <span style={{ background: corCat, color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 'bold', letterSpacing: '1px', display: 'inline-block', marginBottom: '0.6rem' }}>{noticia.categoria?.toUpperCase()}</span>
                <p style={{ color: corTitulo, fontSize: '0.95rem', fontWeight: '700', lineHeight: 1.4, marginBottom: '0.5rem' }}>{noticia.titulo}</p>
                {noticia.resumo && <p style={{ color: corMeta, fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{noticia.resumo}</p>}
                <span style={{ color: corMeta, fontSize: '0.72rem' }}>{icones[noticia.modalidade]} {noticia.modalidade} · {tempoRelativo(noticia.criado_em)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {filtradas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: corMeta }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <p>Nenhuma notícia encontrada com esses filtros.</p>
        </div>
      )}
    </div>
  )
}

export default PaginaNoticias