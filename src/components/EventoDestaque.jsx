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

  const proximoSlide = useCallback(() => {
    setFadeIn(false)
    setTimeout(() => {
      setIndiceAtual(i => (i + 1) % eventos.length)
      setFadeIn(true)
    }, 500)
  }, [eventos.length])

  useEffect(() => {
    if (eventos.length <= 1) return
    const intervalo = setInterval(proximoSlide, 6000)
    return () => clearInterval(intervalo)
  }, [eventos.length, proximoSlide])

  useEffect(() => {
    if (!eventos[indiceAtual]) return
    const tick = setInterval(() => {
      setTempo(formatarTempo(eventos[indiceAtual].data_evento))
    }, 1000)
    return () => clearInterval(tick)
  }, [eventos, indiceAtual])

  if (eventos.length === 0) return (
    <div style={{ height: '520px', background: '#080f1a' }} />
  )

  const evento = eventos[indiceAtual]
  const cor = evento.cor_destaque || '#3b82f6'

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '520px',
      overflow: 'hidden',
      background: '#080f1a',
    }}>
      {/* Imagem de fundo — full width */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${evento.imagem_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        transition: 'opacity 0.5s ease',
        opacity: fadeIn ? 1 : 0,
      }}/>

      {/* Overlay gradiente de baixo para cima — igual TNT */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.15) 100%)',
      }}/>

      {/* Conteúdo centralizado na parte de baixo */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '0 4rem 2.5rem',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        {/* Badge de modalidade */}
        <p style={{
          color: cor,
          fontSize: '0.75rem',
          fontWeight: '700',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '0.6rem',
        }}>
          {evento.modalidade}
        </p>

        {/* Título grande estilo TNT */}
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
          fontWeight: '900',
          lineHeight: 1.15,
          marginBottom: '0.5rem',
          maxWidth: '800px',
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}>
          {evento.nome}
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}>
          {evento.descricao}
        </p>

        {/* Cronômetro compacto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600', marginRight: '0.5rem', letterSpacing: '1px' }}>
            COMEÇA EM
          </span>
          {[
            { valor: tempo.dias,     label: 'dias' },
            { valor: tempo.horas,    label: 'hr' },
            { valor: tempo.minutos,  label: 'min' },
            { valor: tempo.segundos, label: 'seg' },
          ].map(({ valor, label }, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontFamily: 'monospace',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  color: 'white',
                  minWidth: '54px',
                  textAlign: 'center',
                }}>
                  {valor || '00'}
                </div>
                <div style={{ color: '#475569', fontSize: '0.62rem', marginTop: '3px' }}>
                  {label}
                </div>
              </div>
              {i < 3 && <span style={{ color: '#334155', fontSize: '1.2rem', marginBottom: '14px' }}>:</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Bolinhas de navegação */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        right: '2rem',
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
      }}>
        {eventos.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFadeIn(false); setTimeout(() => { setIndiceAtual(i); setFadeIn(true) }, 400) }}
            style={{
              width: i === indiceAtual ? '24px' : '6px',
              height: '6px',
              borderRadius: '999px',
              background: i === indiceAtual ? 'white' : 'rgba(255,255,255,0.3)',
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