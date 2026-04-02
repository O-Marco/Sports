import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const COLORS = {
  bg: '#030b15',
  card: '#071120',
  border: '#1e3a5f',
  accent: '#3b82f6',
  text: '#f1f5f9',
  textMuted: '#64748b',
  dayBg: '#0d1f35'
}

function PaginaCalendario() {
  const [eventos, setEventos] = useState([])
  const [dataNavegacao, setDataNavegacao] = useState(new Date())
  const [diaSelecionado, setDiaSelecionado] = useState(new Date().getDate())

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase.from('linha_do_tempo').select('*')
      if (data) setEventos(data)
    }
    buscar()
  }, [])

  const ano = dataNavegacao.getFullYear()
  const mes = dataNavegacao.getMonth()
  const nomeMes = dataNavegacao.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()
  
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay()
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()

  const navegarMes = (offset) => {
    setDataNavegacao(new Date(ano, mes + offset, 1))
    setDiaSelecionado(null)
  }

  const eventosDoDia = eventos.filter(ev => {
    const d = new Date(ev.data_evento)
    return d.getDate() === diaSelecionado && d.getMonth() === mes && d.getFullYear() === ano
  })

  return (
    <div style={{ 
      background: COLORS.bg, 
      minHeight: '100vh', 
      width: '100%', 
      margin: 0, 
      padding: '30px 20px', // Reduzi o padding superior
      boxSizing: 'border-box' 
    }}>
      {/* Container Principal um pouco mais estreito (1200px) para não espalhar tanto */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.1fr 0.9fr', // Proporção mais equilibrada entre os dois lados
          gap: '25px',
          alignItems: 'start'
        }}>
          
          {/* LADO ESQUERDO: CALENDÁRIO COMPACTO */}
          <div style={{ 
            background: COLORS.card, 
            borderRadius: '16px', 
            padding: '25px', // Reduzi o padding interno do card
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: COLORS.text, margin: 0 }}>
                {nomeMes} <span style={{ color: COLORS.accent }}>{ano}</span>
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => navegarMes(-1)} style={btnStyle}>{'<'}</button>
                <button onClick={() => navegarMes(1)} style={btnStyle}>{'>'}</button>
                <button onClick={() => {setDataNavegacao(new Date()); setDiaSelecionado(new Date().getDate())}} 
                  style={{...btnStyle, width: 'auto', padding: '0 15px', background: COLORS.accent, border: 'none'}}>HOJE</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
              {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(d => (
                <div key={d} style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: '0.75rem', fontWeight: '800', paddingBottom: '8px' }}>{d}</div>
              ))}
              
              {Array.from({ length: primeiroDiaSemana }).map((_, i) => <div key={`empty-${i}`} />)}

              {Array.from({ length: diasNoMes }).map((_, i) => {
                const dia = i + 1
                const temEvento = eventos.some(ev => {
                  const d = new Date(ev.data_evento)
                  return d.getDate() === dia && d.getMonth() === mes && d.getFullYear() === ano
                })
                const isSelecionado = diaSelecionado === dia

                return (
                  <div key={dia} onClick={() => setDiaSelecionado(dia)}
                    style={{
                      height: '70px', // DIMINUÍDO: De 100px para 70px
                      borderRadius: '10px', 
                      cursor: 'pointer',
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: isSelecionado ? COLORS.accent : COLORS.dayBg,
                      border: `1px solid ${isSelecionado ? COLORS.accent : COLORS.border}`,
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <span style={{ fontWeight: '800', fontSize: '1.3rem', color: COLORS.text }}>{dia}</span>
                    {temEvento && !isSelecionado && (
                      <div style={{ 
                        width: '6px', // DIMINUÍDO: De 8px para 6px
                        height: '6px', 
                        background: COLORS.accent, 
                        borderRadius: '50%', 
                        marginTop: '4px', 
                        boxShadow: `0 0 8px ${COLORS.accent}` 
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* LADO DIREITO: LISTA DE EVENTOS */}
          <div style={{ 
            background: COLORS.card, 
            borderRadius: '16px', 
            padding: '25px', 
            border: `1px solid ${COLORS.border}`,
            position: 'sticky',
            top: '30px'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', fontSize: '1rem', fontWeight: '900', 
              color: COLORS.text, borderBottom: `1px solid ${COLORS.border}`, 
              paddingBottom: '12px', textTransform: 'uppercase'
            }}>
              📅 Eventos <span style={{ color: COLORS.accent }}>• {diaSelecionado} {nomeMes.substring(0, 3)}</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {eventosDoDia.length > 0 ? eventosDoDia.map((ev, i) => (
                <div key={i} style={{ 
                  background: COLORS.dayBg, padding: '12px', borderRadius: '10px', 
                  borderLeft: `4px solid ${COLORS.accent}`,
                  display: 'flex', gap: '12px', alignItems: 'center'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{ev.icone || '🏆'}</span>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: COLORS.accent, fontWeight: 'bold' }}>{ev.modalidade}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: COLORS.text }}>{ev.nome}</div>
                    <div style={{ fontSize: '0.8rem', color: COLORS.textMuted }}>{ev.descricao_curta}</div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <p style={{ color: COLORS.textMuted, fontSize: '0.85rem' }}>Nenhum evento.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <style>{`
        body, html { margin: 0 !important; padding: 0 !important; background-color: #030b15 !important; }
        footer { display: none !important; }
      `}</style>
    </div>
  )
}

const btnStyle = {
  background: '#0d1f35', border: '1px solid #1e3a5f', color: 'white', minWidth: '35px', height: '35px', 
  borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', fontSize: '0.9rem'
}

export default PaginaCalendario