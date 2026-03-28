// src/components/LinhaDeTempo.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const coresPorModalidade = {
  'Futebol':   '#34d399',
  'Basquete':  '#818cf8',
  'E-Sports':  '#e879f9',
  'Atletismo': '#fb923c',
  'MMA':       '#f87171',
}

function formatarData(dataString) {
  const data = new Date(dataString)
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function LinhaDeTempo() {
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    async function buscarEventos() {
      const { data } = await supabase
        .from('linha_do_tempo')
        .select('*')
        .gt('data_evento', new Date().toISOString())
        .order('data_evento', { ascending: true })
        .limit(7)

      if (data) setEventos(data)
    }

    buscarEventos()
  }, [])

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{
        color: '#94a3b8',
        fontSize: '0.75rem',
        letterSpacing: '2px',
        marginBottom: '0.8rem'
      }}>
        PRÓXIMOS EVENTOS
      </p>

      {/* Container com scroll horizontal */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
        scrollbarWidth: 'thin',
        scrollbarColor: '#334155 transparent'
      }}>
        {eventos.map((evento, index) => {
          const cor = coresPorModalidade[evento.modalidade] || '#94a3b8'

          return (
            <div key={evento.id} style={{
              background: '#0f172a',
              border: `1px solid #1e293b`,
              borderTop: `3px solid ${cor}`,
              borderRadius: '10px',
              padding: '1.2rem',
              minWidth: '180px',
              maxWidth: '180px',
              flexShrink: 0,  // impede o card de encolher
              position: 'relative'
            }}>
              {/* Número do evento na linha do tempo */}
              <span style={{
                position: 'absolute',
                top: '10px',
                right: '12px',
                color: '#334155',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                #{index + 1}
              </span>

              {/* Ícone grande */}
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>
                {evento.icone}
              </div>

              {/* Modalidade */}
              <span style={{
                color: cor,
                fontSize: '0.65rem',
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}>
                {evento.modalidade.toUpperCase()}
              </span>

              {/* Nome do evento */}
              <p style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                margin: '0.3rem 0',
                lineHeight: '1.3'
              }}>
                {evento.nome}
              </p>

              {/* Descrição curta */}
              <p style={{
                color: '#64748b',
                fontSize: '0.75rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                {evento.descricao_curta}
              </p>

              {/* Data formatada */}
              <p style={{
                color: cor,
                fontSize: '0.75rem',
                marginTop: '0.8rem',
                fontWeight: 'bold'
              }}>
                {formatarData(evento.data_evento)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LinhaDeTempo