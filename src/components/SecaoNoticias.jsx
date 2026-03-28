import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import TituloSecao from './TituloSecao'

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

  const bgCard    = temaEscuro ? '#0d1b2e' : '#ffffff'
  const bgHover   = temaEscuro ? '#112240' : '#f8fafc'
  const bordaCard = temaEscuro ? '#1e293b' : '#e2e8f0'
  const bordaHover= temaEscuro ? '#2d4a6e' : '#cbd5e1'
  const corTitulo = temaEscuro ? '#f1f5f9' : '#0f172a'
  const corMeta   = temaEscuro ? '#64748b' : '#94a3b8'
  

  const destaque   = noticias.find(n => n.destaque) || noticias[0]
  const secundarias = noticias.filter(n => n.id !== destaque?.id).slice(0, 4)

  if (noticias.length === 0) return null

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <TituloSecao texto="Últimas Notícias" temaEscuro={temaEscuro} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* Card destaque — ocupa 2 linhas */}
        {destaque && (
          <div style={{
            gridRow: 'span 2',
            borderRadius: '12px',
            overflow: 'hidden',
            background: bgCard,
            border: `1px solid ${bordaCard}`,
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minHeight: '380px',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = bordaHover}
          onMouseLeave={e => e.currentTarget.style.borderColor = bordaCard}
          >
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
              background: 'linear-gradient(to top, rgba(2,8,18,0.98) 45%, rgba(2,8,18,0.15) 100%)',
            }}/>
            <div style={{ position: 'relative', padding: '1.8rem' }}>
              <span style={{
                background: coresCategorias[destaque.categoria] || '#475569',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '0.68rem',
                fontWeight: 'bold',
                letterSpacing: '1.5px',
                marginBottom: '0.9rem',
                display: 'inline-block'
              }}>
                {destaque.categoria?.toUpperCase()}
              </span>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.25rem',
                fontWeight: '700',
                lineHeight: 1.4,
                marginBottom: '0.6rem'
              }}>
                {destaque.titulo}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {destaque.resumo}
              </p>
              <span style={{ color: '#475569', fontSize: '0.75rem' }}>
                {icones[destaque.modalidade]} {destaque.modalidade} · {tempoRelativo(destaque.criado_em)}
              </span>
            </div>
          </div>
        )}

        {/* Cards secundários — imagem à esquerda, texto à direita */}
        {secundarias.map(noticia => {
          const corCat = coresCategorias[noticia.categoria] || '#475569'
          return (
            <div key={noticia.id}
              style={{
                borderRadius: '10px',
                background: bgCard,
                border: `1px solid ${bordaCard}`,
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                overflow: 'hidden',
                transition: 'all 0.2s',
                minHeight: '110px',
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
              {/* Imagem — altura total do card */}
              {noticia.imagem_url ? (
                <div style={{
                  backgroundImage: `url(${noticia.imagem_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                }}/>
              ) : (
                <div style={{ background: temaEscuro ? '#1e293b' : '#f1f5f9' }}/>
              )}

              {/* Texto */}
              <div style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{
                    background: corCat,
color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.62rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    display: 'inline-block',
                    marginBottom: '0.5rem'
                  }}>
                    {noticia.categoria?.toUpperCase()}
                  </span>
                  <p style={{
                    color: corTitulo,
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    lineHeight: 1.4,
                  }}>
                    {noticia.titulo}
                  </p>
                </div>
                <span style={{ color: corMeta, fontSize: '0.72rem', marginTop: '0.5rem' }}>
                  {icones[noticia.modalidade]} {noticia.modalidade} · {tempoRelativo(noticia.criado_em)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SecaoNoticias