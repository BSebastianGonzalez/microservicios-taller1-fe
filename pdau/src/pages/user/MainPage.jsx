import React, { useState, useEffect } from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import HomeButton from "../../modules/user/components/HomeButton";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const MainPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Ir al inicio de la página cuando se carga el componente
    window.scrollTo(0, 0);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

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
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Estilos responsive para diferentes tamaños de pantalla
  const getResponsiveStyles = () => {
    const isMobile = windowWidth <= 768;
    const isTablet = windowWidth <= 1024 && windowWidth > 768;
    
    return {
      cardsContainer: {
        ...styles.cardsContainer,
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "1rem" : isTablet ? "1rem" : "clamp(1rem, 3vw, 2rem)",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: isMobile ? "nowrap" : "nowrap", // No envolver en desktop
      },
      card: {
        ...styles.card,
        flex: isMobile ? "0 0 auto" : isTablet ? "0 0 280px" : "0 0 300px",
        width: isMobile ? "100%" : isTablet ? "280px" : "300px",
        maxWidth: isMobile ? "400px" : isTablet ? "280px" : "300px",
      }
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <div style={styles.pageContainer}>
      <UserLayout title="Client Home">
        <div style={styles.mainContent}>
          <p style={styles.description}>
            Esta plataforma está diseñada para que cualquier persona pueda reportar de manera anónima situaciones como acoso, fraude, corrupción u otros incidentes en cualquier tipo de empresa u organización. Brindamos un espacio seguro y confidencial para realizar denuncias, facilitando el seguimiento de cada caso y promoviendo la responsabilidad y la transparencia en todos los ámbitos laborales y empresariales.
          </p>
          <div style={responsiveStyles.cardsContainer}>
            <div style={responsiveStyles.card}>
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
            <div style={responsiveStyles.card}>
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
            <div style={responsiveStyles.card}>
            <Link to="/law_frame" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <HomeButton
                    text="Consultar Marco Legal"
                    imageSrc="img/law_consult.png"
                    onClick={() => console.log("Consultar Marco Legal")}
                  />
              </Link>
              <p style={styles.cardText}>
                Consulta las leyes y normativas relacionadas con denuncias y protección al denunciante.
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
    // Usa la ruta desde public (leading slash). Si usas CRA, también funciona:
    // backgroundImage: `url(${process.env.PUBLIC_URL}/img/fondo.png)`,
    backgroundImage: "url('/img/fondo.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundAttachment: "fixed",
    // Estilos temporales de depuración. Quitar cuando confirmes.
    backgroundColor: "#ffffffff",      // color base para ver contraste si la imagen falla
    backgroundBlendMode: "multiply"  // ayuda a que la imagen salga debajo del contenido claro
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
    marginTop: "-1rem",
    marginBottom: "clamp(2rem, 5vw, 3rem)",
    color: "#fff",
    lineHeight: "1.7",
    fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
    width: "100%",
    maxWidth: "900px",
    padding: "2rem 2.5rem",
    fontWeight: "500",
    borderRadius: "1.5rem",
    background: "rgba(30, 41, 59, 0.55)", // Fondo oscuro semitransparente
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    backdropFilter: "blur(4px)", // Efecto glassmorphism
    WebkitBackdropFilter: "blur(4px)",
    border: "1px solid rgba(255,255,255,0.15)",
    letterSpacing: "0.5px",
    marginLeft: "auto",
    marginRight: "auto",
    transition: "background 0.3s",
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "clamp(1rem, 3vw, 2rem)",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap", // No envolver para mantener las tres en fila
    maxWidth: "1200px", // Limita el ancho para centrar el grupo
    margin: "0 auto",   // Centra el contenedor horizontalmente
  },
  card: {
    flex: "0 0 300px",
    width: "300px",
    minHeight: "220px",
    borderRadius: "1.25rem",
    padding: "2rem 1.5rem 1.5rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: "0.5rem",
    background: "rgba(255,255,255,0.25)", // Fondo semitransparente
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    border: "1.5px solid rgba(255,255,255,0.35)",
    backdropFilter: "blur(6px)", // Efecto glassmorphism
    WebkitBackdropFilter: "blur(6px)",
    transition: "transform 0.2s, box-shadow 0.2s, border 0.2s",
    cursor: "pointer",
    // Efecto hover (agrega esto en el componente con onMouseEnter/onMouseLeave si usas JS puro)
    // O usa una clase CSS para :hover si prefieres CSS
  },
  cardText: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000ff",
    marginTop: "1.2rem",
    textAlign: "center",
    lineHeight: "1.5",
    width: "100%",
    letterSpacing: "0.2px",
  },
};

export default MainPage;