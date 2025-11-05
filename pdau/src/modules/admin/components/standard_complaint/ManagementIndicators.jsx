import React, { useState, useEffect } from "react";
import ManagementIndicatorService from "../../../../services/ManagementIndicatorService";
import Button from "../../../../components/Button";

const ManagementIndicators = () => {
  const [indicatorsHistory, setIndicatorsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIndicatorsHistory();
  }, []);

  const fetchIndicatorsHistory = async () => {
    try {
      setLoading(true);
      const data = await ManagementIndicatorService.getIndicatorsHistory();
      setIndicatorsHistory(data);
    } catch (err) {
      setError("Error al cargar el historial de indicadores");
      console.error("Error fetching indicators:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIndicators = async () => {
    try {
      setGenerating(true);
      setError("");
      
      const newIndicator = await ManagementIndicatorService.generateResponseTimeIndicators();
      
      // Actualizar la lista con el nuevo indicador
      setIndicatorsHistory(prev => [newIndicator, ...prev]);
      
      // Mostrar mensaje de éxito
      alert("✅ Indicadores generados exitosamente");
      
    } catch (err) {
      setError("Error al generar los indicadores");
      console.error("Error generating indicators:", err);
    } finally {
      setGenerating(false);
    }
  };

  const getTimeRangeStyle = (porcentaje, esMas10Dias = false) => {
    let backgroundColor = "#f3f4f6";
    let color = "#374151";
    
    if (porcentaje >= 50) {
      backgroundColor = esMas10Dias ? "#fef2f2" : "#f0fdf4";
      color = esMas10Dias ? "#dc2626" : "#059669";
    } else if (porcentaje >= 30) {
      backgroundColor = "#fffbeb";
      color = "#d97706";
    }
    
    return { backgroundColor, color, fontWeight: "600" };
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingText}>Cargando indicadores de gestión...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <p style={styles.subtitle}>
          Monitoreo del desempeño en la atención de denuncias
        </p>
      </div>

      {/* Leyenda */}
      <div style={styles.legend}>
        <h4 style={styles.legendTitle}>Leyenda de Colores</h4>
        <div style={styles.legendItems}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: "#10b981"}}></div>
            <span>{"< 3 días (Óptimo)"}</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: "#f59e0b"}}></div>
            <span>3-5 días (Aceptable)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: "#f97316"}}></div>
            <span>5-10 días (Requiere atención)</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: "#dc2626"}}></div>
            <span>{"> 10 días (Crítico - Auditoría)"}</span>
          </div>
        </div>
      </div>

      {/* Panel de Control */}
      <div style={styles.controlPanel}>
        <div style={styles.controlInfo}>
          <h3 style={styles.controlTitle}>Generar Nuevos Indicadores</h3>
          <p style={styles.controlDescription}>
            Calcula automáticamente los tiempos de respuesta de las denuncias y genera reportes.
            Si más del 50% de denuncias tardan más de 10 días, se enviará una alerta al área de control interno.
          </p>
        </div>
        <Button
          text={generating ? "Generando..." : "🔄 Generar Indicadores"}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          onClick={handleGenerateIndicators}
          disabled={generating}
        />
      </div>

      {error && (
        <div style={styles.errorAlert}>
          <span style={styles.errorIcon}>⚠️</span>
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      {/* Historial de Indicadores */}
      <div style={styles.historySection}>
        <h2 style={styles.sectionTitle}>Historial de Indicadores Generados</h2>
        
        {indicatorsHistory.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📊</span>
            <p style={styles.emptyText}>No hay indicadores generados aún</p>
          </div>
        ) : (
          <div style={styles.indicatorsGrid}>
            {indicatorsHistory.map((indicator) => (
              <div key={indicator.id} style={styles.indicatorCard}>
                {/* Encabezado con fecha y alerta si aplica */}
                <div style={styles.cardHeader}>
                  <div style={styles.dateInfo}>
                    <span style={styles.dateLabel}>Generado el:</span>
                    <span style={styles.dateValue}>
                      {formatDateTime(indicator.fechaGeneracion)}
                    </span>
                  </div>
                  {indicator.requiereAuditoria && (
                    <div style={styles.auditAlert}>
                      <span style={styles.alertIcon}>🚨</span>
                      <span style={styles.alertText}>Auditoría Requerida</span>
                    </div>
                  )}
                </div>

                {/* Resumen General */}
                <div style={styles.summarySection}>
                  <div style={styles.totalComplaints}>
                    <span style={styles.totalLabel}>Total de Denuncias Analizadas:</span>
                    <span style={styles.totalValue}>{indicator.totalDenuncias}</span>
                  </div>
                </div>

                {/* Detalle por Rangos de Tiempo */}
                <div style={styles.rangesGrid}>
                  {/* Menos de 3 días */}
                  <div style={styles.rangeItem}>
                    <div style={styles.rangeHeader}>
                      <span style={styles.rangeLabel}>{"< 3 días"}</span>
                      <span style={styles.rangePercentage}>
                        {indicator.menos3Dias.porcentaje}%
                      </span>
                    </div>
                    <div style={styles.rangeBar}>
                      <div 
                        style={{
                          ...styles.rangeBarFill,
                          width: `${indicator.menos3Dias.porcentaje}%`,
                          backgroundColor: "#10b981"
                        }}
                      />
                    </div>
                    <div style={styles.rangeCount}>
                      {indicator.menos3Dias.cantidad} denuncias
                    </div>
                  </div>

                  {/* 3-5 días */}
                  <div style={styles.rangeItem}>
                    <div style={styles.rangeHeader}>
                      <span style={styles.rangeLabel}>3-5 días</span>
                      <span style={styles.rangePercentage}>
                        {indicator.entre3y5Dias.porcentaje}%
                      </span>
                    </div>
                    <div style={styles.rangeBar}>
                      <div 
                        style={{
                          ...styles.rangeBarFill,
                          width: `${indicator.entre3y5Dias.porcentaje}%`,
                          backgroundColor: "#f59e0b"
                        }}
                      />
                    </div>
                    <div style={styles.rangeCount}>
                      {indicator.entre3y5Dias.cantidad} denuncias
                    </div>
                  </div>

                  {/* 5-10 días */}
                  <div style={styles.rangeItem}>
                    <div style={styles.rangeHeader}>
                      <span style={styles.rangeLabel}>5-10 días</span>
                      <span style={styles.rangePercentage}>
                        {indicator.entre5y10Dias.porcentaje}%
                      </span>
                    </div>
                    <div style={styles.rangeBar}>
                      <div 
                        style={{
                          ...styles.rangeBarFill,
                          width: `${indicator.entre5y10Dias.porcentaje}%`,
                          backgroundColor: "#f97316"
                        }}
                      />
                    </div>
                    <div style={styles.rangeCount}>
                      {indicator.entre5y10Dias.cantidad} denuncias
                    </div>
                  </div>

                  {/* Más de 10 días */}
                  <div style={styles.rangeItem}>
                    <div style={styles.rangeHeader}>
                      <span style={styles.rangeLabel}>{"> 10 días"}</span>
                      <span style={{
                        ...styles.rangePercentage,
                        ...getTimeRangeStyle(indicator.mas10Dias.porcentaje, true)
                      }}>
                        {indicator.mas10Dias.porcentaje}%
                      </span>
                    </div>
                    <div style={styles.rangeBar}>
                      <div 
                        style={{
                          ...styles.rangeBarFill,
                          width: `${indicator.mas10Dias.porcentaje}%`,
                          backgroundColor: indicator.mas10Dias.porcentaje > 50 ? "#dc2626" : "#ef4444"
                        }}
                      />
                    </div>
                    <div style={styles.rangeCount}>
                      {indicator.mas10Dias.cantidad} denuncias
                    </div>
                  </div>
                </div>

                {/* Línea de tiempo de auditoría */}
                {indicator.requiereAuditoria && (
                  <div style={styles.auditTimeline}>
                    <div style={styles.timelineIcon}>📧</div>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineTitle}>Notificación Enviada</div>
                      <div style={styles.timelineDescription}>
                        Alerta enviada al área de control interno para auditoría
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "0.5rem",
    background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#000000",
    marginBottom: "2rem",
    marginTop: "0rem",
  },
  controlPanel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "2rem",
    padding: "1.5rem",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    marginBottom: "2rem",
  },
  controlInfo: {
    flex: 1,
  },
  controlTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "0.5rem",
  },
  controlDescription: {
    color: "#6b7280",
    lineHeight: "1.5",
  },
  errorAlert: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    marginBottom: "2rem",
  },
  errorIcon: {
    fontSize: "1.25rem",
  },
  errorText: {
    color: "#dc2626",
    fontWeight: "500",
  },
  historySection: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "1.5rem",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
    backgroundColor: "#f8fafc",
    border: "2px dashed #d1d5db",
    borderRadius: "12px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: "1.125rem",
  },
  indicatorsGrid: {
    display: "grid",
    gap: "1.5rem",
  },
  indicatorCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    padding: "1.5rem",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  dateInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  dateLabel: {
    fontSize: "0.875rem",
    color: "#6b7280",
    fontWeight: "500",
  },
  dateValue: {
    fontSize: "1rem",
    color: "#1f2937",
    fontWeight: "600",
  },
  auditAlert: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "20px",
  },
  alertIcon: {
    fontSize: "1rem",
  },
  alertText: {
    fontSize: "0.875rem",
    color: "#dc2626",
    fontWeight: "600",
  },
  summarySection: {
    marginBottom: "1.5rem",
    padding: "1rem",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  totalComplaints: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontWeight: "500",
    color: "#374151",
  },
  totalValue: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#1f2937",
  },
  rangesGrid: {
    display: "grid",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  rangeItem: {
    padding: "1rem",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  rangeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  rangeLabel: {
    fontWeight: "600",
    color: "#374151",
  },
  rangePercentage: {
    fontWeight: "600",
    color: "#1f2937",
  },
  rangeBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "0.5rem",
  },
  rangeBarFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  rangeCount: {
    fontSize: "0.875rem",
    color: "#6b7280",
    textAlign: "right",
  },
  auditTimeline: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "8px",
  },
  timelineIcon: {
    fontSize: "1.5rem",
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: "0.25rem",
  },
  timelineDescription: {
    fontSize: "0.875rem",
    color: "#0c4a6e",
  },
  legend: {
    padding: "1.5rem",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    marginBottom: "2rem",
  },
  legendTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#000000ff",
    marginBottom: "1rem",
    marginTop: "0rem",
  },
  legendItems: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  legendColor: {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
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
};

export default ManagementIndicators;