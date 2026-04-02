import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'

// Função de utilidade para o cronômetro
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
  const [itens, setItens] = useState([])
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [tempo, setTempo] = useState({})
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    async function buscarDestaques() {
      // 1. Busca os IDs vinculados ao Hero
      const { data: vinculos } = await supabase
        .from('hero_destaques')
        .select('*')
        .order('ordem', { ascending: true })

      if (!vinculos) return

      // 2. Busca os dados reais de cada tabela
      const promessas = vinculos.map(async (v) => {
        const { data } = await supabase.from(v.tipo).select('*').eq('id', v.item_id).single()
        return data ? { ...data, tipo_origem: v.tipo } : null
      })

      const resultados = await Promise.all(promessas)
      setItens(resultados.filter(i => i !== null))
    }
    buscarDestaques()
  }, [])

  const proximoSlide = useCallback(() => {
    setFadeIn(false)
    setTimeout(() => {
      setIndiceAtual(i => (i + 1) % itens.length)
      setFadeIn(true)
    }, 500)
  }, [itens.length])

  useEffect(() => {
    if (itens.length <= 1) return
    const intervalo = setInterval(proximoSlide, 8000)
    return () => clearInterval(intervalo)
  }, [itens.length, proximoSlide])

  useEffect(() => {
    const item = itens[indiceAtual]
    if (!item || !item.data_evento) return
    const tick = setInterval(() => {
      setTempo(formatarTempo(item.data_evento))
    }, 1000)
    return () => clearInterval(tick)
  }, [itens, indiceAtual])

  if (itens.length === 0) return <div style={{ height: '520px', background: '#080f1a' }} />

  const item = itens[indiceAtual]
  const cor = item.cor_destaque || '#3b82f6'
  const mostrarCronometro = !!item.data_evento

  return (
    <div style={{ position: 'relative', width: '100%', height: '520px', overflow: 'hidden', background: '#080f1a' }}>
      
      {/* Imagem de Fundo com Transição */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${item.imagem_url})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transition: 'opacity 0.6s ease', opacity: fadeIn ? 1 : 0,
      }}/>

      {/* Overlay Gradiente */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}/>

      {/* Conteúdo do Texto */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 4rem 3.5rem', opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <p style={{ color: cor, fontSize: '0.75rem', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
          {item.modalidade} {item.tipo_origem === 'noticias' && '• NOTÍCIA'}
        </p>

        <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: '900', lineHeight: 1.1, marginBottom: '1rem', maxWidth: '900px' }}>
          {item.nome || item.titulo}
        </h1>

        <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '2rem', maxWidth: '700px', lineHeight: '1.5' }}>
          {item.descricao || item.resumo}
        </p>

        {mostrarCronometro && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 'bold', marginRight: '0.5rem' }}>COMEÇA EM</span>
            {['dias', 'hr', 'min', 'seg'].map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '6px', color: 'white', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.2rem' }}>
                  {Object.values(tempo)[i] || '00'}
                </div>
                {i < 3 && <span style={{ color: '#334155' }}>:</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bolinhas de navegação */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        right: '4rem', // Ajustado para alinhar com o padding do texto
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        zIndex: 10
      }}>
        {itens.map((_, i) => (
          <button
            key={i}
            onClick={() => { 
              if(i === indiceAtual) return;
              setFadeIn(false); 
              setTimeout(() => { setIndiceAtual(i); setFadeIn(true) }, 400) 
            }}
            style={{
              width: i === indiceAtual ? '32px' : '8px',
              height: '8px',
              borderRadius: '999px',
              background: i === indiceAtual ? 'white' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              padding: 0
            }}
            title={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
      
    </div>
  )
}

export default EventoDestaque