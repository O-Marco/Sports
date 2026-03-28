// src/components/TrendingsEsportivos.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const coresPorModalidade = {
  'Futebol':  '#34d399',
  'Basquete': '#818cf8',
  'E-Sports': '#e879f9',
}

function formatarContagem(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n
}

function TrendingsEsportivos() {
  const [trendings, setTrendings] = useState([])
  const [aberto, setAberto] = useState(null) // qual card está expandido

  useEffect(() => {
    async function buscarTrendings() {
      const { data } = await supabase
        .from('trendings')
        .select('*')
        .order('contagem', { ascending: false })

      if (data) setTrendings(data)
    }

    buscarTrendings()
  }, [])

  function toggleCard(id) {
    // Se clicar no mesmo card aberto, fecha. Se clicar em outro, abre ele.
    setAberto(aberto === id ? null : id)
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{
        color: '#94a3b8',
        fontSize: '0.75rem',
        letterSpacing: '2px',
        marginBottom: '0.8rem'
      }}>
        TRENDINGS ESPORTIVOS
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {trendings.map((item, index) => {
          const cor = coresPorModalidade[item.modalidade] || '#94a3b8'
          const estaAberto = aberto === item.id

          return (
            <div
              key={item.id}
              onClick={() => toggleCard(item.id)}
              style={{
                background: estaAberto ? '#1e293b' : '#0f172a',
                border: `1px solid ${estaAberto ? cor + '66' : '#1e293b'}`,
                borderRadius: '10px',
                padding: '0.9rem 1.2rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Linha principal */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem'
              }}>
                {/* Número do ranking */}
                <span style={{
                  color: '#475569',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  minWidth: '16px'
                }}>
                  {index + 1}
                </span>

                {/* Hashtag */}
                <span style={{
                  color: cor,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  flex: 1
                }}>
                  {item.hashtag}
                </span>

                {/* Badge da modalidade */}
                <span style={{
                  background: cor + '22',
                  color: cor,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  letterSpacing: '1px'
                }}>
                  {item.modalidade.toUpperCase()}
                </span>

                {/* Contagem */}
                <span style={{
                  color: '#64748b',
                  fontSize: '0.8rem',
                  minWidth: '40px',
                  textAlign: 'right'
                }}>
                  {formatarContagem(item.contagem)}
                </span>

                {/* Seta */}
                <span style={{
                  color: '#475569',
                  fontSize: '0.75rem',
                  transform: estaAberto ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}>
                  ▼
                </span>
              </div>

              {/* Resumo expandido ao clicar */}
              {estaAberto && (
                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  marginTop: '0.7rem',
                  marginLeft: '24px',
                  lineHeight: '1.5',
                  borderLeft: `2px solid ${cor}`,
                  paddingLeft: '0.8rem'
                }}>
                  {item.resumo}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TrendingsEsportivos