// src/components/PlacaresAoVivo.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

// Cada modalidade tem uma cor diferente
const coresPorModalidade = {
  'Futebol':  { fundo: '#064e3b', destaque: '#34d399' },
  'Basquete': { fundo: '#1e1b4b', destaque: '#818cf8' },
  'E-Sports': { fundo: '#4a1942', destaque: '#e879f9' },
}

function CartaoJogo({ jogo }) {
  const cores = coresPorModalidade[jogo.modalidade] || { fundo: '#1e293b', destaque: '#94a3b8' }

  return (
    <div style={{
      background: cores.fundo,
      borderRadius: '12px',
      padding: '1.2rem',
      border: `1px solid ${cores.destaque}33`,
      flex: '1',
      minWidth: '200px'
    }}>
      {/* Badge da modalidade */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <span style={{
          background: cores.destaque + '22',
          color: cores.destaque,
          padding: '2px 10px',
          borderRadius: '999px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          {jogo.modalidade.toUpperCase()}
        </span>
        <span style={{
          color: '#ef4444',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{
            width: '6px', height: '6px',
            background: '#ef4444',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'piscar 1s infinite'
          }}/>
          AO VIVO · {jogo.minuto}'
        </span>
      </div>

      {/* Placar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', flex: 1 }}>
          {jogo.time_casa}
        </span>
        <span style={{
  color: cores.destaque,
  fontSize: '1.4rem',
  fontWeight: 'bold',
  letterSpacing: '2px',
  padding: '0 0.5rem',
  whiteSpace: 'nowrap'   // ← isso impede a quebra de linha
}}>
  {jogo.gols_casa} · {jogo.gols_visitante}
</span>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', flex: 1, textAlign: 'right' }}>
          {jogo.time_visitante}
        </span>
      </div>
    </div>
  )
}

function PlacaresAoVivo() {
  const [placares, setPlacares] = useState([])

  useEffect(() => {
    async function buscarPlacares() {
      const { data } = await supabase
        .from('placares')
        .select('*')
        .eq('status', 'ao vivo')

      if (data) setPlacares(data)
    }

    // Busca imediatamente ao carregar
    buscarPlacares()

    // Atualiza a cada 30 segundos automaticamente
    const intervalo = setInterval(buscarPlacares, 30000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{
        color: '#94a3b8',
        fontSize: '0.75rem',
        letterSpacing: '2px',
        marginBottom: '0.8rem'
      }}>
        PLACARES AO VIVO
      </p>

      <style>{`
        @keyframes piscar {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {placares.length === 0
          ? <p style={{ color: '#475569' }}>Carregando placares...</p>
          : placares.map(jogo => <CartaoJogo key={jogo.id} jogo={jogo} />)
        }
      </div>
    </div>
  )
}

export default PlacaresAoVivo