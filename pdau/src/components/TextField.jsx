import React, { useState } from 'react';

const TextField = ({ 
  placeholder, 
  //width = "w-full", 
  height = "h-12", 
  required = false, 
  validate = null, 
  value,
  onChange
}) => {
  const [error, setError] = useState("");

  const handleBlur = () => {
    if (required && !value.trim()) {
      setError("Este campo es obligatorio.");
    } else if (validate && !validate(value)) {
      setError("El texto ingresado no es válido.");
    } else {
      setError("");
    }
  };

  const styles = {
    container: {
      width: '100%',
    },
    textarea: {
      width: '100%',
      height: height === 'h-32' ? '8rem' : '3rem',
      padding: '0.5rem',
      border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
      borderRadius: '0.375rem',
      resize: 'none',
      overflow: 'auto',
      outline: 'none',
      fontSize: '0.875rem',
      fontFamily: 'inherit',
    },
    error: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginTop: '0.25rem',
    }
  };

  return (
    <div style={styles.container}>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        style={styles.textarea}
      />
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

export default TextField;