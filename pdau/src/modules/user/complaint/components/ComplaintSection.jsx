import React from "react";
import Button from "../../../../components/Button";
import Footer from "../../../../components/Footer";
import { Link } from "react-router-dom";

const ComplaintSection = () => {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Título principal */}
        <h1 style={styles.title}>
          Registro de Denuncia Anónima
        </h1>

        {/* Contenedor principal */}
        <div style={styles.mainContainer}>
          {/* Primer contenedor */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              Importancia de la denuncia anónima
            </div>
            <div style={styles.sectionContent}>
              Realizar una denuncia es un paso esencial para salvaguardar la
              integridad y transparencia dentro de nuestra comunidad
              universitaria. Con tu aporte, contribuyes a prevenir y combatir
              situaciones como acoso, fraude o corrupción, permitiendo que sean
              investigadas sin exponer tu identidad.
            </div>
          </div>

          {/* Segundo contenedor */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              Sustento legal en Colombia
            </div>
            <div style={styles.sectionContent}>
              Esta plataforma se fundamenta en la Ley 1474 de 2011 (Estatuto
              Anticorrupción), que protege el derecho a denunciar y garantiza la
              confidencialidad, asegurando el acceso a la justicia y la protección
              de tu identidad y derechos.
            </div>
          </div>
        </div>

        {/* Botones */}
        <div style={styles.buttonsContainer}>
          <Link to="/register" style={styles.buttonLink}>
            <Button
              text="Seguir con la denuncia"
              className="bg-red-600 hover:bg-red-700 text-white"
            />
          </Link>
          <Link to="/" style={styles.buttonLink}>
            <Button
              text="Cancelar"
              className="bg-red-600 hover:bg-red-700 text-white"
            />
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%", // Cambiado de 100vw a 100%
    boxSizing: "border-box",
    position: "relative",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "1rem 1rem",
    maxWidth: "1200px",
    margin: "0 auto",
    flex: 1,
    boxSizing: "border-box",
    paddingBottom: "15rem", // Reducido de 20rem a 2rem
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
    fontWeight: "900",
    textAlign: "center",
    marginTop: "1.5rem",
    marginBottom: "2.5rem",
    color: "#2563eb",
    width: "100%",
    letterSpacing: "1.5px",
    textShadow: "0 2px 12px rgba(37,99,235,0.10), 0 1px 2px rgba(30,41,59,0.10)",
    background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(1rem, 3vw, 1.5rem)", // Responsive gap
    width: "100%",
    maxWidth: "800px",
    marginBottom: "3rem",
  },
  section: {
    border: "1px solid #d1d5db",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    marginTop: "2rem",
  },
  sectionHeader: {
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "clamp(1rem, 2.5vw, 1.5rem)", // Responsive padding
    fontSize: "clamp(1.2rem, 3vw, 1.5rem)", // Responsive font size
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionContent: {
    padding: "clamp(1.2rem, 2.5vw, 1.5rem)", // Responsive padding
    fontSize: "clamp(0.9rem, 2vw, 1rem)", // Responsive font size
    lineHeight: "1.6",
    textAlign: "justify",
    color: "#000000",
    backgroundColor: "#ffffff",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "clamp(1rem, 3vw, 1.5rem)", // Responsive gap
    flexWrap: "wrap",
    width: "100%",
  },
  buttonLink: {
    textDecoration: "none",
    display: "flex",
  },
};

export default ComplaintSection;