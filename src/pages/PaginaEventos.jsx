import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function formatarData(dataString) {
  const d = new Date(dataString)
  return {
    diaSemana: d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', ''),
    dia: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
    mes: d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', ''),
    hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  }
}

function formatarTempo(dataString) {
  const diferenca = new Date(dataString) - new Date()
  if (diferenca <= 0) return null
  return {
    dias:    String(Math.floor(diferenca / (1000 * 60 * 60 * 24))).padStart(2, '0'),
    horas:   String(Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
    minutos: String(Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
  }
}

function PaginaEventos({ temaEscuro }) {
  const [eventos, setEventos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [tempos, setTempos] = useState({})

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('eventos')
        .select('*')
        .gt('data_evento', new Date().toISOString())
        .order('data_evento', { ascending: true })
      if (data) setEventos(data)
    }
    buscar()
  }, [])

  useEffect(() => {
    const tick = setInterval(() => {
      const novos = {}
      eventos.forEach(ev => { novos[ev.id] = formatarTempo(ev.data_evento) })
      setTempos(novos)
    }, 1000)
    return () => clearInterval(tick)
  }, [eventos])

  const modalidades = ['Todos', ...new Set(eventos.map(e => e.modalidade).filter(Boolean))]
  const filtrados = filtro === 'Todos' ? eventos : eventos.filter(e => e.modalidade === filtro)

  const bgCard  = temaEscuro ? '#0d1625' : '#ffffff'
  const borda   = temaEscuro ? '#1e293b' : '#e2e8f0'
  const corTexto = temaEscuro ? '#f1f5f9' : '#0f172a'
  const corSub  = temaEscuro ? '#475569' : '#94a3b8'
  const bgFiltro = temaEscuro ? '#0d1625' : '#ffffff'

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: temaEscuro ? '#f1f5f9' : '#0f172a', fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.25rem' }}>
          🏆 Eventos
        </h1>
        <p style={{ color: corSub, fontSize: '0.9rem' }}>{filtrados.length} eventos futuros</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {modalidades.map(m => (
          <button key={m} onClick={() => setFiltro(m)} style={{
            padding: '6px 16px', borderRadius: '20px',
            border: `1px solid ${filtro === m ? '#1d4ed8' : borda}`,
            background: filtro === m ? '#1d4ed8' : bgFiltro,
            color: filtro === m ? 'white' : corSub,
            fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
          }}>{m}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
        {filtrados.map(evento => {
          const dt = formatarData(evento.data_evento)
          const tempo = tempos[evento.id]
          const cor = evento.cor_destaque || '#3b82f6'
          return (
            <div key={evento.id} style={{
              background: bgCard, border: `1px solid ${borda}`,
              borderRadius: '12px', overflow: 'hidden',
              transition: 'border-color 0.2s', cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = cor}
            onMouseLeave={e => e.currentTarget.style.borderColor = borda}
            >
              {evento.imagem_url && (
                <div style={{ height: '180px', backgroundImage: `url(${evento.imagem_url})`, backgroundSize: 'cover', backgroundPosition: 'center top', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}/>
                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem' }}>
                    <span style={{ color: cor, fontSize: '0.68rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{evento.modalidade}</span>
                  </div>
                </div>
              )}
              <div style={{ padding: '1.2rem' }}>
                <h3 style={{ color: corTexto, fontWeight: '800', fontSize: '1rem', marginBottom: '0.4rem', lineHeight: 1.3 }}>{evento.nome}</h3>
                <p style={{ color: corSub, fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.5 }}>{evento.descricao}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem' }}>📅</span>
                  <span style={{ color: corSub, fontSize: '0.8rem' }}>{dt.diaSemana}, {dt.dia} {dt.mes} · {dt.hora}</span>
                </div>
                {tempo && (
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', borderTop: `1px solid ${borda}`, paddingTop: '0.75rem' }}>
                    <span style={{ color: corSub, fontSize: '0.65rem', fontWeight: '600', letterSpacing: '1px', marginRight: '0.25rem' }}>COMEÇA EM</span>
                    {[{ v: tempo.dias, l: 'dias' }, { v: tempo.horas, l: 'hr' }, { v: tempo.minutos, l: 'min' }].map(({ v, l }, i) => (
                      <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px', padding: '3px 10px', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold', color: cor, minWidth: '40px', textAlign: 'center' }}>{v}</div>
                          <div style={{ color: corSub, fontSize: '0.55rem', marginTop: '2px' }}>{l}</div>
                        </div>
                        {i < 2 && <span style={{ color: corSub, fontSize: '0.9rem', marginBottom: '10px' }}>:</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: corSub }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <p>Nenhum evento encontrado.</p>
        </div>
      )}
    </div>
  )
}

export default PaginaEventos