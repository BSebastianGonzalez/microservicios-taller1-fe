import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FiAlertCircle } from "react-icons/fi"; // Icono faltante agregado
import AdminService from "../../../../services/AdminService";
import Button from "../../../../components/Button";
import Footer from "../../../../components/Footer";

const CredentialsSection = () => {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!correo.trim() || !contrasenia.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      // Llamar al servicio de login
      const response = await AdminService.login(correo, contrasenia);


      // Verificar si la respuesta tiene token (éxito)
      if (response.token) {


    // El servicio ya guarda en localStorage; no registramos datos sensibles en la consola

        // Redirigir al usuario a la página principal
        navigate("/admin_main");
      } else {
        // Si no hay token, mostrar mensaje de error
        setError(response.message || "Error al iniciar sesión. Verifica tus credenciales.");
      }
    } catch (error) {
      console.error("Error completo al iniciar sesión:", error);
      
      // Manejar diferentes tipos de error
      if (error.response) {
        // Error de la API
        setError(error.response.data?.message || "Error del servidor");
      } else if (error.request) {
        // Error de conexión
        setError("Error de conexión. Verifica tu internet.");
      } else {
        // Otros errores
        setError(error.message || "Error al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const getInputStyle = (fieldName) => {
    const baseStyle = { ...styles.input };
    if (focusedField === fieldName) {
      baseStyle.border = "2px solid #2563eb";
      baseStyle.backgroundColor = "#ffffff";
      baseStyle.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
    }
    return baseStyle;
  };

  const showEye = focusedField === "contrasenia" && Boolean(contrasenia.trim());

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Imagen del logo arriba del cuadro */}
        <img
          src="/img/logo.png"
          alt="Logo"
          style={styles.logo}
        />
        <div style={styles.loginCard}>
          <div style={styles.header}>
            <h1 style={styles.title}>Iniciar Sesión</h1>
            <p style={styles.subtitle}>Accede a tu panel administrativo</p>
          </div>

          <div style={styles.form}>
            <div style={styles.fieldGroup}>
              <label htmlFor="correo" style={styles.label}>
                <FaUser style={styles.labelIcon} />
                Correo Electrónico
              </label>
              <input
                id="correo"
                type="email" // Cambiado a email para mejor UX
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => handleFocus('correo')}
                onBlur={handleBlur}
                style={getInputStyle('correo')}
                placeholder="Ingresa tu correo electrónico"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="contrasenia" style={styles.label}>
                <RiLockPasswordFill style={styles.labelIcon} />
                Contraseña
              </label>
              <div style={styles.passwordContainer}>
                <input
                  id="contrasenia"
                  type={showPassword ? "text" : "password"}
                  value={contrasenia}
                  onChange={(e) => setContrasenia(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => handleFocus('contrasenia')}
                  onBlur={handleBlur}
                  style={getInputStyle('contrasenia')}
                  placeholder="Ingresa tu contraseña"
                  disabled={isLoading}
                  autoComplete="current-password"
                />

                {showEye && (
                  <button
                    type="button"
                    style={styles.eyeButton}
                    onMouseDown={(e) => e.preventDefault()} // Mejor que onPointerDown
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <MdVisibilityOff style={styles.eyeIcon} />
                    ) : (
                      <MdVisibility style={styles.eyeIcon} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div style={styles.errorContainer}>
                <FiAlertCircle style={styles.errorIcon} />
                <p style={styles.errorText}>{error}</p>
              </div>
            )}

            {/* Enlace para restablecer contraseña */}
            <div style={styles.forgotWrap}>
              <button
                type="button"
                onClick={() => navigate('/admin_password_reset')}
                style={styles.forgotButton}
                onFocus={(e) => { e.currentTarget.style.outline = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                onBlur={(e) => { e.currentTarget.style.outline = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                disabled={isLoading}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de Iniciar Sesión */}
            <div style={styles.buttonWrap}>
              {isLoading ? (
                <button type="button" style={styles.loadingButton} disabled>
                  <span style={styles.spinnerInline} />
                  <span>Iniciando sesión...</span>
                </button>
              ) : (
                <Button 
                  text="Iniciar Sesión" 
                  onClick={handleLogin}
                  disabled={isLoading}
                />
              )}
            </div>
          
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Agregar los keyframes para la animación del spinner
const globalStyles = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

// Inyectar los estilos globales
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
    cursor: 'default',
    margin: 0,
    padding: 0,
    background: "#f6f8fa",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
    padding: "3rem 0rem 14rem 0rem",
    margin: 0,
  },
  logo: {
    width: "120px",
    height: "auto",
    marginBottom: "3rem",
    marginTop: "1rem",
    objectFit: "contain",
    border: "none",
  },
  loginCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.10)",
    padding: "2.5rem 2rem 2.5rem 2rem",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #e5e7eb",
    marginBottom: "0",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#000000",
    marginBottom: "0.5rem",
    marginTop: "-0.5rem",
    letterSpacing: "-0.025em",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#000000",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
    width: "100%",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    boxSizing: "border-box",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
    maxWidth: "300px",
    boxSizing: "border-box",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#000000",
    marginBottom: "0.25rem",
  },
  labelIcon: {
    fontSize: "1.1rem",
    color: "#2463eb",
  },
  input: {
    width: "100%",
    padding: "0.9rem 1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "1rem",
    transition: "all 0.2s ease-in-out",
    outline: "none",
    backgroundColor: "#f9fafb",
    boxSizing: "border-box",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: "12px", // Ajustado para mejor posición
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: "4px",
  },
  eyeIcon: {
    fontSize: "1.2rem",
    color: "#2463eb",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    marginTop: "0.5rem",
  },
  errorIcon: {
    fontSize: "1.1rem",
    color: "#dc2626",
    flexShrink: 0,
  },
  errorText: {
    color: "#dc2626",
    fontSize: "0.9rem",
    fontWeight: "500",
    margin: 0,
  },
  buttonWrap: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  forgotWrap: {
    display: "flex",
    justifyContent: "flex-end",
    marginLeft: "-2.5rem",
    width: "100%",
    borderBottom: "none",
    border: "none",
    marginBottom: "-1rem",
    marginTop: "-0.5rem",
  },
  forgotButton: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontWeight: 600,
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: "6px",
    outline: 'none',
    boxShadow: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  loadingButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "0.95rem 1.4rem",
    border: "none",
    borderRadius: "12px",
    fontWeight: 800,
    fontSize: "1rem",
    color: "#fff",
    cursor: "not-allowed",
    background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
    boxShadow: "0 6px 16px rgba(37,99,235,0.18)",
    width: "100%",
    maxWidth: "300px",
  },
  spinnerInline: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.7)",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
};

export default CredentialsSection;