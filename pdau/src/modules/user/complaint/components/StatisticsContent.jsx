import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintService from "../../../../services/ComplaintService";
import Button from "../../../../components/Button";
import Footer from "../../../../components/Footer";

const StatisticsContent = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        // DATOS ESTÁTICOS PARA VISUALIZACIÓN
        const datosEstaticos = [
          { 
            categoria: "Acoso verbal", 
            cantidad: 45, 
            porcentaje: 25.7 
          },
          { 
            categoria: "Acoso físico", 
            cantidad: 32, 
            porcentaje: 18.3 
          },
          { 
            categoria: "Acoso psicológico", 
            cantidad: 28, 
            porcentaje: 16.0 
          },
          { 
            categoria: "Corrupción", 
            cantidad: 25, 
            porcentaje: 14.3 
          },
          { 
            categoria: "Discriminación", 
            cantidad: 20, 
            porcentaje: 11.4 
          },
          { 
            categoria: "Fraude académico", 
            cantidad: 15, 
            porcentaje: 8.6 
          },
          { 
            categoria: "Abuso de autoridad", 
            cantidad: 10, 
            porcentaje: 5.7 
          }
        ];

        setTimeout(() => {
          setStatistics(datosEstaticos);
          setLoading(false);
        }, 1000);

        // CÓDIGO REAL COMENTADO - Descomentar cuando tengas el backend
        /*
        const data = await ComplaintService.getComplaintStatistics();
        setStatistics(data);
        setLoading(false);
        */
      } catch (err) {
        setError("Error al cargar las estadísticas");
        setLoading(false);
        console.error("Error fetching statistics:", err);
      }
    };

    fetchStatistics();
  }, []);

  const totalDenuncias = statistics.reduce((sum, stat) => sum + stat.cantidad, 0);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingText}>Cargando estadísticas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorText}>{error}</div>
          <Button
            text="Reintentar"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
      <div style={styles.header}>
        <h1 style={styles.title}>Estadísticas de Denuncias</h1>
        <p style={styles.subtitle}>
          Consulta el número y porcentaje de denuncias realizadas por tipo
        </p>
      </div>

      <div style={styles.summaryCard}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total de Denuncias</span>
          <span style={styles.summaryValue}>{totalDenuncias}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Tipos de Denuncia</span>
          <span style={styles.summaryValue}>{statistics.length}</span>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tipo de Denuncia</th>
              <th style={styles.th}>Cantidad</th>
              <th style={styles.th}>Porcentaje</th>
              <th style={styles.th}>Visualización</th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((stat, index) => (
              <tr key={index} style={styles.tr}>
                <td style={styles.td}>{stat.categoria}</td>
                <td style={styles.tdNumber}>{stat.cantidad}</td>
                <td style={styles.tdNumber}>{stat.porcentaje}%</td>
                <td style={styles.td}>
                  <div style={styles.barContainer}>
                    <div 
                      style={{
                        ...styles.bar,
                        width: `${stat.porcentaje}%`,
                        backgroundColor: getBarColor(index)
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Distribución por Tipo de Denuncia</h3>
        <div style={styles.chart}>
          {statistics.map((stat, index) => (
            <div key={index} style={styles.chartItem}>
              <div style={styles.chartBarContainer}>
                <div 
                  style={{
                    ...styles.chartBar,
                    height: `${stat.porcentaje * 2}px`,
                    backgroundColor: getBarColor(index)
                  }}
                />
              </div>
              <div style={styles.chartLabel}>
                <span style={styles.chartCategory}>{stat.categoria}</span>
                <span style={styles.chartPercentage}>{stat.porcentaje}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.actions}>
        <Button
          text="Volver al Inicio"
          className="bg-gray-600 hover:bg-gray-700 text-white"
          onClick={() => navigate("/")}
        />
        <Button
          text="Realizar Denuncia"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => navigate("/complaint")}
        />
      </div>
      </div>
      <Footer />
    </div>
  );
};

// Función auxiliar para colores de barras
const getBarColor = (index) => {
  const colors = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", 
    "#84cc16", "#22c55e", "#14b8a6", "#06b6d4",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"
  ];
  return colors[index % colors.length];
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
    paddingBottom: "5rem",
    cursor: 'default',
  },
  header: {
    textAlign: "center",
    marginBottom: "0rem",
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
    fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
    color: "#000000",
    marginBottom: "2rem",
  },
  summaryCard: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  summaryItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1.5rem",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    minWidth: "150px",
  },
  summaryLabel: {
    fontSize: "1.1rem",
    color: "#000000",
    marginBottom: "0.5rem",
    fontWeight: "700",
  },
  summaryValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#000000",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    marginBottom: "2rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#f8fafc",
    padding: "1rem",
    textAlign: "left",
    fontWeight: "700",
    color: "#000000",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "1rem",
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "1rem",
    color: "#000000",
    fontSize: "1rem",
    fontWeight: "500",
  },
  tdNumber: {
    padding: "1rem",
    color: "#000000",
    fontWeight: "600",
    textAlign: "center",
  },
  barContainer: {
    width: "100%",
    height: "20px",
    backgroundColor: "#f3f4f6",
    borderRadius: "10px",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 0.3s ease",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    padding: "2rem",
    marginBottom: "2rem",
  },
  chartTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#000000",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  chart: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "300px",
    gap: "1rem",
  },
  chartItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  chartBarContainer: {
    display: "flex",
    alignItems: "flex-end",
    height: "200px",
    marginBottom: "0.5rem",
  },
  chartBar: {
    width: "40px",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.3s ease",
  },
  chartLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  chartCategory: {
    fontSize: "1rem",
    color: "#000000",
    marginBottom: "0.25rem",
    fontWeight: "700",
  },
  chartPercentage: {
    fontSize: "1rem",
    color: "#000000",
    fontWeight: "bold",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "400px",
  },
  loadingText: {
    fontSize: "1.25rem",
    color: "#6b7280",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem",
  },
  errorText: {
    fontSize: "1.125rem",
    color: "#dc2626",
    textAlign: "center",
  },
};

export default StatisticsContent;