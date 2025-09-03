import React, { useState, useEffect } from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";
import ComplaintService from "../../../../services/ComplaintService";
import Footer from "../../../../components/Footer";
import { useNavigate } from "react-router-dom";

// Componente Spinner simple en línea
const Spinner = () => (
  <span
    style={{
      display: "inline-block",
      width: "1.2em",
      height: "1.2em",
      border: "2.5px solid #fff",
      borderTop: "2.5px solid #dc2626",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      marginRight: "0.5em",
    }}
  />
);

// Agregar keyframes para el spinner
const spinnerStyle = document.createElement("style");
spinnerStyle.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
`;
if (typeof document !== "undefined" && !document.getElementById("sent-token-spinner-style")) {
  spinnerStyle.id = "sent-token-spinner-style";
  document.head.appendChild(spinnerStyle);
}

const SentToken = () => {
  const [token, setToken] = useState(""); // Estado para almacenar el token ingresado
  const [error, setError] = useState(""); // Estado para manejar errores
  const [loading, setLoading] = useState(false); // Estado para mostrar el círculo de carga
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal de error
  const navigate = useNavigate();

  useEffect(() => {
    // Ir al inicio de la página cuando se carga el componente
    window.scrollTo(0, 0);

    // Función para forzar scroll al inicio
    const forceScrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Ejecutar inmediatamente
    forceScrollToTop();

    // Ejecutar después de un pequeño delay para asegurar que se ejecute después del render
    setTimeout(forceScrollToTop, 0);
    setTimeout(forceScrollToTop, 100);

    // También ejecutar cuando la página esté completamente cargada
    const handleLoad = () => {
      forceScrollToTop();
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const handleConsult = async () => {
    if (!token.trim()) {
      setError("Por favor, ingrese un token válido.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Consultar la denuncia por token
      const response = await ComplaintService.getComplaintByToken(token);

      // Redirigir a ComplaintResponse con los datos de la denuncia
      navigate("/consult_response", { state: { complaint: response } });
    } catch (e) {
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Modal de error personalizado
  const ErrorModal = ({ onClose }) => (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2 style={modalStyles.title}>No se encontró la denuncia</h2>
        <p style={modalStyles.text}>
          No se encontró una denuncia con el token ingresado. Por favor, verifique el token e intente nuevamente.
        </p>
        <button
          style={modalStyles.button}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
        <h1 style={styles.title}>
          Consultar estado de denuncia anónima
        </h1>
        <div style={styles.inputContainer}>
          <TextField
            placeholder="Ingrese el token de seguimiento"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError(""); // Limpiar el error al escribir
            }}
            required
            style={styles.textField}
            disabled={loading}
          />
          {error && <p style={styles.error}>{error}</p>}
        </div>
        <div style={styles.buttonContainer}>
          {/* Botón de consultar con el mismo estilo visual que "Volver al inicio" */}
          <Button
            text={
              <>
                {loading && <Spinner />}
                Consultar
              </>
            }
            className="bg-gradient-to-r from-blue-500 to-blue-800 text-white font-bold shadow-lg"
            onClick={handleConsult}
            style={{
              ...styles.button,
              background: "linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)",
              color: "#fff",
              fontWeight: 700,
              boxShadow: "0 4px 16px 0 rgba(37,99,235,0.12)",
              border: "none"
            }}
            disabled={loading}
          />
          <Button
            text="Volver al inicio"
            className="bg-gradient-to-r from-blue-500 to-blue-800 text-white font-bold shadow-lg"
            onClick={() => navigate("/")}
            style={{
              ...styles.button,
              background: "linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)",
              color: "#fff",
              fontWeight: 700,
              boxShadow: "0 4px 16px 0 rgba(37,99,235,0.12)",
              border: "none"
            }}
            disabled={loading}
          />
        </div>
      </div>
      <Footer />
      {showModal && <ErrorModal onClose={() => setShowModal(false)} />}
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
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    flex: 1,
    boxSizing: "border-box",
    padding: "clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)",
    paddingBottom: "2rem",
    cursor: 'default',
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
    fontWeight: "900",
    textAlign: "center",
    marginTop: "-1rem",
    marginBottom: "2.5rem",
    color: "#2563eb",
    width: "100%",
    letterSpacing: "0.3px",
    textShadow: "0 2px 12px rgba(37,99,235,0.10), 0 1px 2px rgba(30,41,59,0.10)",
    background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    cursor: 'default',
    lineHeight: 1.1,
    wordBreak: "break-word",
  },
  inputContainer: {
    width: "100%",
    maxWidth: "min(90vw, 500px)",
    marginBottom: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textField: {
    width: "100%",
    fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
    padding: "clamp(0.8rem, 2vw, 0.9rem) clamp(1rem, 2.5vw, 1.2rem)",
    borderRadius: "0.75rem",
    border: "1.5px solid #2563eb",
    outline: "none",
    marginBottom: "0.5rem",
    background: "#fff",
    boxShadow: "0 2px 8px 0 rgba(37,99,235,0.06)",
    transition: "border 0.2s",
    boxSizing: "border-box",
  },
  error: {
    color: "#dc2626",
    fontSize: "clamp(0.875rem, 2vw, 0.95rem)",
    marginTop: "0.5rem",
    textAlign: "center",
    fontWeight: 500,
    width: "100%",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "clamp(0.75rem, 2vw, 1.5rem)",
    marginTop: "1rem",
    justifyContent: "center",
    width: "100%",
    flexWrap: "wrap",
    maxWidth: "min(90vw, 500px)",
  },
  button: {
    minWidth: "clamp(120px, 15vw, 140px)",
    padding: "clamp(0.7rem, 2vw, 0.8rem) clamp(1.2rem, 3vw, 1.5rem)",
    fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
    fontWeight: 700,
    borderRadius: "0.75rem",
    boxShadow: "0 2px 8px 0 rgba(220,38,38,0.08)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s, box-shadow 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem"
  },
};

// Estilos para el modal
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.35)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modal: {
    background: "#fff",
    borderRadius: "1rem",
    padding: "2rem 2.5rem",
    boxShadow: "0 4px 32px 0 rgba(37,99,235,0.18)",
    maxWidth: "90vw",
    width: "400px",
    textAlign: "center",
    position: "relative"
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#dc2626",
    marginBottom: "1rem"
  },
  text: {
    fontSize: "1.1rem",
    color: "#1e293b",
    marginBottom: "2rem"
  },
  button: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "0.75rem",
    padding: "0.7rem 1.5rem",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 2px 8px 0 rgba(220,38,38,0.08)",
    transition: "background 0.2s, box-shadow 0.2s"
  }
};

export default SentToken;
