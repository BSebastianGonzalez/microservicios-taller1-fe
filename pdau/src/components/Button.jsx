import React from 'react';

const Button = ({ text, onClick, className, style: styleOverride, disabled }) => {

  const handleMouseEnter = (e) => {
    // use currentTarget to avoid nested element issues
    Object.assign(e.currentTarget.style, styles.buttonHover);
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.opacity = '1';
  };

  const combinedStyle = { ...styles.button, ...styleOverride };

  return (
    <button
      onClick={onClick}
      className={className}
      style={combinedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

const styles = {
  button: {
    // Make buttons fill the width of their container so stacked buttons
    // (like los botones del sidebar) tengan el mismo tamaño visual.
    width: '100%',
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