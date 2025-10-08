import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoContainer}>
        <img
          src="/img/logo.png"
          alt="Logo PDAU"
          style={styles.logo}
        />
      </Link>
      <div style={styles.titleContainer}>
        <p style={styles.titulo}>
          Plataforma de Denuncias Anónimas
        </p>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(90deg,rgb(34, 49, 82) 0%,hsla(221, 83%, 53%, 1.00) 100%)',
    padding: '0rem 2rem', // Reducido un poco el padding vertical
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '85px', // Altura reducida ligeramente
    zIndex: 50,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    cursor: 'default',
    paddingLeft: '0.5rem', // Agrega un pequeño padding a la izquierda para acercar el logo al borde
    },
    logoContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    textDecoration: 'none',
    cursor: 'default',
    marginLeft: '0rem', // Mueve el logo un poco más a la izquierda
    },
    // Para centrar las letras vertical y horizontalmente en el cuadro, usa display: 'flex', alignItems: 'center' y justifyContent: 'center'
    // Ajustado para mostrar correctamente una imagen en vez de un cuadro de letras
    logo: {
    objectFit: 'contain',
    height: '3.5rem',
    width: '3.5rem',
    padding: 0,
    display: 'block',
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    borderRadius: '0px', // Sin bordes redondeados, completamente rectangular
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
    textAlign: 'center', // Cambiado de 'center' a 'left' para mover el título a la izquierda
    letterSpacing: '0.5px',
    userSelect: 'none',
    width: '100%',
    display: 'block',
    paddingLeft: '0rem',
    paddingRight: '1.2rem', // Agrega un padding a la izquierda para moverlo un poco
  },
  
};

export default Header;