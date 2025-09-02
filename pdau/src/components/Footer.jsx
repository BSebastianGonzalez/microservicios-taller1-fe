import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {

  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        {/* Columna izquierda - PQRSD */}
        <div style={styles.column}>
          <div style={styles.logo}>
            <img
              src="/img/logo.png"
              alt="Logo PDAU"
              style={{ width: "60px", height: "auto", marginBottom: "0.5rem", objectFit: "contain", border: "none" }}
            />
            <h3 style={styles.pqrsdTitle}>Plataforma de Denuncias Anónimas</h3>
          </div>
          <p style={styles.description}>
            El formulario virtual de PDAU es uno de los canales dispuestos para recibir requerimientos de los ciudadanos.
          </p>
        </div>


        {/* Columna derecha - Contactenos */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Contactenos</h4>
          <div style={styles.contactInfo}>
            <div style={styles.contactItem}>
              <span>📞</span>
              <span></span>
            </div>
            <div style={styles.contactItem}>
              <span>✉️</span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Sección inferior */}
      <div style={styles.bottomSection}>
        <div style={styles.copyright}>
          <div>2025 © All Rights Reserved. Desarrollado por: </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#14191f',
    color: 'white',
    padding: '2rem 1rem 1rem 1rem',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: 'auto', // Empuja el footer hacia abajo
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'auto',
  },
  footerContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    gap: 'clamp(1rem, 3vw, 2rem)',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
  },
  column: {
    flex: '1 1 300px',
    minWidth: '280px',
    maxWidth: '400px',
    marginBottom: '2rem',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  ufpsLogo: {
    width: '75px',
    height: '60px',
    backgroundColor: '#dc2626',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    borderRadius: '4px',
  },
  pqrsdTitle: {
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
    marginBottom: '0.5rem',
  },
  heading: {
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: 'white',
  },
  description: {
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    lineHeight: '1.5',
    marginBottom: '-1.5rem',
    color: '#d1d5db',
  },
  socialIcons: {
    display: 'flex',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
  },
  socialIcon: {
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  links: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'underline',
    marginBottom: '0.5rem',
    display: 'block',
    cursor: 'pointer',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
  },
  divider: {
    border: 'none',
    height: '1px',
    backgroundColor: '#374151',
    margin: '2rem 0 1rem 0',
    width: '100%',
    maxWidth: '1200px',
  },
  bottomSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
    color: '#9ca3af',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  copyright: {
    flex: '1',
    minWidth: '300px',
    textAlign: 'center',
  },
};

export default Footer;