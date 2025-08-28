import React from 'react';

const Button = ({ text, onClick }) => {

  const handleMouseEnter = (e) => {
    Object.assign(e.target.style, styles.buttonHover);
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'scale(1)';
    e.target.style.opacity = '1';
  };

  return (
    <button
      onClick={onClick} 
      style={styles.button}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </button>
  );
};

const styles = {
  button: {
    minWidth: '220px',
    padding: '0.75rem 1.5rem',
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 12px -1px rgba(30, 58, 138, 0.15), 0 2px 8px -1px rgba(30, 58, 138, 0.10)',
    transition: 'background 0.3s cubic-bezier(.4,2,.6,1), transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1), opacity 0.3s',
    transform: 'scale(1)',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)', // Azul bacano tipo header
    color: '#fff',
    letterSpacing: '0.5px',
  },
  buttonHover: {
    transform: 'scale(1.07)',
    opacity: 0.93,
    boxShadow: '0 8px 24px -2px rgba(30, 58, 138, 0.20), 0 4px 12px -2px rgba(30, 58, 138, 0.15)',
    background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
  }
};

export default Button;