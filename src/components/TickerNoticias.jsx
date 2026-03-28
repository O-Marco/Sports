import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function TickerNoticias() {
  const [noticias, setNoticias] = useState([])

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('noticias')
        .select('titulo, modalidade')
        .order('criado_em', { ascending: false })
        .limit(8)
      if (data) setNoticias(data)
    }
    buscar()
  }, [])

  const icones = { Futebol: '⚽', Basquete: '🏀', 'E-Sports': '🎮', MMA: '🥊', Atletismo: '🏃' }
  const texto = noticias.map(n => `${icones[n.modalidade] || '📰'} ${n.titulo}`).join('   ·   ')

  return (
    <div style={{
      background: '#1d4ed8',
      overflow: 'hidden',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <span style={{
        background: '#1e40af',
        color: 'white',
        padding: '0 16px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }}>
        EM ALTA
      </span>

      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: 'ticker 40s linear infinite',
          color: 'white',
          fontSize: '0.8rem',
          paddingLeft: '100%',
        }}>
          {texto}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}

export default TickerNoticias