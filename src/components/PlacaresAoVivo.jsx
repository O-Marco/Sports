import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import TituloSecao from './TituloSecao'

function PlacaresAoVivo({ temaEscuro }) {
  const [placares, setPlacares] = useState([])

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('placares')
        .select('*')
        .eq('status', 'ao vivo')
      if (data) setPlacares(data)
    }
    buscar()
    const i = setInterval(buscar, 30000)
    return () => clearInterval(i)
  }, [])

  const bgCard  = temaEscuro ? '#0d1625' : '#ffffff'
  const borda   = temaEscuro ? '#1e293b' : '#e2e8f0'
  const corTime = temaEscuro ? '#f1f5f9' : '#0f172a'
  const corMod  = temaEscuro ? '#64748b' : '#94a3b8'

  return (
    <div>
      <TituloSecao texto="Placares ao vivo" temaEscuro={temaEscuro} />
      <style>{`@keyframes piscar { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {placares.map(jogo => (
          <div key={jogo.id} style={{
            background: bgCard,
            borderRadius: '10px',
            border: `1px solid ${borda}`,
            overflow: 'hidden',
          }}>
            {/* Barra topo */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '5px 16px',
              borderBottom: `1px solid ${borda}`,
              background: temaEscuro ? '#0a1020' : '#f8fafc',
            }}>
              <span style={{ color: corMod, fontSize: '0.68rem', fontWeight: '600', letterSpacing: '1.5px' }}>
                {jogo.modalidade.toUpperCase()}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontSize: '0.68rem', fontWeight: '600' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'piscar 1s infinite' }}/>
                AO VIVO · {jogo.minuto}'
              </span>
            </div>

            {/* Placar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              padding: '14px 20px',
              gap: '1rem',
            }}>
              <span style={{ color: corTime, fontWeight: '600', fontSize: '0.95rem' }}>
                {jogo.time_casa}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 'bold', minWidth: '28px', textAlign: 'center' }}>
                  {jogo.gols_casa}
                </span>
                <span style={{ color: temaEscuro ? '#1e293b' : '#cbd5e1', fontSize: '1.2rem' }}>—</span>
                <span style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 'bold', minWidth: '28px', textAlign: 'center' }}>
                  {jogo.gols_visitante}
                </span>
              </div>
              <span style={{ color: corTime, fontWeight: '600', fontSize: '0.95rem', textAlign: 'right' }}>
                {jogo.time_visitante}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlacaresAoVivo