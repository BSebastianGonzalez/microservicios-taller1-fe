import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import Button from "../../../../components/Button";
import Footer from "../../../../components/Footer";

const FinishedRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token;

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) return null;

  const handleDownloadToken = () => {
    const element = document.createElement("a");
    const file = new Blob([`Token de seguimiento: ${token}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "token.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
        <h1 style={styles.title}>
          Registro de Denuncia Anónima
        </h1>
        <p style={styles.subtitle}>Su token de seguimiento es:</p>
        <h2 style={styles.token}>{token}</h2>
        <p style={styles.description}>
          Mediante el token, usted puede consultar en qué estado se encuentra su
          denuncia, y en qué estados podrá encontrarse después. Recuerde que el
          token generado es único y exclusivo para su denuncia; sin posibilidad de
          recuperación. Puede descargarlo a continuación si así lo desea.
        </p>
        <div style={styles.buttonContainer}>
          <Button
            text="Descargar token (TXT)"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDownloadToken}
          />
          <Button
            text="Volver al inicio"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => navigate("/")}
          />
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
    padding: "3.5rem 1rem",
    paddingBottom: "11rem",
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
  subtitle: {
    fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
    textAlign: "center",
    marginBottom: "1rem",
    color: "#374151",
    fontWeight: 500,
    width: "100%",
  },
  token: {
    fontSize: "clamp(1.3rem, 3vw, 2.5rem)",
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: "1rem",
    textAlign: "center",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    overflowX: "auto",
    //background: "rgba(255,255,255,0.9)",
    borderRadius: "0.75rem",
    padding: "1rem 2rem",
    width: "100%",
    //maxWidth: "min(90vw, 700px)",
    boxSizing: "border-box",
    //border: "2px solid #fecaca",
    //boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    display: "block",
   // scrollbarWidth: "thin",
   // scrollbarColor: "#fecaca #fff",
  },
  description: {
    textAlign: "center",
    color: "#374151",
    marginBottom: "3rem",
    padding: "1.5rem",
    maxWidth: "min(90vw, 1000px)",
    fontSize: "clamp(0.95rem, 2.5vw, 1.5rem)",
    lineHeight: 1.6,
    //background: "rgba(255,255,255,0.8)",
    borderRadius: "0.75rem",
    width: "100%",
    boxSizing: "border-box",
    overflowWrap: "break-word",
    //border: "1px solid #e5e7eb",
    //boxShadow: "0 1px 3px 0 rgba(37,99,235,0.15), 0 1px 2px 0 rgba(37,99,235,0.10)",
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
};


export default FinishedRegister;
