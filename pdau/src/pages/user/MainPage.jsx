import React from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import HomeButton from "../../modules/user/components/HomeButton";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div style={styles.pageContainer}>
      <UserLayout title="Client Home">
        <div style={styles.mainContent}>
          <p style={styles.description}>
            Esta plataforma está diseñada para que cualquier persona pueda reportar de manera anónima situaciones como acoso, fraude, corrupción u otros incidentes en cualquier tipo de empresa u organización. Brindamos un espacio seguro y confidencial para realizar denuncias, facilitando el seguimiento de cada caso y promoviendo la responsabilidad y la transparencia en todos los ámbitos laborales y empresariales.
          </p>
          <div style={styles.cardsContainer}>
            <div style={styles.card}>
              <Link to="/complaint" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <HomeButton
                  text="Registrar Denuncia Anónima"
                  imageSrc="img/complaint_register.png"
                  onClick={() => console.log("Registrar Denuncia Anónima")}
                />
              </Link>
              <p style={styles.cardText}>
                Envía una denuncia de forma anónima, selecciona una categoría y adjunta evidencia opcional.
              </p>
            </div>
            <div style={styles.card}>
              <Link to="/consult" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <HomeButton
                  text="Consultar Estado De Denuncia Anónima"
                  imageSrc="img/status_consult.png"
                  onClick={() => console.log("Consultar Estado De Denuncia Anónima")}
                />
              </Link>
              <p style={styles.cardText}>
                Usa tu token de seguimiento para conocer el estado y próximos pasos de tu denuncia.
              </p>
            </div>
            <div style={styles.card}>
            <Link to="/law_frame" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <HomeButton
                    text="Consultar Marco Legal"
                    imageSrc="img/law_consult.png"
                    onClick={() => console.log("Consultar Marco Legal")}
                  />
              </Link>
              <p style={styles.cardText}>
                Usa tu token de seguimiento para conocer el estado y próximos pasos de tu denuncia.
              </p>
            </div>
          </div>
        </div>
      </UserLayout>
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
    paddingBottom: "2rem",
    cursor: 'default',
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
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
    cursor: 'default',
  },
  description: {
    textAlign: "center",
    marginBottom: "4rem",
    maxWidth: "min(50rem, 90vw)",
    color: "#374151",
    lineHeight: "1.6",
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    width: "100%",
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "clamp(1rem, 3vw, 2rem)",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap", // No envolver, para que los tres estén en una sola fila
    maxWidth: "1200px", // Limita el ancho para centrar el grupo
    margin: "0 auto",   // Centra el contenedor horizontalmente
  },
  card: {
    flex: "0 1 340px", // Fijo para que los tres tengan el mismo ancho y queden centrados
    minWidth: "280px",
    maxWidth: "340px",
    borderRadius: "1rem",
    padding: "clamp(1.5rem, 3vw, 2rem)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "1rem 0", // Solo margen vertical para evitar separación horizontal extra
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    backgroundColor: "#ffffff",
  },
  cardText: {
    fontSize: "clamp(0.875rem, 2vw, 1rem)",
    fontWeight: "bold",
    color: "#111827",
    marginTop: "1rem",
    textAlign: "center",
    lineHeight: "1.5",
    width: "100%",
  },
};

export default MainPage;