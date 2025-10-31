import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import AdminService from "../../../../services/AdminService";
import Button from "../../../../components/Button";
import Footer from "../../../../components/Footer";
import Modal from "../../../../components/Modal";
import { FaEnvelope as FaEnvelopeIcon } from "react-icons/fa";

// CSS to override browser autofill styling (Chrome) for this page
const autofillResetCSSReset = `
input:-webkit-autofill, input:-webkit-autofill:focus, input:-webkit-autofill:hover {
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
  box-shadow: 0 0 0 1000px #ffffff inset !important;
  -webkit-text-fill-color: #000000 !important;
}
`;

const ResetPassword = () => {
  const [correo, setCorreo] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFocus = (fieldName) => setFocusedField(fieldName);
  const handleBlur = () => setFocusedField(null);

  const getInputStyle = (fieldName) => {
    const baseStyle = { ...styles.input };
    if (focusedField === fieldName) {
      baseStyle.border = "2px solid #2563eb";
      baseStyle.backgroundColor = "#ffffff";
      baseStyle.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
    }
    return baseStyle;
  };

  // Inject autofill reset styles while component is mounted
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-reset-autofill', 'reset-password');
    styleEl.innerText = autofillResetCSSReset;
    document.head.appendChild(styleEl);
    return () => {
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, []);

  const handleSubmit = async () => {
    if (!correo.trim()) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const resp = await AdminService.requestPasswordReset(correo);
      // Suponer que la API devuelve un mensaje
      const apiMessage = resp.message || "Se envió un correo con las instrucciones.";
      const composedMessage = `Hemos enviado un enlace a tu correo: ${correo}. ${apiMessage}`;
      setSuccess(apiMessage);
      // abrir modal elegante mostrando el email
      setModalMessage({
        title: 'Enlace enviado',
        message: composedMessage,
      });
      setModalOpen(true);
    } catch (err) {
      console.error("Error al solicitar reset:", err);
      setError(err.message || err?.error || "Error al solicitar restablecimiento.");
    } finally {
      setIsLoading(false);
    }
  };

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState({ title: '', message: '' });

  const handleModalConfirm = () => {
    // Cerrar modal y permanecer en la misma página (reset)
    setModalOpen(false);
    // opcional: limpiar el correo ingresado
    setCorreo('');
    setSuccess('');
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <img src="/img/logo.png" alt="Logo" style={styles.logo} />
        <div style={styles.card}>
          <h2 style={styles.title}>Reestablecer contraseña</h2>
          <p style={styles.subtitle}>Ingresa el correo asociado a tu cuenta.</p>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="reset-correo">
              <FaEnvelope style={styles.labelIcon} /> Correo electrónico
            </label>
            <input
              id="reset-correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={getInputStyle('reset-correo')}
              placeholder="tu@correo.com"
              disabled={isLoading}
              autoComplete="email"
              onFocus={() => handleFocus('reset-correo')}
              onBlur={handleBlur}
            />
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
            <Button text={isLoading ? "Enviando..." : "Enviar enlace"} onClick={handleSubmit} disabled={isLoading} />
          </div>

          <div style={styles.bottomLinks}>
            <button style={styles.linkButton} 
            onFocus={(e) => { e.currentTarget.style.outline = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            onBlur={(e) => { e.currentTarget.style.outline = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            onClick={() => navigate('/admin_login')}>Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
      {/* Modal de confirmación elegante */}
      <Modal
        open={modalOpen}
        type="success"
        title={modalMessage.title}
        message={modalMessage.message}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        confirmText="Aceptar"
        icon={<FaEnvelopeIcon size={28} style={{ color: '#2563eb' }} />}
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
    minHeight: '100vh',
    background: '#f6f8fa',
    width: '100%'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 0rem 14rem 0rem'
  },
  logo: {
    width: 120,
    height: 'auto',
    marginBottom: '2rem'
  },
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: 420,
    border: '1px solid #e5e7eb'
  },
  title: {
    fontSize: '2rem',
    color: '#000000',
    fontWeight: 800,
    margin: 0,
    textAlign: 'center'
  },
  subtitle: {
    color: '#000000',
    marginTop: '0.5rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: '1rem'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 600,
    color: '#374151'
  },
  labelIcon: {
    color: '#2463eb'
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: 10,
    border: '2px solid #e5e7eb',
    background: '#f9fafb'
  },
  buttonWrap: {
    marginTop: "2rem",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  },
  errorIcon: {
    color: '#dc2626'
  },
  errorText: {
    color: '#dc2626',
    margin: 0
  },
  successContainer: {
    marginTop: 12,
    padding: 12,
    background: '#ecfdf5',
    border: '1px solid #bbf7d0',
    borderRadius: 8
  },
  successText: {
    color: '#065f46',
    margin: 0
  },
  bottomLinks: {
    marginTop: 12,
    display: 'flex',
    justifyContent: 'center'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: 600
  }
};

export default ResetPassword;
