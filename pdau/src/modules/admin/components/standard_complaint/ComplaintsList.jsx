import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiFileText } from "react-icons/fi";
import ComplaintService from "../../../../services/ComplaintService";
import ResponseService from "../../../../services/ResponseService";
import ListContainer from "../../../../components/ListContainer";

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [estados, setEstados] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedEstadoId, setSelectedEstadoId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener datos reales del backend
        const [complaintsData, categoriesData, estadosData] = await Promise.all([
          ComplaintService.getUnarchivedComplaints(),
          ComplaintService.getAllCategories(),
          ComplaintService.getEstados()
        ]);

        console.log("Datos recibidos del backend:", {
          complaints: complaintsData,
          categories: categoriesData,
          estados: estadosData
        });

        // Procesar denuncias para asegurar estructura consistente
        const processedComplaints = Array.isArray(complaintsData) ? complaintsData : [];

        setComplaints(processedComplaints);
        setFilteredComplaints(processedComplaints);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setEstados(Array.isArray(estadosData) ? estadosData : []);

      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar las denuncias. Por favor, intente nuevamente.");
        
        // Datos de ejemplo como fallback
        const complaintsData = [
          {
            id: 1,
            titulo: "Acoso y hostigamiento dentro del campus",
            fechaCreacion: "2025-03-25T10:30:00",
            estado: { id: 2, nombre: "En revisión" },
            categorias: [
              { id: 1, nombre: "Acoso verbal" },
              { id: 2, nombre: "Acoso físico" }
            ]
          }
        ];

        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
        setCategories([]);
        setEstados([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ---------------- Filtros ---------------- */
  const toggleFilterModal = () => {
    if (!isFilterModalOpen) {
      setShowModal(true);
      setTimeout(() => setIsFilterModalOpen(true), 10);
    } else {
      setIsFilterModalOpen(false);
      setTimeout(() => setShowModal(false), 200);
    }
  };

  const applyFilters = async () => {
    try {
      let filtered = complaints;

      // Filtro por categoría
      if (selectedCategoryId) {
        filtered = filtered.filter((c) =>
          c.categorias?.some((cat) => String(cat.id) === selectedCategoryId)
        );
      }

      // Filtro por estado
      if (selectedEstadoId) {
        filtered = filtered.filter(
          (c) => String(c.estado?.id) === selectedEstadoId
        );
      }

      // Filtro por palabra clave
      if (keyword) {
        filtered = filtered.filter((c) =>
          c.titulo.toLowerCase().includes(keyword.toLowerCase())
        );
      }

      // Filtro por fecha
      if (fechaInicio) {
        filtered = filtered.filter((c) => {
          const complaintDate = new Date(c.fechaCreacion).toISOString().split('T')[0];
          return complaintDate >= fechaInicio;
        });
      }
      if (fechaFin) {
        filtered = filtered.filter((c) => {
          const complaintDate = new Date(c.fechaCreacion).toISOString().split('T')[0];
          return complaintDate <= fechaFin;
        });
      }

      setFilteredComplaints(filtered);
      setCurrentPage(1);
      toggleFilterModal();
    } catch (err) {
      console.error("Error al filtrar:", err);
    }
  };

  const clearFilters = () => {
    setSelectedCategoryId("");
    setSelectedEstadoId("");
    setKeyword("");
    setFechaInicio("");
    setFechaFin("");
    setFilteredComplaints(complaints);
    setCurrentPage(1);
  };

  /* --------------- Paginación --------------- */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => setCurrentPage(page);

  // Enriquecer únicamente las denuncias visibles en la página actual con la fecha de respuesta
  // Mover la lógica de enriquecimiento a un efecto separado que solo se ejecute una vez
useEffect(() => {
  let mounted = true;
  
  const fetchResponseDatesForPage = async () => {
    if (!currentComplaints || currentComplaints.length === 0) return;

    try {
      const enriched = await Promise.all(
        currentComplaints.map(async (complaint) => {
          // Si ya tenemos fechaRespuesta, omitimos la petición
          if (complaint.fechaRespuesta !== undefined) return complaint;
          
          try {
            const response = await ResponseService.obtenerRespuesta(complaint.id);
            
            // response ahora siempre será un objeto, nunca null
            if (response && response.fechaRespuesta) {
              console.log(`Respuesta encontrada para denuncia ${complaint.id}:`, response.fechaRespuesta);
              return { 
                ...complaint, 
                fechaRespuesta: response.fechaRespuesta 
              };
            } else {
              console.log(`No hay respuesta para denuncia ${complaint.id}`);
              return { 
                ...complaint, 
                fechaRespuesta: null 
              };
            }
          } catch (error) {
            console.warn(`Error obteniendo respuesta para denuncia ${complaint.id}:`, error);
            return { 
              ...complaint, 
              fechaRespuesta: null 
            };
          }
        })
      );

      if (!mounted) return;

      // Actualizar solo si hay cambios
      setFilteredComplaints(prev => {
        const newFiltered = [...prev];
        let hasChanges = false;
        
        for (let i = 0; i < enriched.length; i++) {
          const originalIndex = indexOfFirstItem + i;
          const originalComplaint = prev[originalIndex];
          const enrichedComplaint = enriched[i];
          
          if (originalComplaint && 
              originalComplaint.fechaRespuesta !== enrichedComplaint.fechaRespuesta) {
            newFiltered[originalIndex] = enrichedComplaint;
            hasChanges = true;
          }
        }
        
        return hasChanges ? newFiltered : prev;
      });
    } catch (err) {
      console.warn("Error general al enriquecer fechas:", err);
    }
  };

  // Solo ejecutar si hay denuncias sin fechaRespuesta
  const hasComplaintsWithoutDate = currentComplaints.some(
    complaint => complaint.fechaRespuesta === undefined
  );
  
  if (hasComplaintsWithoutDate) {
    fetchResponseDatesForPage();
  }
  
  return () => {
    mounted = false;
  };
}, [currentPage, currentComplaints, indexOfFirstItem]); // Solo se ejecuta una vez al montar el componente

  /* ----------------- Utils ------------------ */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Fecha inválida";
    
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  /* ---------------- Render ------------------ */
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Cargando denuncias...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorText}>{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          style={styles.retryButton}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes modalIn { from { opacity:.4; transform: translateY(6px) } to { opacity:1; transform: translateY(0) } }
        .complaints-date-input::-webkit-calendar-picker-indicator {
          transform: translateX(50px);
        }
      `}</style>

      {/* Botón filtros */}
      <div style={styles.rightDock}>
        <div style={styles.filterButtons}>
          <button
            onClick={toggleFilterModal}
            style={styles.filterBtn}
            type="button"
          >
            <span>Aplicar filtros de búsqueda</span>
            <FiFilter size={18} />
          </button>
          
          {(selectedCategoryId || selectedEstadoId || keyword || fechaInicio || fechaFin) && (
            <button
              onClick={clearFilters}
              style={styles.clearFilterBtn}
              type="button"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Información de resultados */}
      <div style={styles.resultsInfo}>
        Mostrando {filteredComplaints.length} de {complaints.length} denuncias
        {(selectedCategoryId || selectedEstadoId || keyword || fechaInicio || fechaFin) && (
          <span style={styles.filteredInfo}> (filtradas)</span>
        )}
      </div>

      {/* Tabla */}
      <ListContainer
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredComplaints.length}
        onPageChange={handlePageChange}
      >
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                  <th style={{ ...styles.th, width: "40%" }}>Título de denuncia</th>
                  <th style={{ ...styles.th, width: "15%" }}>Fecha de realización</th>
                  <th style={{ ...styles.th, width: "15%" }}>Fecha de respuesta</th>
                  <th style={{ ...styles.th, width: "15%" }}>Estado</th>
                  <th style={{ ...styles.th, width: "15%", textAlign: "center" }}>
                    Acciones
                  </th>
                </tr>
            </thead>
            <tbody>
              {currentComplaints.map((c) => (
                <tr key={c.id} style={styles.tr}>
                  <td
                    style={styles.tdTitle}
                    onClick={() =>
                      navigate("/complaint_checkout", {
                        state: { complaintId: c.id },
                      })
                    }
                  >
                    {c.titulo}
                  </td>
                  <td style={styles.td}>{formatDate(c.fechaCreacion)}</td>
                  <td style={styles.td}>{formatDate(c.fechaRespuesta)}</td>
                  <td style={styles.td}>{c.estado?.nombre || "N/A"}</td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        style={styles.linkBtn}
                        type="button"
                        onClick={() =>
                          navigate("/complaint_checkout", {
                            state: { complaintId: c.id },
                          })
                        }
                      >
                        <FiFileText size={18} />
                        <span>Revisar denuncia</span>
                      </button>
                    </td>
                </tr>
              ))}
              {currentComplaints.length === 0 && (
                <tr>
                  <td colSpan={5} style={styles.emptyCell}>
                    {complaints.length === 0 
                      ? "No hay denuncias registradas." 
                      : "No hay resultados para los filtros aplicados."
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ListContainer>

      {/* Modal filtros */}
      {showModal && (
        <div
          style={styles.backdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) toggleFilterModal();
          }}
        >
          <div
            style={{
              ...styles.modal,
              transform: isFilterModalOpen ? "translateY(0)" : "translateY(12px)",
              opacity: isFilterModalOpen ? 1 : 0,
            }}
          >
            <h2 style={styles.modalTitle}>Filtrar denuncias</h2>

            <div style={styles.field}>
              <label style={styles.label}>Categoría</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                style={styles.select}
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Estado</label>
              <select
                value={selectedEstadoId}
                onChange={(e) => setSelectedEstadoId(e.target.value)}
                style={styles.select}
              >
                <option value="">Todos</option>
                {estados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Palabras clave</label>
              <input
                type="text"
                placeholder="Buscar por título"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={styles.keywordInput}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Fecha desde</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  style={styles.dateInput}
                  className="complaints-date-input"
                />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Fecha hasta</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  style={styles.dateInput}
                  className="complaints-date-input"
                />
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={clearFilters}
                style={styles.btnClear}
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={toggleFilterModal}
                style={styles.btnSecondary}
              >
                Cancelar
              </button>
              <button type="button" onClick={applyFilters} style={styles.btnPrimary}>
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    boxSizing: "border-box",
    padding: "1rem 1rem 1rem",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
  },
  loadingText: {
    fontSize: "1.1rem",
    color: "#000000",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    gap: "1rem",
  },
  errorText: {
    fontSize: "1.1rem",
    color: "#dc2626",
    textAlign: "center",
  },
  retryButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  rightDock: {
    alignSelf: "flex-end",
    position: "sticky",
    top: 18,
    zIndex: 5,
    marginBottom: "0.9rem",
  },
  filterButtons: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  filterBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    background: "#f3f4f6",
    color: "#111827",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    boxShadow: "0 2px 6px rgba(2,6,23,0.06)",
    fontWeight: 700,
    cursor: "pointer",
  },
  clearFilterBtn: {
    padding: "10px 14px",
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  resultsInfo: {
    marginBottom: "1rem",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  filteredInfo: {
    color: "#2563eb",
    fontWeight: "600",
  },
  tableWrapper: {
    width: "100%",
    border: "1px solid #9ca3af",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(2,6,23,.06)",
    background: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    fontFamily: "'Inter','Segoe UI', Arial, sans-serif",
  },
  th: {
    textAlign: "left",
    padding: "12px 14px",
    background: "#9ca3af",
    color: "#111827",
    fontWeight: 800,
    fontSize: "0.98rem",
    borderBottom: "1px solid #9ca3af",
  },
  tr: {
    borderBottom: "1px solid #d1d5db",
  },
  td: {
    padding: "12px 14px",
    fontSize: "0.98rem",
    color: "#111827",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tdTitle: {
    padding: "12px 14px",
    fontSize: "1rem",
    color: "#2563eb",
    cursor: "pointer",
    textDecoration: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  linkBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#1f2937",
    background: "transparent",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
  },
  emptyCell: {
    padding: "18px 12px",
    textAlign: "center",
    color: "#6b7280",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 16,
    backdropFilter: "blur(2px)",
  },
  modal: {
    width: "min(520px, 100%)",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 24px 64px rgba(2,6,23,.18)",
    padding: "18px 18px 16px",
    transition: "all .2s ease",
    animation: "modalIn .2s ease-out",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.35rem",
    fontWeight: 900,
    color: "#0f172a",
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontWeight: 700,
    color: "#0f172a",
  },
  select: {
    width: "100%",
    height: "44px",
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "0.95rem",
    background: "#fff",
  },
  keywordInput: {
    width: "100%",
    height: "44px",
    boxSizing: "border-box",
    padding: "0 14px",
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#0f172a",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    outline: "none",
  },
  dateInput: {
    width: "100%",
    height: "44px",
    boxSizing: "border-box",
    padding: "0 14px 0 14px",
    paddingRight: "64px",
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#0f172a",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    outline: "none",
  },
  modalActions: {
    marginTop: 8,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  btnClear: {
    padding: "10px 14px",
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    marginRight: "auto",
  },
  btnSecondary: {
    padding: "10px 14px",
    background: "#f1f5f9",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "10px 14px",
    background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default ComplaintsList;