import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'
import TituloSecao from './TituloSecao'

function formatarData(dataString) {
  return new Date(dataString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

function LinhaDeTempo({ temaEscuro }) {
  const [eventos, setEventos] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('linha_do_tempo')
        .select('*')
        .gt('data_evento', new Date().toISOString())
        .order('data_evento', { ascending: true })
        .limit(7)
      if (data) setEventos(data)
    }
    buscar()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || eventos.length === 0) return
    let animFrame, pos = 0
    function animar() {
      pos += 0.4
      if (pos >= el.scrollHeight / 2) pos = 0
      el.scrollTop = pos
      animFrame = requestAnimationFrame(animar)
    }
    animFrame = requestAnimationFrame(animar)
    const pausar = () => cancelAnimationFrame(animFrame)
    const retomar = () => { animFrame = requestAnimationFrame(animar) }
    el.addEventListener('mouseenter', pausar)
    el.addEventListener('mouseleave', retomar)
    return () => {
      cancelAnimationFrame(animFrame)
      el.removeEventListener('mouseenter', pausar)
      el.removeEventListener('mouseleave', retomar)
    }
  }, [eventos])

  const bgCard  = temaEscuro ? '#0d1625' : '#ffffff'
  const borda   = temaEscuro ? '#1e293b' : '#e2e8f0'
  const corTexto= temaEscuro ? '#f1f5f9' : '#0f172a'
  const corSub  = temaEscuro ? '#475569' : '#94a3b8'
  const corMod  = temaEscuro ? '#64748b' : '#94a3b8'

  const itens = [...eventos, ...eventos]

  return (
    <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
      <TituloSecao texto="Próximos eventos" temaEscuro={temaEscuro} />

      <div ref={ref} style={{ height: '260px', overflowY: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {itens.map((evento, i) => (
            <div key={i} style={{
              background: bgCard,
              border: `1px solid ${borda}`,
              borderLeft: '3px solid #3b82f6',
              borderRadius: '8px',
              padding: '0.7rem 1.2rem',
              display: 'grid',
              gridTemplateColumns: '26px 1fr auto',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'default',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = borda
              e.currentTarget.style.borderLeftColor = '#3b82f6'
            }}
            >
              <span style={{ fontSize: '1rem' }}>{evento.icone}</span>
              <div>
                <span style={{ color: corMod, fontSize: '0.62rem', fontWeight: '600', letterSpacing: '1.5px' }}>
                  {evento.modalidade.toUpperCase()}
                </span>
                <p style={{ color: corTexto, fontWeight: '600', fontSize: '0.88rem', margin: '1px 0' }}>
                  {evento.nome}
                </p>
                <p style={{ color: corSub, fontSize: '0.73rem' }}>{evento.descricao_curta}</p>
              </div>
              <span style={{ color: '#3b82f6', fontSize: '0.78rem', fontWeight: '600', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                {formatarData(evento.data_evento)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LinhaDeTempo