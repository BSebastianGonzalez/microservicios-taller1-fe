import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import AdminService from "../../../../services/AdminService";
import Button from "../../../../components/Button";
import Footer from "../../../../components/Footer";
import Modal from "../../../../components/Modal";

// CSS to override browser autofill styling (Chrome)
const autofillResetCSS = `
input:-webkit-autofill, input:-webkit-autofill:focus, input:-webkit-autofill:hover {
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
  box-shadow: 0 0 0 1000px #ffffff inset !important;
  -webkit-text-fill-color: #000000 !important;
}
`;

const ConfirmPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const t = q.get('token');
    setToken(t);
  }, [location.search]);

  // Inject autofill reset styles while component is mounted
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-reset-autofill', 'confirm-password');
    styleEl.innerText = autofillResetCSS;
    document.head.appendChild(styleEl);
    return () => {
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Completa ambos campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!token) {
      setError("Token inválido o faltante.");
      return;
    }

    try {
      setIsLoading(true);
      const resp = await AdminService.resetPassword(token, password);
        const message = resp.message || "Contraseña actualizada correctamente.";
        setSuccess(message);
    setModalMessage({ title: 'Contraseña actualizada', message });
    setModalOpen(true);
    } catch (err) {
      console.error("Error al resetear contraseña:", err);
      const message = typeof err === 'string' ? err : err?.message || err?.error || 'Error al actualizar la contraseña.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validación en tiempo real: comprobar si las contraseñas coinciden
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  const getInputStyle = (fieldName) => {
    const baseStyle = { ...styles.input };
    if (focusedField === fieldName) {
      baseStyle.border = '2px solid #2563eb';
      baseStyle.backgroundColor = '#ffffff';
      baseStyle.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
      baseStyle.WebkitBoxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
      baseStyle.outline = 'none';
    }
    return baseStyle;
  };

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState({ title: '', message: '' });

  const handleModalConfirm = () => {
    setModalOpen(false);
    // al confirmar, redirigir al login
    navigate('/admin_login');
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <img src="/img/logo.png" alt="Logo" style={styles.logo} />
        <div style={styles.card}>
          <h2 style={styles.title}>Crear nueva contraseña</h2>
          <p style={styles.subtitle}>Ingresa tu nueva contraseña y confírmala.</p>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="new-pass">
              <RiLockPasswordFill style={styles.labelIcon} /> Nueva contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="new-pass"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={getInputStyle('new-pass')}
                placeholder="Nueva contraseña"
                disabled={isLoading}
                autoComplete="new-password"
                onFocus={() => handleFocus('new-pass')}
                onBlur={handleBlur}
              />
              {(focusedField === 'new-pass' && password.trim().length > 0) && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={togglePasswordVisibility}
                  style={styles.eyeButton}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <MdVisibilityOff style={styles.eyeIcon} /> : <MdVisibility style={styles.eyeIcon} />}
                </button>
              )}
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="confirm-pass">
                <RiLockPasswordFill style={styles.labelIcon} /> Confirmar contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirm-pass"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ ...getInputStyle('confirm-pass'), border: passwordsMismatch ? '2px solid #dc2626' : getInputStyle('confirm-pass').border }}
                placeholder="Repite la contraseña"
                disabled={isLoading}
                autoComplete="new-password"
                onFocus={() => handleFocus('confirm-pass')}
                onBlur={handleBlur}
              />
              {(focusedField === 'confirm-pass' && confirmPassword.trim().length > 0) && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={togglePasswordVisibility}
                  style={styles.eyeButton}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <MdVisibilityOff style={styles.eyeIcon} /> : <MdVisibility style={styles.eyeIcon} />}
                </button>
              )}
            </div>
            {/* Mensaje de error en línea para no coincidir */}
            {passwordsMismatch && (
              <div style={styles.errorInline}>
                <FiAlertCircle style={styles.errorIconSmall} />
                <span style={styles.errorInlineText}>Las contraseñas no coinciden.</span>
              </div>
            )}
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <FiAlertCircle style={styles.errorIcon} />
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {success && (
            <div style={styles.successContainer}>
              <p style={styles.successText}>{success}</p>
            </div>
          )}

          <div style={styles.buttonWrap}>
            <Button text={isLoading ? 'Guardando...' : 'Guardar contraseña'} onClick={handleSubmit} disabled={isLoading} />
          </div>

        </div>
      </div>
      <Modal
        open={modalOpen}
        type="success"
        title={modalMessage.title}
        message={modalMessage.message}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        confirmText="Aceptar"
        icon={<FiCheckCircle size={28} style={{ color: '#16a34a' }} />}
        autoFocusConfirm={true}
      />
      <Footer />
    </div>
  );
};

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        background: '#f6f8fa',
    },

    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 0 14rem 0',
    },

    logo: {
        width: 120,
        height: 'auto',
        marginBottom: '2rem',
    },

    card: {
        width: '100%',
        maxWidth: 420,
        background: '#fff',
        padding: '2rem',
        borderRadius: 16,
        border: '1px solid #e5e7eb',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    },

    title: {
        margin: 0,
        fontSize: '2rem',
        color: '#000000',
        fontWeight: 800,
        textAlign: 'center',
    },

    subtitle: {
        marginTop: '0.5rem',
        marginBottom: '1rem',
        color: '#000000',
        textAlign: 'center',
    },

    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: '1rem',
    },

    label: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontWeight: 600,
        color: '#374151',
    },

    labelIcon: {
        color: '#2463eb',
    },

    input: {
        width: '100%',
        padding: '0.85rem 1rem',
        borderRadius: 10,
        border: '2px solid #e5e7eb',
        background: '#f9fafb',
        boxSizing: 'border-box',
    },

    eyeButton: {
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    },

    eyeIcon: {
    fontSize: 20,
    color: '#6b7280',
    },

    buttonWrap: {
        marginTop: "2rem",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
    },

  /* Estilo inline para el error de confirmación */
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
    maxWidth: '100%'
  },
  errorIconSmall: {
    color: '#dc2626',
    fontSize: 16,
    flexShrink: 0
  },
  errorInlineText: {
    fontSize: 13,
    color: '#991b1b',
    margin: 0
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
        margin: 0,
        color: '#dc2626',
    },

    successContainer: {
        marginTop: 12,
        padding: 12,
        background: '#ecfdf5',
        border: '1px solid #bbf7d0',
        borderRadius: 8,
    },

    successText: {
        margin: 0,
        color: '#065f46',
    },
};

export default ConfirmPassword;
