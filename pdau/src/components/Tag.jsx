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
    backgroundColor: '#1f2937',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    width: '200px',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
  }
};

export default Tag;