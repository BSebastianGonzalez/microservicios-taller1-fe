import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLockPasswordFill } from 'react-icons/ri';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import AdminService from '../../../services/AdminService';
import Modal from '../../../components/Modal';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState({ title: '', message: '' });

  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  const handleFocus = (f) => setFocusedField(f);
  const handleBlur = () => setFocusedField(null);

  const getInputStyle = (fieldName) => {
    const base = { ...styles.input };
    if (focusedField === fieldName) {
      base.border = '2px solid #2563eb';
      base.backgroundColor = '#ffffff';
      base.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
      base.WebkitBoxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
      base.outline = 'none';
    }
    return base;
  };

  const toggleShow = () => setShowPassword((s) => !s);

  const handleSubmit = async () => {
    setError('');
    if (!password || !confirmPassword) {
      setError('Completa ambos campos.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setIsLoading(true);
      const resp = await AdminService.changePassword(password);
      const msg = resp.message || 'Tu contraseña ha sido actualizada correctamente.';
      setModalMsg({ title: 'Contraseña actualizada', message: msg });
      setModalOpen(true);
    } catch (err) {
      console.error('Error changing password', err);
      setError(err.message || err?.error || 'Error al cambiar la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    navigate('/data');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>

          <p style={styles.subtitle}>Elige una nueva contraseña segura para tu cuenta.</p>
        </div>

        <div style={styles.form}>
          <label style={styles.label} htmlFor="new-pass">
            <RiLockPasswordFill style={styles.labelIcon} /> Nueva contraseña
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="new-pass"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus('new-pass')}
              onBlur={handleBlur}
              style={getInputStyle('new-pass')}
              placeholder="Nueva contraseña"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {(focusedField === 'new-pass' && password.trim().length > 0) && (
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={toggleShow} style={styles.eyeButton} aria-label="Mostrar/ocultar">
                {showPassword ? <MdVisibilityOff style={styles.eyeIcon} /> : <MdVisibility style={styles.eyeIcon} />}
              </button>
            )}
          </div>

          <label style={{ ...styles.label, marginTop: 12 }} htmlFor="confirm-pass">
            <RiLockPasswordFill style={styles.labelIcon} /> Confirmar contraseña
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="confirm-pass"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => handleFocus('confirm-pass')}
              onBlur={handleBlur}
              style={{ ...getInputStyle('confirm-pass'), border: passwordsMismatch ? '2px solid #dc2626' : getInputStyle('confirm-pass').border }}
              placeholder="Repite la contraseña"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {(focusedField === 'confirm-pass' && confirmPassword.trim().length > 0) && (
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={toggleShow} style={styles.eyeButton} aria-label="Mostrar/ocultar">
                {showPassword ? <MdVisibilityOff style={styles.eyeIcon} /> : <MdVisibility style={styles.eyeIcon} />}
              </button>
            )}
          </div>

          {passwordsMismatch && (
            <div style={styles.errorInline}>
              <FiAlertCircle style={styles.errorIconSmall} />
              <span style={styles.errorInlineText}>Las contraseñas no coinciden.</span>
            </div>
          )}

          {error && (
            <div style={styles.errorContainer}>
              <FiAlertCircle style={styles.errorIcon} />
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          <div style={styles.actions}>
            <button
              style={styles.primaryBtn}
              onClick={handleSubmit}
              disabled={isLoading}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.primaryBtnHover)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.boxShadow = styles.primaryBtn.boxShadow || 'none';
                e.currentTarget.style.background = styles.primaryBtn.background;
              }}
            >
              {isLoading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} type="success" title={modalMsg.title} message={modalMsg.message} onConfirm={handleModalConfirm} confirmText="Aceptar" icon={<FiCheckCircle size={28} style={{ color: '#16a34a' }} />} autoFocusConfirm={true} onClose={() => setModalOpen(false)} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'white',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
  },
  header: {
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    margin: 0,
  },
  subtitle: {
    color: '#000000ff',
    marginTop: "-0.5rem",
    fontSize: '1rem',
  },
  form: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 700,
    color: '#000000',
    marginBottom: 6,
  },
  labelIcon: {
    color: '#2563eb',
  },
  input: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: 10,
    border: '2px solid #e5e7eb',
    background: '#f9fafb',
  },
  eyeButton: {
    position: 'absolute',
    right: 5,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  eyeIcon: {
    fontSize: 20,
    color: '#2563eb',
  },
  actions: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
  },
  primaryBtn: {
    background: 'linear-gradient(90deg,#2563eb 0%,#1e40af 100%)',
    color: '#fff',
    border: 'none',
    padding: '0.8rem 1.4rem',
    borderRadius: 10,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 4px 12px -1px rgba(30, 58, 138, 0.15), 0 2px 8px -1px rgba(30, 58, 138, 0.10)',
    transition: 'background 0.3s cubic-bezier(.4,2,.6,1), transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1), opacity 0.3s',
    transform: 'scale(1)',
    outline: 'none',
  },
  primaryBtnHover: {
    transform: 'scale(1.04)',
    opacity: 0.96,
    boxShadow: '0 8px 24px -2px rgba(30, 58, 138, 0.20), 0 4px 12px -2px rgba(30, 58, 138, 0.15)',
    background: 'linear-gradient(90deg,#1e40af 0%,#2563eb 100%)',
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
  },
  errorIcon: {
    color: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    margin: 0,
  },
  errorInline: {
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#dc2626',
    background: 'rgba(220,38,38,0.04)',
    padding: '6px 10px',
    borderRadius: 8,
    border: '1px solid rgba(220,38,38,0.12)',
  },
  errorIconSmall: {
    color: '#dc2626',
    fontSize: 16,
  },
  errorInlineText: {
    fontSize: 13,
    color: '#991b1b',
    margin: 0,
  },
};

export default ChangePassword;
