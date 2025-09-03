import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusTag from "../../../../components/StatusTag";
import Button from "../../../../components/Button";
import ComplaintService from "../../../../services/ComplaintService";
import Footer from "../../../../components/Footer";

// Función para determinar el color del estado actual
function getEstadoActualStyle(estadoNombre) {
  // Normalizamos el nombre para evitar problemas de mayúsculas/minúsculas
  const nombre = (estadoNombre || "").toLowerCase();
  if (nombre === "revisión" || nombre === "revision") {
    // Amarillo
    return {
      ...styles.estadoActual,
      background: "#fef9c3",
      color: "#374151"
    };
  } else if (nombre === "validada" || nombre === "validado") {
    // Verde
    return {
      ...styles.estadoActual,
      background: "#bbf7d0",
      color: "#166534"
    };
  } else if (nombre === "cerrada" || nombre === "cerrado") {
    // Rojo
    return {
      ...styles.estadoActual,
      background: "#fecaca",
      color: "#991b1b"
    };
  }
  // Por defecto, amarillo claro
  return styles.estadoActual;
}

// Función para determinar el color de los botones de próximos estados
function getEstadoButtonStyle(estadoNombre) {
  const nombre = (estadoNombre || "").toLowerCase();
  if (nombre === "validada" || nombre === "validado") {
    // Verde
    return {
      ...styles.estadoButton,
      background: "#bbf7d0",
      color: "#166534"
    };
  } else if (nombre === "cerrada" || nombre === "cerrado") {
    // Rojo
    return {
      ...styles.estadoButton,
      background: "#fecaca",
      color: "#991b1b"
    };
  }
  // Por defecto, azul claro
  return styles.estadoButton;
}

const ComplaintResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [nextStates, setNextStates] = useState([]);

  useEffect(() => {
    // Forzar scroll al inicio al cargar el componente
    window.scrollTo(0, 0);

    const forceScrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    forceScrollToTop();
    setTimeout(forceScrollToTop, 0);
    setTimeout(forceScrollToTop, 100);

    const handleLoad = () => {
      forceScrollToTop();
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (location.state && location.state.complaint) {
      setComplaint(location.state.complaint);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchNextStates = async () => {
      if (complaint?.estado?.siguientes && complaint.estado.siguientes.length > 0) {
        try {
          const promises = complaint.estado.siguientes.map((id) =>
            ComplaintService.getEstadoById(id)
          );
          const results = await Promise.all(promises);
          setNextStates(results);
        } catch (error) {
          setNextStates([]);
        }
      } else {
        setNextStates([]);
      }
    };
    fetchNextStates();
  }, [complaint]);

  if (!complaint) {
    return null;
  }

  // Determinar el nombre del estado actual
  const estadoActualNombre = complaint.estado?.nombre || complaint.estadoNombre;

  // Si tienes los próximos estados desde la API, los usas, si no, muestra los dos por defecto
  const proximosEstados = nextStates.length > 0
    ? nextStates.map(e => e.nombre)
    : ["Validada", "Cerrada"];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
        <h1 style={styles.title}>
          Consultar estado de denuncia anónima
        </h1>
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Denuncia anónima</h2>
          <p style={styles.description}>{complaint.titulo}</p>
          <div style={styles.estadoActualBox}>
            <h2 style={styles.estadoActualTitle}>Estado actual</h2>
            <div style={getEstadoActualStyle(estadoActualNombre)}>
              {estadoActualNombre}
            </div>
          </div>
          <div style={styles.proximosEstadosBox}>
            <h3 style={styles.proximosEstadosTitle}>Próximos posibles estados</h3>
            <div style={styles.proximosEstadosTags}>
              {proximosEstados.map((nombre, idx) => (
                <div key={nombre + idx} style={getEstadoButtonStyle(nombre)}>
                  {nombre}
                </div>
              ))}
            </div>
          </div>
          <Button
            text="Volver al inicio"
            className="bg-red-600 hover:bg-red-700 text-white w-full py-3 text-lg rounded-lg mt-2"
            onClick={() => navigate("/")}
            style={styles.button}
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
    //background: "#f3f4f6"
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
    paddingBottom: "7rem",
    cursor: 'default',
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
    fontWeight: "900",
    textAlign: "center",
    marginTop: "-1rem",
    marginBottom: "3.5rem",
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
  card: {
    width: "100%",
    maxWidth: "min(90vw, 500px)",
    background: "#fff",
    borderRadius: "1.2rem",
    boxShadow: "0 4px 24px 0 rgba(37,99,235,0.10)",
    padding: "clamp(2rem, 4vw, 2.5rem) clamp(1.5rem, 3vw, 2rem)",
    textAlign: "center",
    marginBottom: "2rem",
    marginTop: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box"
  },
  subtitle: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    marginTop: "-1rem",
    color: "#111827"
  },
  description: {
    fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
    marginBottom: "1.5rem",
    color: "#374151",
    lineHeight: "1.5"
  },
  estadoActualBox: {
    //background: "#ede9fe",
    borderRadius: "1rem",
    padding: "clamp(1.2rem, 3vw, 1.5rem) clamp(1rem, 2.5vw, 1rem)",
    marginBottom: "2rem",
    //boxShadow: "0 2px 8px 0 rgba(139,92,246,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "-2rem",
    width: "100%",
    boxSizing: "border-box"
  },
  estadoActualTitle: {
    fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#1e293b"
  },
  proximosEstadosBox: {
    //background: "#f5f3ff",
    borderRadius: "1rem",
    padding: "clamp(1.2rem, 3vw, 1.5rem) clamp(1rem, 2.5vw, 1rem)",
    marginBottom: "2rem",
    //boxShadow: "0 2px 8px 0 rgba(139,92,246,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: "-4rem",
    boxSizing: "border-box"
  },
  proximosEstadosTitle: {
    fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#111827"
  },
  proximosEstadosTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "clamp(0.75rem, 2vw, 1rem)",
    justifyContent: "center",
    width: "100%"
  },
  estadoActual: {
    background: "#fef9c3", // Amarillo por defecto (revisión)
    color: "#374151",
    padding: "clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)",
    borderRadius: "0.75rem",
    fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
    fontWeight: "600",
    border: "none",
    cursor: "default",
    display: "inline-block",
    textAlign: "center",
    minWidth: "fit-content",
    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
    userSelect: "none",
    pointerEvents: "none"
  },
  estadoButton: {
    background: "#bae6fd", // Azul claro por defecto
    color: "#374151",
    padding: "clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)",
    borderRadius: "0.75rem",
    fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
    fontWeight: "600",
    border: "none",
    cursor: "default",
    display: "inline-block",
    textAlign: "center",
    minWidth: "fit-content",
    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
    userSelect: "none",
    pointerEvents: "none"
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
    gap: "0.5rem",
    marginTop: "1rem",
    width: "100%",
    maxWidth: "min(90vw, 300px)"
  }
};

export default ComplaintResponse;