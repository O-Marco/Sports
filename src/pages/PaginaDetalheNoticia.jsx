import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const coresCategorias = {
  'Transferência': '#dc2626',
  'Contratação':   '#7c3aed',
  'Resultado':     '#059669',
  'Próximo Evento':'#d97706',
}
const icones = { Futebol: '⚽', Basquete: '🏀', 'E-Sports': '🎮', MMA: '🥊', Atletismo: '🏃' }

function PaginaDetalheNoticia({ temaEscuro }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [noticia, setNoticia] = useState(null)
  const [relacionadas, setRelacionadas] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscar() {
      setCarregando(true)
      const { data } = await supabase.from('noticias').select('*').eq('id', id).single()
      if (data) {
        setNoticia(data)
        const { data: rel } = await supabase.from('noticias').select('*').eq('modalidade', data.modalidade).neq('id', id).order('criado_em', { ascending: false }).limit(3)
        if (rel) setRelacionadas(rel)
      }
      setCarregando(false)
    }
    buscar()
  }, [id])

  const corTexto = temaEscuro ? '#f1f5f9' : '#0f172a'
  const corSub   = temaEscuro ? '#64748b' : '#94a3b8'
  const bgCard   = temaEscuro ? '#0d1625' : '#ffffff'
  const borda    = temaEscuro ? '#1e293b' : '#e2e8f0'

  if (carregando) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: corSub }}>Carregando...</div>
  )

  if (!noticia) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: corSub }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
      <p>Notícia não encontrada.</p>
      <button onClick={() => navigate('/noticias')} style={{ marginTop: '1rem', padding: '8px 20px', borderRadius: '8px', background: '#1d4ed8', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
        Voltar para notícias
      </button>
    </div>
  )

  const corCat = coresCategorias[noticia.categoria] || '#475569'
  const dataFormatada = new Date(noticia.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem' }}>
      <button onClick={() => navigate('/noticias')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: corSub, fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem', padding: 0 }}>
        ← Voltar para notícias
      </button>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        <span style={{ background: corCat, color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 'bold', letterSpacing: '1px' }}>{noticia.categoria?.toUpperCase()}</span>
        <span style={{ color: corSub, fontSize: '0.82rem' }}>{icones[noticia.modalidade]} {noticia.modalidade}</span>
      </div>

      <h1 style={{ color: corTexto, fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '900', lineHeight: 1.25, marginBottom: '0.75rem' }}>{noticia.titulo}</h1>
      <p style={{ color: corSub, fontSize: '0.82rem', marginBottom: '1.5rem' }}>🕐 {dataFormatada}</p>

      {noticia.imagem_url && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', height: '360px', backgroundImage: `url(${noticia.imagem_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}/>
      )}

      {noticia.resumo && (
        <p style={{ color: temaEscuro ? '#94a3b8' : '#475569', fontSize: '1.1rem', lineHeight: 1.7, borderLeft: `3px solid ${corCat}`, paddingLeft: '1.2rem', marginBottom: '2rem', fontStyle: 'italic' }}>
          {noticia.resumo}
        </p>
      )}

      {noticia.conteudo && (
        <div style={{ color: corTexto, fontSize: '0.95rem', lineHeight: 1.9, borderTop: `1px solid ${borda}`, paddingTop: '1.5rem', marginBottom: '2.5rem', whiteSpace: 'pre-wrap' }}>
          {noticia.conteudo}
        </div>
      )}

      {relacionadas.length > 0 && (
        <div style={{ borderTop: `1px solid ${borda}`, paddingTop: '2rem' }}>
          <h2 style={{ color: corTexto, fontSize: '1rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Relacionadas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {relacionadas.map(n => (
              <div key={n.id} onClick={() => navigate(`/noticias/${n.id}`)}
                style={{ background: bgCard, border: `1px solid ${borda}`, borderRadius: '10px', padding: '0.8rem 1rem', cursor: 'pointer', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.75rem', overflow: 'hidden', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                onMouseLeave={e => e.currentTarget.style.borderColor = borda}
              >
                {n.imagem_url && <div style={{ backgroundImage: `url(${n.imagem_url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '6px' }}/>}
                <div>
                  <span style={{ background: coresCategorias[n.categoria] || '#475569', color: 'white', padding: '2px 7px', borderRadius: '3px', fontSize: '0.58rem', fontWeight: 'bold', letterSpacing: '1px', display: 'inline-block', marginBottom: '0.3rem' }}>{n.categoria?.toUpperCase()}</span>
                  <p style={{ color: corTexto, fontSize: '0.85rem', fontWeight: '600', lineHeight: 1.4 }}>{n.titulo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PaginaDetalheNoticia