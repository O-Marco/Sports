import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import TituloSecao from './TituloSecao'

function formatarContagem(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n
}

function TrendingsEsportivos({ temaEscuro }) {
  const [trendings, setTrendings] = useState([])
  const [aberto, setAberto] = useState(null)

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('trendings')
        .select('*')
        .order('contagem', { ascending: false })
      if (data) setTrendings(data)
    }
    buscar()
  }, [])

  const bg      = temaEscuro ? '#0d1625' : '#ffffff'
  const bgOpen  = temaEscuro ? '#111d30' : '#f8fafc'
  const borda   = temaEscuro ? '#1e293b' : '#e2e8f0'
  const corMeta = temaEscuro ? '#475569' : '#94a3b8'
  const corNum  = temaEscuro ? '#334155' : '#cbd5e1'

  return (
    <div>
      <TituloSecao texto="Trendings" temaEscuro={temaEscuro} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {trendings.map((item, index) => {
          const estaAberto = aberto === item.id
          return (
            <div key={item.id}
              onClick={() => setAberto(estaAberto ? null : item.id)}
              style={{
                background: estaAberto ? bgOpen : bg,
                border: `1px solid ${estaAberto ? '#3b82f6' : borda}`,
                borderRadius: '8px',
                padding: '0.65rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: corNum, fontSize: '0.72rem', fontWeight: '600', minWidth: '16px' }}>
                  {index + 1}
                </span>
                <span style={{ color: '#3b82f6', fontWeight: '700', fontSize: '0.88rem', flex: 1 }}>
                  {item.hashtag}
                </span>
                <span style={{ color: corMeta, fontSize: '0.72rem' }}>
                  {formatarContagem(item.contagem)}
                </span>
                <span style={{
                  color: corMeta, fontSize: '0.62rem',
                  transform: estaAberto ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s'
                }}>▼</span>
              </div>
              {estaAberto && (
                <p style={{
                  color: temaEscuro ? '#94a3b8' : '#475569',
                  fontSize: '0.8rem',
                  marginTop: '0.6rem',
                  paddingLeft: '1.6rem',
                  borderLeft: '2px solid #3b82f6',
                  marginLeft: '1.6rem',
                  lineHeight: 1.6
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