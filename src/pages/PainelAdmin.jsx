import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const ABAS = [
  { id: 'noticias',       label: '📰 Notícias',   tabela: 'noticias' },
  { id: 'placares',       label: '🏟️ Placares',   tabela: 'placares' },
  { id: 'eventos',        label: '🏆 Eventos',     tabela: 'eventos' },
  { id: 'linha_do_tempo', label: '📅 Calendário',  tabela: 'linha_do_tempo' },
  { id: 'trendings',      label: '🔥 Trendings',   tabela: 'trendings' },
]

function PainelAdmin({ temaEscuro }) {
  const [abaAtiva, setAbaAtiva] = useState('noticias')
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const aba = ABAS.find(a => a.id === abaAtiva)

  useEffect(() => {
    async function buscar() {
      setCarregando(true)
      const { data } = await supabase.from(aba.tabela).select('*').order('id', { ascending: false }).limit(20)
      if (data) setDados(data)
      setCarregando(false)
    }
    buscar()
  }, [abaAtiva])

  async function deletar(id) {
    if (!confirm('Confirmar exclusão?')) return
    const { error } = await supabase.from(aba.tabela).delete().eq('id', id)
    if (!error) {
      setDados(prev => prev.filter(d => d.id !== id))
      mostrarFeedback('✅ Registro excluído!')
    } else {
      mostrarFeedback('❌ Erro ao excluir.')
    }
  }

  function mostrarFeedback(msg) {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  const bgCard   = temaEscuro ? '#0d1625' : '#ffffff'
  const borda    = temaEscuro ? '#1e293b' : '#e2e8f0'
  const corTexto = temaEscuro ? '#f1f5f9' : '#0f172a'
  const corSub   = temaEscuro ? '#64748b' : '#94a3b8'
  const bgAba    = temaEscuro ? '#0a1020' : '#f1f5f9'

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: temaEscuro ? '#f1f5f9' : '#0f172a', fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.25rem' }}>⚙️ Painel Admin</h1>
        <p style={{ color: corSub, fontSize: '0.9rem' }}>Gerenciar conteúdo do SportsDash</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {ABAS.map(a => (
          <button key={a.id} onClick={() => setAbaAtiva(a.id)} style={{
            padding: '8px 18px', borderRadius: '8px',
            border: `1px solid ${abaAtiva === a.id ? '#1d4ed8' : borda}`,
            background: abaAtiva === a.id ? '#1d4ed8' : bgAba,
            color: abaAtiva === a.id ? 'white' : corSub,
            fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
          }}>{a.label}</button>
        ))}
      </div>

      {carregando ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: corSub }}>Carregando...</div>
      ) : dados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: corSub }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
          Nenhum registro encontrado.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {dados.map(item => (
            <div key={item.id} style={{ background: bgCard, border: `1px solid ${borda}`, borderRadius: '8px', padding: '0.85rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: corTexto, fontWeight: '600', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.titulo || item.nome || item.hashtag || item.time_casa || `ID ${item.id}`}
                </p>
                <p style={{ color: corSub, fontSize: '0.72rem', marginTop: '2px' }}>
                  {item.modalidade && `${item.modalidade} · `}
                  {item.categoria && `${item.categoria} · `}
                  {item.status && `${item.status} · `}
                  ID: {item.id}
                  {item.criado_em && ` · ${new Date(item.criado_em).toLocaleDateString('pt-BR')}`}
                  {item.data_evento && ` · ${new Date(item.data_evento).toLocaleDateString('pt-BR')}`}
                </p>
              </div>
              {item.imagem_url && (
                <div style={{ width: '52px', height: '36px', flexShrink: 0, backgroundImage: `url(${item.imagem_url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '5px', border: `1px solid ${borda}` }}/>
              )}
              <button onClick={() => deletar(item.id)}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '5px 14px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444' }}
              >Excluir</button>
            </div>
          ))}
        </div>
      )}

      {feedback && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#1d4ed8', color: 'white', padding: '0.75rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', boxShadow: '0 8px 32px rgba(29,78,216,0.4)', zIndex: 9999 }}>
          {feedback}
        </div>
      )}
    </div>
  )
}

export default PainelAdmin