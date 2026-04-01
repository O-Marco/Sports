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

function diasAte(dataString) {
  const diff = new Date(dataString) - new Date()
  const dias = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (dias === 0) return 'Hoje'
  if (dias === 1) return 'Amanhã'
  return `Em ${dias} dias`
}

function PaginaCalendario({ temaEscuro }) {
  const [eventos, setEventos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [mesAtivo, setMesAtivo] = useState(null)

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('linha_do_tempo')
        .select('*')
        .gt('data_evento', new Date().toISOString())
        .order('data_evento', { ascending: true })
      if (data) {
        setEventos(data)
        if (data.length > 0) {
          const primMes = new Date(data[0].data_evento).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
          setMesAtivo(primMes)
        }
      }
    }
    buscar()
  }, [])

  const modalidades = ['Todos', ...new Set(eventos.map(e => e.modalidade).filter(Boolean))]
  const filtrados = eventos.filter(e => filtro === 'Todos' || e.modalidade === filtro)

  const porMes = filtrados.reduce((acc, ev) => {
    const mes = new Date(ev.data_evento).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    if (!acc[mes]) acc[mes] = []
    acc[mes].push(ev)
    return acc
  }, {})

  const bgCard   = temaEscuro ? '#0d1625' : '#ffffff'
  const borda    = temaEscuro ? '#1e293b' : '#e2e8f0'
  const corTexto = temaEscuro ? '#f1f5f9' : '#0f172a'
  const corSub   = temaEscuro ? '#475569' : '#94a3b8'
  const bgFiltro = temaEscuro ? '#0d1625' : '#ffffff'
  const bgMes    = temaEscuro ? '#0a1020' : '#f8fafc'

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: temaEscuro ? '#f1f5f9' : '#0f172a', fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.25rem' }}>
          📅 Calendário
        </h1>
        <p style={{ color: corSub, fontSize: '0.9rem' }}>{filtrados.length} eventos programados</p>
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

      {Object.entries(porMes).map(([mes, evs]) => (
        <div key={mes} style={{ marginBottom: '2rem' }}>
          <div
            onClick={() => setMesAtivo(mesAtivo === mes ? null : mes)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: bgMes, border: `1px solid ${borda}`,
              borderRadius: '10px', padding: '0.75rem 1.2rem',
              cursor: 'pointer', marginBottom: '0.5rem', userSelect: 'none',
            }}
          >
            <span style={{ color: corTexto, fontWeight: '700', fontSize: '0.95rem', textTransform: 'capitalize' }}>
              📆 {mes}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ background: '#1d4ed8', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700' }}>
                {evs.length} evento{evs.length > 1 ? 's' : ''}
              </span>
              <span style={{ color: corSub, fontSize: '0.7rem', display: 'inline-block', transform: mesAtivo === mes ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
            </div>
          </div>

          {mesAtivo === mes && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {evs.map((evento, i) => {
                const dt = formatarData(evento.data_evento)
                const prazo = diasAte(evento.data_evento)
                const urgente = prazo === 'Hoje' || prazo === 'Amanhã'
                return (
                  <div key={i} style={{
                    background: bgCard, border: `1px solid ${borda}`,
                    borderLeft: `3px solid ${urgente ? '#ef4444' : '#3b82f6'}`,
                    borderRadius: '8px', padding: '0.9rem 1.2rem',
                    display: 'grid', gridTemplateColumns: '64px 1fr auto',
                    alignItems: 'center', gap: '1rem',
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: corSub, fontSize: '0.62rem', fontWeight: '700', letterSpacing: '1px' }}>{dt.diaSemana}</div>
                      <div style={{ color: corTexto, fontSize: '1.5rem', fontWeight: '900', lineHeight: 1 }}>{dt.dia}</div>
                      <div style={{ color: '#3b82f6', fontSize: '0.65rem', fontWeight: '700' }}>{dt.mes}</div>
                    </div>
                    <div>
                      <span style={{ color: corSub, fontSize: '0.62rem', fontWeight: '600', letterSpacing: '1.5px' }}>
                        {evento.icone} {evento.modalidade?.toUpperCase()}
                      </span>
                      <p style={{ color: corTexto, fontWeight: '700', fontSize: '0.92rem', margin: '2px 0' }}>{evento.nome}</p>
                      <p style={{ color: corSub, fontSize: '0.75rem' }}>🕐 {dt.hora} · {evento.descricao_curta}</p>
                    </div>
                    <div style={{
                      background: urgente ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)',
                      border: `1px solid ${urgente ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.2)'}`,
                      borderRadius: '8px', padding: '6px 14px', textAlign: 'center', whiteSpace: 'nowrap',
                    }}>
                      <div style={{ color: urgente ? '#ef4444' : '#3b82f6', fontSize: '0.72rem', fontWeight: '700' }}>{prazo}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}

      {filtrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: corSub }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <p>Nenhum evento encontrado.</p>
        </div>
      )}
    </div>
  )
}

export default PaginaCalendario