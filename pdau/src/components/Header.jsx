import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoContainer}>
        <div style={styles.logo}>PDAU</div>
      </Link>
      <Link to="/" style={styles.titleContainer}>
        <p style={styles.titulo}>
          Plataforma de Denuncias Anónimas
        </p>
      </Link>
    </header>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(90deg,rgb(34, 49, 82) 0%, #2563eb 100%)',
    padding: '0.5rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100px',
    zIndex: 50,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    cursor: 'default',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    textDecoration: 'none',
    cursor: 'default',
  },
  // Para centrar las letras vertical y horizontalmente en el cuadro, usa display: 'flex', alignItems: 'center' y justifyContent: 'center'
  logo: {
    objectFit: 'contain',
    height: '2.5rem',
    width: '2.5rem',
    padding: '0.75rem',
    display: 'flex',
    backgroundColor: '#dc2626',
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '1.2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(252, 0, 0, 0.3)',
    border: '2px solid #ffffff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  titleContainer: {
    textDecoration: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Esto centra horizontalmente el contenido
    height: '100%',
    width: '100%', // Asegura que ocupe todo el espacio disponible
  },
  titulo: {
    color: 'white',
    fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
    fontWeight: 'bold',
    lineHeight: '2.5rem',
    margin: 0,
    textAlign: 'center',
    letterSpacing: '0.5px',
    userSelect: 'none',
    width: '100%', // Hace que el texto ocupe todo el ancho del contenedor para centrarlo
    display: 'block',
  },
  
};

export default Header;