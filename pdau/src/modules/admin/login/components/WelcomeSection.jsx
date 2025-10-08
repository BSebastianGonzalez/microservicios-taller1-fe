import React from "react";

const WelcomeSection = () => {
  const adminData = JSON.parse(localStorage.getItem("admin"));
  const adminName = adminData?.nombre || "Administrador";

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.welcomeCard}>
          <div style={styles.iconContainer}>
            <span style={styles.welcomeIcon}>👋</span>
          </div>

          <h1 style={styles.title}>Bienvenido al perfil administrativo</h1>
          <p style={styles.subtitle}>{adminName}</p>

          <div style={styles.description}>
            <p style={styles.descriptionText}>
              Accede a las herramientas de gestión y monitoreo del sistema PDAU.
              Supervisa denuncias, administra la información y genera reportes con eficiencia.
            </p>
          </div>

          {/* RESUMEN RÁPIDO */}
          <div style={styles.statsContainer}>
            <div
              style={styles.statCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.statCard)}
            >
              <span style={styles.statNumber}>24</span>
              <span style={styles.statLabel}>Denuncias nuevas</span>
            </div>

            <div
              style={styles.statCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.statCard)}
            >
              <span style={styles.statNumber}>3</span>
              <span style={styles.statLabel}>Reportes pendientes</span>
            </div>

            <div
              style={styles.statCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.statCard)}
            >
              <span style={styles.statNumber}>12</span>
              <span style={styles.statLabel}>Estadísticas generadas</span>
            </div>
          </div>

          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📊</span>
              <span style={styles.featureText}>Gestión de denuncias</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>👤</span>
              <span style={styles.featureText}>Administración de usuarios</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📁</span>
              <span style={styles.featureText}>Archivos y reportes</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  // Fondo CLARO (no negro)
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f8fafc",
    backgroundImage: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    padding: 0,
    boxSizing: "border-box",
    position: "absolute",
    inset: 0,
    zIndex: 1,
  },

  // Tarjeta BLANCA con animación
  welcomeCard: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.10)",
    padding: "3rem",
    maxWidth: "680px",
    width: "100%",
    textAlign: "center",
    border: "1px solid #e5e7eb",
    position: "relative",
    overflow: "hidden",
    margin: "auto",
    zIndex: 2,
    animation: "fadeInUp 0.8s ease-out",
  },

  iconContainer: { marginBottom: "1.5rem" },
  welcomeIcon: {
    fontSize: "3.5rem",
    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.10))",
  },

  title: {
    fontSize: "2.4rem",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "0.5rem",
    letterSpacing: "-0.025em",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "1.6rem",
    letterSpacing: "-0.01em",
  },
  description: { marginBottom: "2rem" },
  descriptionText: {
    fontSize: "1.05rem",
    color: "#6b7280",
    lineHeight: "1.6",
    margin: 0,
  },

  // Resumen rápido
  statsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "0.5rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  statCard: {
    backgroundColor: "#000000ff",
    borderRadius: "14px",
    padding: "1rem 1.25rem",
    textAlign: "center",
    minWidth: "160px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "default",
  },
  statCardHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },
  statNumber: {
    display: "block",
    fontSize: "1.9rem",
    fontWeight: "800",
    color: "#2563eb",
    lineHeight: 1.1,
  },
  statLabel: {
    display: "block",
    marginTop: "0.35rem",
    fontSize: "0.95rem",
    color: "#64748b",
    fontWeight: "500",
  },

  // Features
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
    alignItems: "center",
  },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s ease-in-out",
    cursor: "default",
  },
  featureIcon: {
    fontSize: "1.5rem",
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
  },
  featureText: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#374151",
  },
};

export default WelcomeSection;
