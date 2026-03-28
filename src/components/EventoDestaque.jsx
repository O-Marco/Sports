import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'

function formatarTempo(dataString) {
  const agora = new Date()
  const alvo = new Date(dataString)
  const diferenca = alvo - agora

  if (diferenca <= 0) return { dias: '00', horas: '00', minutos: '00', segundos: '00' }

  return {
    dias:     String(Math.floor(diferenca / (1000 * 60 * 60 * 24))).padStart(2, '0'),
    horas:    String(Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
    minutos:  String(Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
    segundos: String(Math.floor((diferenca % (1000 * 60)) / 1000)).padStart(2, '0'),
  }
}

function EventoDestaque() {
  const [eventos, setEventos] = useState([])
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [tempo, setTempo] = useState({})
  const [fadeIn, setFadeIn] = useState(true)

  // Busca todos os eventos futuros
  useEffect(() => {
    async function buscarEventos() {
      const { data } = await supabase
        .from('eventos')
        .select('*')
        .gt('data_evento', new Date().toISOString())
        .order('data_evento', { ascending: true })

      if (data) setEventos(data)
    }
    buscarEventos()
  }, [])

  // Troca o slide a cada 5 segundos com animação de fade
  const proximoSlide = useCallback(() => {
    setFadeIn(false)
    setTimeout(() => {
      setIndiceAtual(i => (i + 1) % eventos.length)
      setFadeIn(true)
    }, 400)
  }, [eventos.length])

  useEffect(() => {
    if (eventos.length <= 1) return
    const intervalo = setInterval(proximoSlide, 5000)
    return () => clearInterval(intervalo)
  }, [eventos.length, proximoSlide])

  // Atualiza o cronômetro a cada segundo
  useEffect(() => {
    if (!eventos[indiceAtual]) return
    const tick = setInterval(() => {
      setTempo(formatarTempo(eventos[indiceAtual].data_evento))
    }, 1000)
    return () => clearInterval(tick)
  }, [eventos, indiceAtual])

  if (eventos.length === 0) return (
    <div style={{ height: '340px', background: '#0a1628', borderRadius: '12px' }} />
  )

  const evento = eventos[indiceAtual]
  const cor = evento.cor_destaque || '#38bdf8'

  return (
    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '340px' }}>

      {/* Imagem de fundo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${evento.imagem_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.4s ease',
        opacity: fadeIn ? 1 : 0,
      }}/>

      {/* Overlay escuro para legibilidade */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(4,13,24,0.95) 40%, rgba(4,13,24,0.5) 100%)',
      }}/>

      {/* Conteúdo */}
      <div style={{
        position: 'relative',
        height: '100%',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        {/* Badge */}
        <span style={{
          display: 'inline-block',
          background: cor + '33',
          color: cor,
          border: `1px solid ${cor}66`,
          padding: '4px 14px',
          borderRadius: '999px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          letterSpacing: '2px',
          marginBottom: '1rem',
          width: 'fit-content'
        }}>
          EVENTO PRINCIPAL · {evento.modalidade?.toUpperCase()}
        </span>

        {/* Título */}
        <h2 style={{
          color: 'white',
          fontSize: '2.2rem',
          fontWeight: 'bold',
          lineHeight: 1.2,
          marginBottom: '0.5rem',
          maxWidth: '500px'
        }}>
          {evento.nome}
        </h2>

        <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {evento.descricao}
        </p>

        {/* Cronômetro estilo Lance! */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          {[
            { valor: tempo.dias,     label: 'dias' },
            { valor: tempo.horas,    label: 'hr' },
            { valor: tempo.minutos,  label: 'min' },
            { valor: tempo.segundos, label: 'seg' },
          ].map(({ valor, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                background: '#040d18cc',
                border: `1px solid ${cor}44`,
                borderRadius: '8px',
                padding: '8px 16px',
                fontFamily: 'monospace',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: cor,
                minWidth: '64px'
              }}>
                {valor || '00'}
              </div>
              <div style={{ color: '#475569', fontSize: '0.7rem', marginTop: '4px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores de slide (bolinhas) */}
      <div style={{
        position: 'absolute',
        bottom: '1.2rem',
        right: '1.5rem',
        display: 'flex',
        gap: '6px'
      }}>
        {eventos.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFadeIn(false); setTimeout(() => { setIndiceAtual(i); setFadeIn(true) }, 400) }}
            style={{
              width: i === indiceAtual ? '20px' : '6px',
              height: '6px',
              borderRadius: '999px',
              background: i === indiceAtual ? cor : '#334155',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default EventoDestaque