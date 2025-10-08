import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
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
      
      const response = await AdminService.login(correo, contrasenia);

      if (response.success) {
        console.log("Inicio de sesión exitoso:", response);

        // Guardar los datos del administrador en localStorage
        localStorage.setItem("admin", JSON.stringify(response.admin));

        // Redirigir al usuario a la página principal
        navigate("/admin_main");
      } else {
        setError(response.message || "Error al iniciar sesión. Verifica tus credenciales.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
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

  const showEye =
    focusedField === "contrasenia" && Boolean(contrasenia.trim());

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
                Correo Electronico
              </label>
              <input
                id="correo"
                type="text"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => handleFocus('correo')}
                onBlur={handleBlur}
                style={getInputStyle('correo')}
                placeholder="Ingresa tu correo electrónico"
                disabled={isLoading}
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
              />

              {showEye && (
              <button
                type="button"
                style={styles.eyeButton}
                onPointerDown={(e) => e.preventDefault()}
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

            {error && (
              <div style={styles.errorContainer}>
                <FiAlertCircle style={styles.errorIcon} />
                <p style={styles.errorText}>{error}</p>
              </div>
            )}
            </div>

            {/* Botón de Iniciar Sesión más ancho y con color mejorado */}
            <div style={styles.buttonWrap}>
              {isLoading ? (
                <button type="button" style={styles.loadingButton} disabled>
                  <span style={styles.spinnerInline} />
                  <span>Iniciando sesión...</span>
                </button>
              ) : (
                <Button text="Iniciar Sesión" onClick={handleLogin} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

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
    color: "#6b7280",
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
    paddingRight: "1.5rem", // Agrega el mismo espacio a ambos lados
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
    color: "#374151",
    marginBottom: "0.25rem",
  },
  labelIcon: {
    fontSize: "1.1rem",
    color: "#2463ebff",
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
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: "-25px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    padding: 0,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    //transition: "all 0.2s ease-in-out",
  },
  eyeIcon: {
    fontSize: "1.2rem",
    color: "#2463ebff",
    border: "none",
    background: "none",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.9rem 1rem",
    backgroundColor: "#fff1f2",
    border: "1.5px solid #fca5a5",
    borderRadius: "10px",
    borderLeft: "4px solid #ef4444",
    marginBottom: "0.5rem",
  },
  errorIcon: {
    fontSize: "1.25rem",
    color: "#dc2626",
  },
  errorText: {
    color: "#dc2626",
    fontSize: "0.95rem",
    fontWeight: "500",
    margin: 0,
  },
  loginButton: {
    width: "70%", // Reducido el ancho para que sea menos ancho
    padding: "1.1rem",
    background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "1.15rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    marginTop: "1.2rem",
    marginBottom: "1.2rem",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.15)",
    letterSpacing: "0.5px",
    alignSelf: "center", // Centra el botón si el contenedor es más ancho
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid #ffffff",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  // Nuevo: contenedor para los botones secundarios, centrados y con espacio
  secondaryButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "1.2rem",
    marginTop: "0.5rem",
    width: "100%",
  },
  secondaryButton: {
    flex: 1,
    padding: "0.85rem 0",
    backgroundColor: "#f1f5f9",
    color: "#334155",
    border: "1.5px solid #e0e7ef",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    textAlign: "center",
    boxShadow: "0 1px 4px rgba(30,41,59,0.04)",
    minWidth: "0",
    margin: 0,
  },
  buttonWrap: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "center",
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
  },

  spinnerInline: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.7)",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin .9s linear infinite",
  },
  "@keyframes spin": {
    to: { transform: "rotate(360deg)" },
  },

};

export default CredentialsSection;