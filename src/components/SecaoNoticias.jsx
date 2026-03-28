import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const coresCategorias = {
  'Transferência':  '#dc2626',
  'Contratação':    '#7c3aed',
  'Resultado':      '#059669',
  'Próximo Evento': '#d97706',
}

const icones = { Futebol: '⚽', Basquete: '🏀', 'E-Sports': '🎮', MMA: '🥊', Atletismo: '🏃' }

function tempoRelativo(dataString) {
  const diff = (new Date() - new Date(dataString)) / 60000
  if (diff < 60) return `${Math.floor(diff)}min atrás`
  if (diff < 1440) return `${Math.floor(diff / 60)}h atrás`
  return `${Math.floor(diff / 1440)}d atrás`
}

function SecaoNoticias({ temaEscuro }) {
  const [noticias, setNoticias] = useState([])

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('noticias')
        .select('*')
        .order('criado_em', { ascending: false })
        .limit(5)
      if (data) setNoticias(data)
    }
    buscar()
  }, [])

  const bgCard      = temaEscuro ? '#0a1628' : '#ffffff'
  const bgHover     = temaEscuro ? '#0f1e35' : '#f8fafc'
  const bordaCard   = temaEscuro ? '#1e293b' : '#e2e8f0'
  const bordaHover  = temaEscuro ? '#334155' : '#cbd5e1'
  const corTitulo   = temaEscuro ? '#ffffff' : '#0f172a'
  const corResumo   = temaEscuro ? '#94a3b8' : '#475569'
  const corMeta     = temaEscuro ? '#475569' : '#94a3b8'
  const corSecao    = temaEscuro ? '#ffffff' : '#0f172a'
  const corLinha    = temaEscuro ? '#1e293b' : '#e2e8f0'

  const destaque = noticias.find(n => n.destaque) || noticias[0]
  const secundarias = noticias.filter(n => n.id !== destaque?.id).slice(0, 4)

  if (noticias.length === 0) return null

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        <h2 style={{ color: corSecao, fontSize: '1.2rem', fontWeight: 'bold' }}>
          Últimas Notícias
        </h2>
        <div style={{ flex: 1, height: '1px', background: corLinha }}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* Card destaque grande */}
        {destaque && (
          <div style={{
            gridRow: 'span 2',
            borderRadius: '12px',
            overflow: 'hidden',
            background: bgCard,
            border: `1px solid ${bordaCard}`,
            cursor: 'pointer',
            position: 'relative',
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
            {destaque.imagem_url && (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${destaque.imagem_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}/>
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(4,13,24,0.97) 40%, rgba(4,13,24,0.2) 100%)',
            }}/>
            <div style={{ position: 'relative', padding: '1.5rem' }}>
              <span style={{
                background: coresCategorias[destaque.categoria] || '#475569',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                letterSpacing: '1px',
                marginBottom: '0.8rem',
                display: 'inline-block'
              }}>
                {destaque.categoria?.toUpperCase()}
              </span>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                lineHeight: 1.3,
                marginBottom: '0.5rem'
              }}>
                {destaque.titulo}
              </h3>
              <p style={{ color: corResumo, fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.8rem' }}>
                {destaque.resumo}
              </p>
              <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                {icones[destaque.modalidade]} {destaque.modalidade} · {tempoRelativo(destaque.criado_em)}
              </span>
            </div>
          </div>
        )}

        {/* Cards secundários */}
        {secundarias.map(noticia => (
          <div key={noticia.id}
            style={{
              borderRadius: '10px',
              background: bgCard,
              border: `1px solid ${bordaCard}`,
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              gap: '1rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = bgHover
              e.currentTarget.style.borderColor = bordaHover
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = bgCard
              e.currentTarget.style.borderColor = bordaCard
            }}
          >
            {noticia.imagem_url && (
              <div style={{
                width: '80px', height: '80px',
                borderRadius: '8px',
                backgroundImage: `url(${noticia.imagem_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0
              }}/>
            )}
            <div style={{ flex: 1 }}>
              <span style={{
                background: (coresCategorias[noticia.categoria] || '#475569') + '22',
                color: coresCategorias[noticia.categoria] || '#94a3b8',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                display: 'inline-block',
                marginBottom: '0.4rem'
              }}>
                {noticia.categoria?.toUpperCase()}
              </span>
              <p style={{
                color: corTitulo,
                fontSize: '0.88rem',
                fontWeight: 'bold',
                lineHeight: 1.3,
                marginBottom: '0.4rem'
              }}>
                {noticia.titulo}
              </p>
              <span style={{ color: corMeta, fontSize: '0.72rem' }}>
                {icones[noticia.modalidade]} {noticia.modalidade} · {tempoRelativo(noticia.criado_em)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SecaoNoticias