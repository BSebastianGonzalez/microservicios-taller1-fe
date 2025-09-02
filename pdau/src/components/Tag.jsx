import React from 'react';

const Tag = ({ text }) => {

  return (
    <div style={styles.tag}>
      {text}
    </div>
  );
};

const styles = {
  tag: {
    background: 'rgb(204, 204, 204)', // Un gris claro en formato rgba
    color: '#000000', // Un blanco azulado para contraste y armonía con el azul
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.75rem',
    width: '220px',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.10), 0 1px 2px rgba(30,41,59,0.10)',
    letterSpacing: '0.5px',
    //border: '1.5px solid #e5e7eb',
  }
};

export default Tag;