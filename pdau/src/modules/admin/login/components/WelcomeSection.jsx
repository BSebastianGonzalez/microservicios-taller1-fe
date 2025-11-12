import React from "react";
import { useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp, 
  FiFileText, 
  FiBarChart2, 
  FiUsers, 
  FiSettings, 
  FiShield,
  FiArrowRight
} from "react-icons/fi";
import ComplaintService from "../../../../services/ComplaintService";
import ManagementIndicatorService from "../../../../services/ManagementIndicatorService";

const WelcomeSection = () => {
  const adminData = JSON.parse(localStorage.getItem("admin"));
  const adminName = adminData?.nombre || "Administrador";
  const [stats, setStats] = React.useState([
    { icon: FiTrendingUp, number: "-", label: "Denuncias nuevas (24h)", color: "#4f46e5" },
    { icon: FiFileText, number: "-", label: "Denuncias totales", color: "#10b981" },
    { icon: FiFileText, number: "-", label: "Reportes pendientes", color: "#06b6d4" },
    { icon: FiBarChart2, number: "-", label: "Estadísticas generadas", color: "#f59e0b" },
  ]);

  // Cargar estadísticas reales desde backend
  React.useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        // Obtener todas las denuncias y los indicadores
        const [complaintsResp, indicators] = await Promise.all([
          ComplaintService.getAllComplaints(),
          ManagementIndicatorService.getIndicatorsHistory(),
        ]);

        const complaints = Array.isArray(complaintsResp) ? complaintsResp : (complaintsResp?.data || []);

        // Total
        const total = complaints.length;

        // Nuevas en últimas 24 horas
        const now = Date.now();
        const last24 = complaints.filter((c) => {
          const fecha = c.fechaCreacion || c.createdAt || c.fecha || null;
          if (!fecha) return false;
          const t = new Date(fecha).getTime();
          if (isNaN(t)) return false;
          return now - t <= 24 * 60 * 60 * 1000;
        }).length;

        // Reportes pendientes: heurística por estado
        const pendingKeywords = ["revisión", "pendiente", "por atender", "en revisión"];
        const pendingCount = complaints.filter((c) => {
          const name = (c.estado?.nombre || "").toString().toLowerCase();
          return pendingKeywords.some((k) => name.includes(k));
        }).length;

        const indicatorsCount = Array.isArray(indicators) ? indicators.length : (indicators?.length || 0);

        if (!mounted) return;
        setStats([
          { icon: FiTrendingUp, number: String(last24), label: `Denuncias nuevas (24h)`, color: "#4f46e5" },
          { icon: FiFileText, number: String(total), label: `Denuncias totales`, color: "#10b981" },
          { icon: FiFileText, number: String(pendingCount), label: `Reportes pendientes`, color: "#06b6d4" },
          { icon: FiBarChart2, number: String(indicatorsCount), label: `Estadísticas generadas`, color: "#f59e0b" },
        ]);
      } catch (err) {
        console.error("Error cargando estadísticas del dashboard:", err);
      } finally {
        // nothing to cleanup here
      }
    };
    loadStats();
    return () => { mounted = false; };
  }, []);

  const features = [
    { icon: FiUsers, text: "Gestión de denuncias", description: "Supervisa y gestiona denuncias anónimas del sistema", path: '/read_complaint' },
    { icon: FiSettings, text: "Generar estadísticas", description: "Visualiza y analiza datos relevantes del sistema", path: '/statistics' },
    { icon: FiShield, text: "Archivos y reportes", description: "Genera reportes y administra documentación" }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.welcomeCard}>
        
        {/* Header con bienvenida */}
        <div style={styles.header}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              <FiUsers size={32} color="#2463eb" />
            </div>
            <div style={styles.welcomeText}>
              <h1 style={styles.title}>Panel de Administración</h1>
              <p style={styles.subtitle}>Bienvenido, {adminName}</p>
            </div>
          </div>
          <div style={styles.statusBadge}>
            <div style={styles.statusDot}></div>
            Sistema Activo
          </div>
        </div>

        {/* Descripción */}
        <div style={styles.description}>
          <p style={styles.descriptionText}>
            Accede a las herramientas de gestión y monitoreo del sistema PDAU. 
            Supervisa denuncias, administra la información y genera reportes con eficiencia.
          </p>
        </div>

        {/* Estadísticas */}
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
              }}
            >
              <div style={{...styles.statIcon, backgroundColor: `${stat.color}15`}}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <div style={styles.statContent}>
                <span style={styles.statNumber}>{stat.number}</span>
                <span style={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Características principales */}
        <div style={styles.featuresSection}>
          <h3 style={styles.featuresTitle}>Funcionalidades Principales</h3>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente interno para tarjetas de feature con navegación
const FeatureCard = ({ feature }) => {
  const navigate = useNavigate();

  const onActivate = () => {
    if (feature.path) navigate(feature.path);
  };

  return (
    <div
      role={feature.path ? 'link' : 'button'}
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(); } }}
      style={styles.featureCard}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
    >
      <div style={styles.featureIcon}>
        <feature.icon size={24} color="#2463eb" />
      </div>
      <div style={styles.featureContent}>
        <h4 style={styles.featureTitle}>{feature.text}</h4>
        <p style={styles.featureDescription}>{feature.description}</p>
      </div>
      <FiArrowRight size={18} color="#000000" style={styles.arrowIcon} />
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    padding: "1rem 1rem",
    boxSizing: "border-box",
  },

  welcomeCard: {
    padding: "1rem 1rem 2rem",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },

  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid #2463eb",
    boxShadow: "0 8px 25px rgba(79, 70, 229, 0.15)",
  },

  welcomeText: {
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    margin: "0 0 0.5rem 0",
    background: "#2463eb",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: "1.1",
  },

  subtitle: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#000000",
    margin: "0",
  },

  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "#d1fae5",
    color: "#059669",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "600",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#059669",
    animation: "pulse 2s infinite",
  },

  description: {
    marginBottom: "3rem",
    padding: "0 1rem",
  },

  descriptionText: {
    fontSize: "1.1rem",
    color: "#000000",
    lineHeight: "1.7",
    margin: "0",
    textAlign: "center",
    fontWeight: "500",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  statIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statContent: {
    display: "flex",
    flexDirection: "column",
  },

  statNumber: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#000000",
    lineHeight: "1",
    marginBottom: "0.25rem",
  },

  statLabel: {
    fontSize: "0.9rem",
    color: "#000000",
    fontWeight: "600",
  },

  featuresSection: {
    marginBottom: "2.5rem",
  },

  featuresTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#000000",
    margin: "0 0 1.5rem 0",
    textAlign: "center",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1rem",
  },

  featureCard: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "1.5rem",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    cursor: "pointer",
  },

  featureIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  featureContent: {
    flex: "1",
  },

  featureTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#000000",
    margin: "0 0 0.25rem 0",
  },

  featureDescription: {
    fontSize: "0.875rem",
    color: "#000000",
    margin: "0",
    lineHeight: "1.4",
  },

  arrowIcon: {
    transition: "transform 0.3s ease",
  },

  quickActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  primaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 2rem",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)",
  },
};

export default WelcomeSection;