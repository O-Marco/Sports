function TituloSecao({ texto, temaEscuro }) {
  const cor = temaEscuro ? '#ffffff' : '#0f172a'
  const corLinha = temaEscuro ? '#1e293b' : '#e2e8f0'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem' }}>
      <h2 style={{
        color: cor,
        fontSize: '1rem',
        fontWeight: '600',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
      }}>
        {texto}
      </h2>
      <div style={{ flex: 1, height: '1px', background: corLinha }}/>
    </div>
  )
}

export default TituloSecao