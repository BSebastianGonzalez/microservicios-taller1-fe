import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryStatisticsService from "../../../../services/CategoryStatisticsService";
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
      setError("");
      
      // ✅ USAR DATOS REALES DEL BACKEND
      const data = await CategoryStatisticsService.getCategoryStatistics();
      console.log('📈 Datos recibidos del backend:', data);
      
      // Mapear los datos del DTO EstadisticaCategoriaDTO al formato del frontend
      // USANDO LOS NOMBRES CORRECTOS DE CAMPOS
      const formattedData = Array.isArray(data)
        ? data.map(item => ({
            categoria: item?.nombreCategoria ?? "Sin categoría",
            cantidad: Number(item?.totalDenuncias ?? 0),
            porcentaje: Number(Number(item?.porcentaje ?? 0).toFixed(1))
          }))
        : [];
      
      console.log('🔄 Datos formateados:', formattedData);
      setStatistics(formattedData);
      
    } catch (err) {
      console.error("❌ Error fetching statistics:", err);
      setError("Error al cargar las estadísticas desde el servidor");
      
      // Datos de fallback temporal
      const datosFallback = [
        { categoria: "Cargando...", cantidad: 0, porcentaje: 0 }
      ];
      setStatistics(datosFallback);
    } finally {
      setLoading(false);
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
          <div style={styles.loadingSubtext}>Conectando con el servidor</div>
        </div>
      </div>
    );
  }

  if (error && statistics[0]?.categoria === "Cargando...") {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
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
            Consulta el número y porcentaje de denuncias realizadas por categoría
          </p>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Total de Denuncias</span>
            <span style={styles.summaryValue}>{totalDenuncias}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Categorías</span>
            <span style={styles.summaryValue}>{statistics.length}</span>
          </div>
        </div>

        {error && (
          <div style={styles.warningAlert}>
            <span style={styles.warningIcon}>⚠️</span>
            <span style={styles.warningText}>
              {error} Mostrando datos disponibles.
            </span>
          </div>
        )}

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Categoría de Denuncia</th>
                <th style={styles.th}>Cantidad</th>
                <th style={styles.th}>Porcentaje</th>
                <th style={styles.th}>Visualización</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.categoryName}>
                      {stat.categoria}
                    </div>
                  </td>
                  <td style={styles.tdNumber}>
                    <strong>{stat.cantidad}</strong>
                  </td>
                  <td style={styles.tdNumber}>
                    <strong>{stat.porcentaje}%</strong>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.barContainer}>
                      <div 
                        style={{
                          ...styles.bar,
                          width: `${Math.min(stat.porcentaje, 100)}%`,
                          backgroundColor: getBarColor(index)
                        }}
                        title={`${stat.porcentaje}% - ${stat.cantidad} denuncias`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Distribución por Categoría de Denuncia</h3>
          <div style={styles.chart}>
            {statistics.map((stat, index) => (
              <div key={index} style={styles.chartItem}>
                <div style={styles.chartBarContainer}>
                  <div 
                    style={{
                      ...styles.chartBar,
                      height: `${Math.min(stat.porcentaje * 2, 200)}px`,
                      backgroundColor: getBarColor(index)
                    }}
                  />
                </div>
                <div style={styles.chartLabel}>
                  <span style={styles.chartCategory}>
                    {((stat.categoria ?? "").length > 12
                      ? (stat.categoria ?? "").substring(0, 12) + "..."
                      : stat.categoria ?? "Sin categoría")}
                  </span>
                  <span style={styles.chartPercentage}>{stat.porcentaje ?? 0}%</span>
                  <span style={styles.chartCount}>({stat.cantidad ?? 0})</span>
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
          <Button
            text="Actualizar Datos"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.location.reload()}
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
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
    "#ec4899", "#f43f5e"
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
  warningAlert: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    backgroundColor: "#fffbeb",
    border: "1px solid #fef3c7",
    borderRadius: "8px",
    marginBottom: "1rem",
    width: "100%",
    maxWidth: "800px",
  },
  warningIcon: {
    fontSize: "1.25rem",
  },
  warningText: {
    color: "#92400e",
    fontWeight: "500",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    marginBottom: "2rem",
    width: "100%",
    maxWidth: "1000px",
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
  categoryName: {
    fontWeight: "600",
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
    minWidth: "3%",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    padding: "2rem",
    marginBottom: "2rem",
    width: "100%",
    maxWidth: "1000px",
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
    gap: "0.5rem",
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
    minHeight: "5px",
  },
  chartLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  chartCategory: {
    fontSize: "0.875rem",
    color: "#000000",
    marginBottom: "0.25rem",
    fontWeight: "600",
  },
  chartPercentage: {
    fontSize: "1rem",
    color: "#000000",
    fontWeight: "bold",
  },
  chartCount: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "400px",
    gap: "1rem",
  },
  loadingText: {
    fontSize: "1.25rem",
    color: "#6b7280",
  },
  loadingSubtext: {
    fontSize: "1rem",
    color: "#9ca3af",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem",
  },
  errorIcon: {
    fontSize: "3rem",
  },
  errorText: {
    fontSize: "1.125rem",
    color: "#dc2626",
    textAlign: "center",
  },
};

export default StatisticsContent;