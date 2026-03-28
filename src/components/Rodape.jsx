import React from 'react';

function Rodape() {
  // Cores fixas para o modo escuro, ignorando o "temaEscuro" do App
  const bg = '#040d18';          // Azul marinho bem escuro
  const borda = '#1e293b';       // Borda suave
  const corTexto = '#94a3b8';    // Cinza claro para leitura
  const corLink = '#f1f5f9';     // Branco acinzentado para links

  const secoes = [
    { titulo: 'Esportes', links: ['Futebol', 'Basquete', 'E-Sports', 'MMA'] },
    { titulo: 'Institucional', links: ['Sobre nós', 'Expediente', 'Anuncie', 'Fale Conosco'] },
    { titulo: 'Legal', links: ['Termos de Uso', 'Privacidade', 'Cookies'] },
  ];

  return (
    <footer style={{
      background: bg,
      borderTop: `1px solid ${borda}`,
      padding: '3rem 2rem 1.5rem',
      marginTop: '4rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {/* Logo */}
        <div style={{ gridColumn: 'span 2' }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
            Sports<span style={{ color: '#3b82f6' }}>Dash</span>
          </span>
          <p style={{ color: corTexto, fontSize: '0.9rem', marginTop: '1rem', lineHeight: '1.6' }}>
            Acompanhe resultados em tempo real e as principais notícias do mundo dos esportes.
          </p>
        </div>

        {secoes.map((secao) => (
          <div key={secao.titulo}>
            <h4 style={{ color: corLink, fontSize: '0.8rem', marginBottom: '1.2rem', fontWeight: '700', letterSpacing: '1px' }}>
              {secao.titulo.toUpperCase()}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {secao.links.map(link => (
                <li key={link} style={{ marginBottom: '0.6rem' }}>
                  <a href="#" style={{ color: corTexto, textDecoration: 'none', fontSize: '0.85rem' }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${borda}`, paddingTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: corTexto, fontSize: '0.75rem' }}>
          © 2026 SportsDash - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Rodape;