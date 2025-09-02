import React from "react";

const WelcomeSection = () => {
  // Obtener los datos del administrador desde localStorage
  const adminData = JSON.parse(localStorage.getItem("admin"));
  
  // Si no hay datos del administrador, usamos un nombre por defecto
  const adminName = adminData?.nombre || "Administrador";

  return (
    <div style={styles.container}>
      <div style={styles.welcomeCard}>
        <div style={styles.iconContainer}>
          <span style={styles.welcomeIcon}>👋</span>
        </div>
        <h1 style={styles.title}>
          Bienvenido al perfil administrativo
        </h1>
        <p style={styles.subtitle}>
          {adminName}
        </p>
        <div style={styles.description}>
          <p style={styles.descriptionText}>
            Accede a todas las herramientas y funcionalidades del sistema de administración PDAU.
          </p>
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
  );
};

const styles = {
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
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  welcomeCard: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    padding: "3rem",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
    border: "1px solid #e5e7eb",
    position: "relative",
    overflow: "hidden",
    margin: "auto",
    zIndex: 2,
  },
  iconContainer: {
    marginBottom: "2rem",
  },
  welcomeIcon: {
    fontSize: "4rem",
    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "1rem",
    letterSpacing: "-0.025em",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "1.75rem",
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: "2rem",
    letterSpacing: "-0.01em",
  },
  description: {
    marginBottom: "2.5rem",
  },
  descriptionText: {
    fontSize: "1.125rem",
    color: "#6b7280",
    lineHeight: "1.6",
    margin: 0,
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
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
