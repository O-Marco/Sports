import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin'

const ABAS = [
  { id: 'hero',           label: 'Banner Hero', emoji: '🌟', tabela: 'hero_destaques' },
  { id: 'noticias',       label: 'Notícias',    emoji: '📰', tabela: 'noticias' },
  { id: 'placares',       label: 'Placares',    emoji: '🏟️', tabela: 'placares' },
  { id: 'eventos',        label: 'Eventos',     emoji: '🏆', tabela: 'eventos' },
  { id: 'linha_do_tempo', label: 'Calendário',  emoji: '📅', tabela: 'linha_do_tempo' },
  { id: 'trendings',      label: 'Trendings',   emoji: '🔥', tabela: 'trendings' },
]

const MODALIDADES = ['Futebol', 'Basquete', 'E-Sports', 'MMA', 'Atletismo']

// ── CAMPOS AUXILIARES (RESTAURADOS) ──────────────────────────────────────────

function Campo({ label, value, onChange, span, textarea, type = 'text' }) {
  const style = {
    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
    background: '#0d1f35', border: '1px solid #1e3a5f',
    borderRadius: '7px', color: '#e2e8f0', fontSize: '0.85rem',
    outline: 'none', resize: textarea ? 'vertical' : 'none',
    fontFamily: 'inherit', transition: 'border-color 0.2s',
  }
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <label style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
        {label}
      </label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={style}
            onFocus={e => e.target.style.borderColor = '#3b82f6'}
            onBlur={e => e.target.style.borderColor = '#1e3a5f'} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={style}
            onFocus={e => e.target.style.borderColor = '#3b82f6'}
            onBlur={e => e.target.style.borderColor = '#1e3a5f'} />
      }
    </div>
  )
}

function CampoSelect({ label, value, onChange, opcoes, span }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <label style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', padding: '9px 12px', boxSizing: 'border-box',
        background: '#0d1f35', border: '1px solid #1e3a5f',
        borderRadius: '7px', color: value ? '#e2e8f0' : '#475569',
        fontSize: '0.85rem', outline: 'none',
      }}>
        <option value="">Selecionar...</option>
        {opcoes.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function BotaoSalvar({ onClick, editando, labelCustom }) {
  return (
    <div style={{ gridColumn: 'span 2', paddingTop: '0.5rem', borderTop: '1px solid #1e3a5f', display: 'flex', justifyContent: 'flex-end' }}>
      <button onClick={onClick} style={{
        padding: '10px 28px', background: editando ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #1d4ed8, #2563eb)',
        border: 'none', borderRadius: '8px', color: 'white',
        fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(29,78,216,0.4)', transition: 'all 0.2s',
        letterSpacing: '0.3px',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(29,78,216,0.5)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(29,78,216,0.4)' }}
      >
        {labelCustom || (editando ? '✓ Salvar Alterações' : '+ Adicionar')}
      </button>
    </div>
  )
}

// ── FORMULÁRIOS ──────────────────────────────────────────────────────────────

function FormHero({ onSalvar }) {
  const [opcoes, setOpcoes] = useState([])
  const [selecionado, setSelecionado] = useState('')

  useEffect(() => {
    async function carregarTudo() {
      const [n, e, p] = await Promise.all([
        supabase.from('noticias').select('id, titulo'),
        supabase.from('eventos').select('id, nome'),
        supabase.from('placares').select('id, time_casa, time_visitante')
      ])
      const lista = [
        ...(n.data || []).map(i => ({ id: i.id, label: `📰 Notícia: ${i.titulo}`, tipo: 'noticias' })),
        ...(e.data || []).map(i => ({ id: i.id, label: `🏆 Evento: ${i.nome}`, tipo: 'eventos' })),
        ...(p.data || []).map(i => ({ id: i.id, label: `🏟️ Placar: ${i.time_casa} x ${i.time_visitante}`, tipo: 'placares' }))
      ]
      setOpcoes(lista)
    }
    carregarTudo()
  }, [])

  async function salvar() {
    if (!selecionado) return alert('Selecione um item')
    const item = opcoes.find(o => `${o.tipo}-${o.id}` === selecionado)
    const { error } = await supabase.from('hero_destaques').insert([{ tipo: item.tipo, item_id: item.id }])
    if (!error) onSalvar()
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
      <div style={{ gridColumn: 'span 2' }}>
        <label style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
          Conteúdo do Banco
        </label>
        <select value={selecionado} onChange={e => setSelecionado(e.target.value)} style={{
          width: '100%', padding: '9px 12px', background: '#0d1f35', border: '1px solid #1e3a5f',
          borderRadius: '7px', color: '#e2e8f0', fontSize: '0.85rem', outline: 'none',
        }}>
          <option value="">Escolher para destacar...</option>
          {opcoes.map(o => <option key={`${o.tipo}-${o.id}`} value={`${o.tipo}-${o.id}`}>{o.label}</option>)}
        </select>
      </div>
      <BotaoSalvar onClick={salvar} labelCustom="+ Vincular ao Hero" />
    </div>
  )
}

function FormNoticias({ onSalvar, itemEditando }) {
  const inicial = { titulo: '', resumo: '', categoria: '', modalidade: '', imagem_url: '', destaque: false }
  const [f, setF] = useState(inicial)
  useEffect(() => { if (itemEditando) setF(itemEditando); else setF(inicial); }, [itemEditando])
  const s = (k, val) => setF(p => ({ ...p, [k]: val }))
  async function salvar() {
    const { error } = f.id ? await supabase.from('noticias').update(f).eq('id', f.id) : await supabase.from('noticias').insert([{ ...f, criado_em: new Date().toISOString() }])
    if (!error) onSalvar()
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
      <Campo label="Título" value={f.titulo} onChange={v => s('titulo', v)} span={2} />
      <Campo label="Resumo" value={f.resumo} onChange={v => s('resumo', v)} span={2} textarea />
      <CampoSelect label="Categoria" value={f.categoria} onChange={v => s('categoria', v)} opcoes={['Transferência', 'Contratação', 'Resultado', 'Próximo Evento']} />
      <CampoSelect label="Modalidade" value={f.modalidade} onChange={v => s('modalidade', v)} opcoes={MODALIDADES} />
      <Campo label="URL da Imagem" value={f.imagem_url} onChange={v => s('imagem_url', v)} span={2} />
      <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="destaque" checked={f.destaque} onChange={e => s('destaque', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#3b82f6', cursor: 'pointer' }} />
        <label htmlFor="destaque" style={{ color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer' }}>Marcar como destaque</label>
      </div>
      <BotaoSalvar onClick={salvar} editando={!!f.id} />
    </div>
  )
}

function FormPlacares({ onSalvar, itemEditando }) {
  const inicial = { time_casa: '', time_visitante: '', gols_casa: 0, gols_visitante: 0, modalidade: '', status: 'ao vivo', minuto: '0', icone_casa: '', icone_visitante: '' }
  const [f, setF] = useState(inicial)
  useEffect(() => { if (itemEditando) setF(itemEditando); else setF(inicial); }, [itemEditando])
  const s = (k, val) => setF(p => ({ ...p, [k]: val }))
  async function salvar() {
    const { error } = f.id ? await supabase.from('placares').update(f).eq('id', f.id) : await supabase.from('placares').insert([f])
    if (!error) onSalvar()
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
      <Campo label="Time Casa" value={f.time_casa} onChange={v => s('time_casa', v)} />
      <Campo label="Time Visitante" value={f.time_visitante} onChange={v => s('time_visitante', v)} />
      <Campo label="Gols Casa" value={f.gols_casa} onChange={v => s('gols_casa', Number(v))} type="number" />
      <Campo label="Gols Visitante" value={f.gols_visitante} onChange={v => s('gols_visitante', Number(v))} type="number" />
      <CampoSelect label="Modalidade" value={f.modalidade} onChange={v => s('modalidade', v)} opcoes={MODALIDADES} />
      <CampoSelect label="Status" value={f.status} onChange={v => s('status', v)} opcoes={['ao vivo', 'encerrado']} />
      <Campo label="Minuto" value={f.minuto} onChange={v => s('minuto', v)} />
      <Campo label="Ícone Casa (emoji)" value={f.icone_casa} onChange={v => s('icone_casa', v)} />
      <BotaoSalvar onClick={salvar} editando={!!f.id} />
    </div>
  )
}

function FormEventos({ onSalvar, itemEditando }) {
  const inicial = { nome: '', modalidade: '', data_evento: '', descricao: '', icone_url: '', imagem_url: '', cor_destaque: '#3b82f6' }
  const [f, setF] = useState(inicial)
  useEffect(() => { if (itemEditando) setF(itemEditando); else setF(inicial); }, [itemEditando])
  const s = (k, val) => setF(p => ({ ...p, [k]: val }))
  async function salvar() {
    const { error } = f.id ? await supabase.from('eventos').update(f).eq('id', f.id) : await supabase.from('eventos').insert([f])
    if (!error) onSalvar()
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
      <Campo label="Nome" value={f.nome} onChange={v => s('nome', v)} span={2} />
      <CampoSelect label="Modalidade" value={f.modalidade} onChange={v => s('modalidade', v)} opcoes={MODALIDADES} />
      <Campo label="Data do Evento" value={f.data_evento} onChange={v => s('data_evento', v)} type="datetime-local" />
      <Campo label="Descrição" value={f.descricao} onChange={v => s('descricao', v)} span={2} textarea />
      <Campo label="URL da Imagem" value={f.imagem_url} onChange={v => s('imagem_url', v)} span={2} />
      <Campo label="Cor Destaque (hex)" value={f.cor_destaque} onChange={v => s('cor_destaque', v)} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-end', paddingBottom: '2px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: f.cor_destaque, border: '1px solid #1e3a5f' }} />
        <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Preview</span>
      </div>
      <BotaoSalvar onClick={salvar} editando={!!f.id} />
    </div>
  )
}

function FormLinhaDeTempo({ onSalvar, itemEditando }) {
  const inicial = { nome: '', modalidade: '', data_evento: '', icone: '', descricao_curta: '' }
  const [f, setF] = useState(inicial)
  useEffect(() => { if (itemEditando) setF(itemEditando); else setF(inicial); }, [itemEditando])
  const s = (k, val) => setF(p => ({ ...p, [k]: val }))
  async function salvar() {
    const { error } = f.id ? await supabase.from('linha_do_tempo').update(f).eq('id', f.id) : await supabase.from('linha_do_tempo').insert([f])
    if (!error) onSalvar()
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
      <Campo label="Nome" value={f.nome} onChange={v => s('nome', v)} span={2} />
      <CampoSelect label="Modalidade" value={f.modalidade} onChange={v => s('modalidade', v)} opcoes={MODALIDADES} />
      <Campo label="Data do Evento" value={f.data_evento} onChange={v => s('data_evento', v)} type="datetime-local" />
      <Campo label="Ícone (emoji)" value={f.icone} onChange={v => s('icone', v)} />
      <Campo label="Descrição Curta" value={f.descricao_curta} onChange={v => s('descricao_curta', v)} />
      <BotaoSalvar onClick={salvar} editando={!!f.id} />
    </div>
  )
}

function FormTrendings({ onSalvar, itemEditando }) {
  const inicial = { hashtag: '', resumo: '', modalidade: '', contagem: 0 }
  const [f, setF] = useState(inicial)
  useEffect(() => { if (itemEditando) setF(itemEditando); else setF(inicial); }, [itemEditando])
  const s = (k, val) => setF(p => ({ ...p, [k]: val }))
  async function salvar() {
    const { error } = f.id ? await supabase.from('trendings').update(f).eq('id', f.id) : await supabase.from('trendings').insert([f])
    if (!error) onSalvar()
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
      <Campo label="Hashtag" value={f.hashtag} onChange={v => s('hashtag', v)} />
      <Campo label="Contagem" value={f.contagem} onChange={v => s('contagem', Number(v))} type="number" />
      <CampoSelect label="Modalidade" value={f.modalidade} onChange={v => s('modalidade', v)} opcoes={MODALIDADES} />
      <Campo label="Resumo" value={f.resumo} onChange={v => s('resumo', v)} textarea />
      <BotaoSalvar onClick={salvar} editando={!!f.id} />
    </div>
  )
}

// ── PAINEL PRINCIPAL ─────────────────────────────────────────────────────────

function PainelAdmin() {
  const navigate = useNavigate()
  const [autorizado, setAutorizado] = useState(false)
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [abaAtiva, setAbaAtiva] = useState('noticias')
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [itemEditando, setItemEditando] = useState(null)

  const aba = ABAS.find(a => a.id === abaAtiva)

  async function buscar() {
    setCarregando(true)
    const { data } = await supabase.from(aba.tabela).select('*').order('id', { ascending: false }).limit(30)
    if (data) setDados(data)
    setCarregando(false)
  }

  useEffect(() => {
    if (autorizado) buscar()
  }, [abaAtiva, autorizado])

  async function deletar(id) {
    if (!confirm('Confirmar exclusão?')) return
    const { error } = await supabase.from(aba.tabela).delete().eq('id', id)
    if (!error) {
      setDados(prev => prev.filter(d => d.id !== id))
      toast('✅ Registro excluído!')
    } else toast('❌ Erro ao excluir.')
  }

  function toast(msg) {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  function handleLogin(e) {
    e.preventDefault()
    if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
      setAutorizado(true); setErro('')
    } else {
      setErro('Usuário ou senha incorretos.'); setSenha('')
    }
  }

  const formProps = {
    onSalvar: () => { buscar(); setMostrarForm(false); setItemEditando(null); toast('✅ Salvo com sucesso!') },
    itemEditando: itemEditando
  }

  if (!autorizado) return (
    <div style={{ minHeight: '100vh', background: '#030b15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#071120', border: '1px solid #1e3a5f', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(29,78,216,0.3)' }}>⚙️</div>
          <h2 style={{ color: '#f1f5f9', fontWeight: '900', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Painel Admin</h2>
          <p style={{ color: '#334155', fontSize: '0.82rem' }}>SportsDash — acesso restrito</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Campo label="Usuário" value={usuario} onChange={setUsuario} />
          <Campo label="Senha" value={senha} onChange={setSenha} type="password" />
          {erro && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '7px', padding: '9px 14px', color: '#f87171', fontSize: '0.8rem', textAlign: 'center' }}>{erro}</div>}
          <button type="submit" style={{ marginTop: '0.25rem', padding: '12px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', border: 'none', borderRadius: '9px', color: 'white', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(29,78,216,0.35)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>Entrar</button>
          <button type="button" onClick={() => navigate('/')} style={{ padding: '8px', background: 'none', border: 'none', color: '#334155', fontSize: '0.8rem', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#64748b'} onMouseLeave={e => e.currentTarget.style.color = '#334155'}>← Voltar ao site</button>
        </form>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#030b15', padding: '2rem' }}>
      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 99px; }
        @keyframes slideIn { from { transform: translateX(60px); opacity:0 } to { transform: translateX(0); opacity:1 } }
      `}</style>

      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>⚙️</div>
            <div>
              <h1 style={{ color: '#f1f5f9', fontSize: '1.3rem', fontWeight: '900', marginBottom: '1px' }}>Painel Admin</h1>
              <p style={{ color: '#334155', fontSize: '0.75rem' }}>SportsDash — gerenciamento de conteúdo</p>
            </div>
          </div>
          <button onClick={() => setAutorizado(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'none', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#475569', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3a5f'; e.currentTarget.style.color = '#475569' }}>
            Sair
          </button>
        </div>

        {/* Abas com grid de 6 colunas para caber o novo botão */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {ABAS.map(a => (
            <button key={a.id} onClick={() => { setAbaAtiva(a.id); setMostrarForm(false); setItemEditando(null); }} style={{
              background: abaAtiva === a.id ? 'linear-gradient(135deg, #0f2a4a, #1e3a5f)' : '#071120',
              border: `1px solid ${abaAtiva === a.id ? '#3b82f6' : '#1e3a5f'}`,
              borderRadius: '10px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
            }}
            onMouseEnter={e => { if (abaAtiva !== a.id) e.currentTarget.style.borderColor = '#2d4a6e' }} onMouseLeave={e => { if (abaAtiva !== a.id) e.currentTarget.style.borderColor = '#1e3a5f' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{a.emoji}</div>
              <div style={{ color: abaAtiva === a.id ? '#93c5fd' : '#475569', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{a.label}</div>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mostrarForm ? '1fr 420px' : '1fr', gap: '1.25rem', alignItems: 'start' }}>
          <div style={{ background: '#071120', border: '1px solid #1e3a5f', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #1e3a5f', background: '#060f1e' }}>
              <div>
                <span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '0.9rem' }}>{aba.emoji} {aba.label}</span>
                <span style={{ color: '#334155', fontSize: '0.78rem', marginLeft: '0.6rem' }}>{dados.length} registros</span>
              </div>
              <button onClick={() => { setMostrarForm(!mostrarForm); setItemEditando(null); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', background: mostrarForm ? 'none' : 'linear-gradient(135deg, #1d4ed8, #2563eb)', border: `1px solid ${mostrarForm ? '#1e3a5f' : 'transparent'}`, borderRadius: '7px', color: mostrarForm ? '#475569' : 'white', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                {mostrarForm ? '✕ Fechar' : '+ Novo registro'}
              </button>
            </div>

            {carregando ? <div style={{ textAlign: 'center', padding: '3rem', color: '#334155' }}>⏳ Carregando...</div> : dados.length === 0 ? <div style={{ textAlign: 'center', padding: '4rem', color: '#334155' }}>📭 Nenhum registro encontrado.</div> : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '0.6rem 1.25rem', borderBottom: '1px solid #0d1f35' }}>
                  <span style={{ color: '#1e3a5f', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Registro</span>
                  <span style={{ color: '#1e3a5f', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Ações</span>
                </div>
                {dados.map((item, i) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1.25rem', borderBottom: i < dados.length - 1 ? '1px solid #0d1f35' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#0a1a2e'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {item.imagem_url && <div style={{ width: '44px', height: '32px', flexShrink: 0, backgroundImage: `url(${item.imagem_url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '5px', border: '1px solid #1e3a5f' }}/>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#cbd5e1', fontWeight: '600', fontSize: '0.86rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px' }}>
                        {item.titulo || item.nome || item.hashtag || (item.time_casa && `${item.time_casa} vs ${item.time_visitante}`) || `ID: ${item.id}`}
                      </p>
                      <p style={{ color: '#334155', fontSize: '0.7rem' }}>{[item.modalidade, item.categoria, item.status].filter(Boolean).join(' · ')}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {abaAtiva !== 'hero' && <button onClick={() => { setItemEditando(item); setMostrarForm(true); }} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#3b82f6', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer' }}>Editar</button>}
                      <button onClick={() => deletar(item.id)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #1e3a5f', borderRadius: '6px', color: '#ef4444', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer' }}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {mostrarForm && (
            <div style={{ background: '#071120', border: '1px solid #1e3a5f', borderRadius: '12px', overflow: 'hidden', position: 'sticky', top: '20px' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e3a5f', background: '#060f1e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem' }}>{aba.emoji}</span>
                <p style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '0.88rem' }}>{itemEditando ? `Editar ${aba.label}` : `Novo ${aba.label}`}</p>
              </div>
              <div style={{ padding: '1.25rem' }}>
                {abaAtiva === 'hero' && <FormHero {...formProps} />}
                {abaAtiva === 'noticias' && <FormNoticias {...formProps} />}
                {abaAtiva === 'placares' && <FormPlacares {...formProps} />}
                {abaAtiva === 'eventos' && <FormEventos {...formProps} />}
                {abaAtiva === 'linha_do_tempo' && <FormLinhaDeTempo {...formProps} />}
                {abaAtiva === 'trendings' && <FormTrendings {...formProps} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: feedback.includes('✅') ? 'linear-gradient(135deg, #065f46, #047857)' : 'linear-gradient(135deg, #7f1d1d, #991b1b)', color: 'white', padding: '0.85rem 1.4rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 9999, animation: 'slideIn 0.3s ease' }}>
          {feedback}
        </div>
      )}
    </div>
  )
}

export default PainelAdmin;