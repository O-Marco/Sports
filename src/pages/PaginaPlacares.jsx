// src/pages/PaginaPlacares.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import TituloSecao from '../components/TituloSecao'

function PaginaPlacares({ temaEscuro }) {
  const [placares, setPlacares] = useState([])
  const [filtro, setFiltro] = useState('Todos')

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('placares')
        .select('*')
        .order('minuto', { ascending: false })
      if (data) setPlacares(data)
    }
    buscar()
    const i = setInterval(buscar, 30000)
    return () => clearInterval(i)
  }, [])

  const modalidades = ['Todos', ...new Set(placares.map(p => p.modalidade))]
  const filtrados = filtro === 'Todos' ? placares : placares.filter(p => p.modalidade === filtro)
  const aoVivo = filtrados.filter(p => p.status === 'ao vivo')
  const encerrados = filtrados.filter(p => p.status !== 'ao vivo')

  const bgCard  = temaEscuro ? '#0d1625' : '#ffffff'
  const borda   = temaEscuro ? '#1e293b' : '#e2e8f0'
  const corTime = temaEscuro ? '#f1f5f9' : '#0f172a'
  const corMod  = temaEscuro ? '#64748b' : '#94a3b8'
  const bgFiltro = temaEscuro ? '#0d1625' : '#ffffff'
  const bgFiltroAtivo = '#1d4ed8'

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <style>{`@keyframes piscar { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: temaEscuro ? '#f1f5f9' : '#0f172a', fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.25rem' }}>
          🏟️ Placares
        </h1>
        <p style={{ color: corMod, fontSize: '0.9rem' }}>Resultados ao vivo e encerrados</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {modalidades.map(m => (
          <button key={m} onClick={() => setFiltro(m)} style={{
            padding: '6px 16px', borderRadius: '20px',
            border: `1px solid ${filtro === m ? bgFiltroAtivo : borda}`,
            background: filtro === m ? bgFiltroAtivo : bgFiltro,
            color: filtro === m ? 'white' : corMod,
            fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
          }}>{m}</button>
        ))}
      </div>

      {aoVivo.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <TituloSecao texto="Ao vivo" temaEscuro={temaEscuro} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {aoVivo.map(jogo => (
              <CardJogo key={jogo.id} jogo={jogo} temaEscuro={temaEscuro} bgCard={bgCard} borda={borda} corTime={corTime} corMod={corMod} aoVivo />
            ))}
          </div>
        </div>
      )}

      {encerrados.length > 0 && (
        <div>
          <TituloSecao texto="Encerrados" temaEscuro={temaEscuro} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {encerrados.map(jogo => (
              <CardJogo key={jogo.id} jogo={jogo} temaEscuro={temaEscuro} bgCard={bgCard} borda={borda} corTime={corTime} corMod={corMod} />
            ))}
          </div>
        </div>
      )}

      {filtrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: corMod }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏟️</div>
          <p>Nenhum jogo encontrado.</p>
        </div>
      )}
    </div>
  )
}

function CardJogo({ jogo, temaEscuro, bgCard, borda, corTime, corMod, aoVivo }) {
  return (
    <div style={{ background: bgCard, borderRadius: '10px', border: `1px solid ${aoVivo ? 'rgba(239,68,68,0.3)' : borda}`, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 16px', borderBottom: `1px solid ${borda}`, background: temaEscuro ? '#0a1020' : '#f8fafc' }}>
        <span style={{ color: corMod, fontSize: '0.68rem', fontWeight: '600', letterSpacing: '1.5px' }}>{jogo.modalidade?.toUpperCase()}</span>
        {aoVivo ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontSize: '0.68rem', fontWeight: '600' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'piscar 1s infinite' }}/>
            AO VIVO · {jogo.minuto}'
          </span>
        ) : (
          <span style={{ color: corMod, fontSize: '0.68rem', fontWeight: '600' }}>ENCERRADO</span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '14px 20px', gap: '1rem' }}>
        <span style={{ color: corTime, fontWeight: '600', fontSize: '0.95rem' }}>{jogo.time_casa}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 'bold', minWidth: '28px', textAlign: 'center' }}>{jogo.gols_casa}</span>
          <span style={{ color: temaEscuro ? '#1e293b' : '#cbd5e1', fontSize: '1.2rem' }}>—</span>
          <span style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 'bold', minWidth: '28px', textAlign: 'center' }}>{jogo.gols_visitante}</span>
        </div>
        <span style={{ color: corTime, fontWeight: '600', fontSize: '0.95rem', textAlign: 'right' }}>{jogo.time_visitante}</span>
      </div>
    </div>
  )
}

export default PaginaPlacares