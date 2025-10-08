import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiFileText } from "react-icons/fi";
import ComplaintService from "../../../../services/ComplaintService";
import ListContainer from "../../../../components/ListContainer";

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [estados, setEstados] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedDepartamentoId, setSelectedDepartamentoId] = useState("");
  const [selectedEstadoId, setSelectedEstadoId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintsData = await ComplaintService.getUnarchivedComplaints();
        const categoriesData = await ComplaintService.getAllCategories();
        const departamentosData = await ComplaintService.getAllDepartamentos();
        const estadosData = ComplaintService.getEstados
          ? await ComplaintService.getEstados()
          : [];
        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
        setCategories(categoriesData);
        setDepartamentos(departamentosData);
        setEstados(estadosData);
      } catch (err) {
        console.error("Error al cargar:", err);
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

      if (selectedDepartamentoId) {
        filtered = await ComplaintService.getComplaintsByDepartment(
          selectedDepartamentoId
        );
      }
      if (selectedCategoryId) {
        filtered = filtered.filter((c) =>
          c.categorias?.some((cat) => String(cat.id) === selectedCategoryId)
        );
      }
      if (selectedEstadoId) {
        filtered = filtered.filter(
          (c) => String(c.estado?.id) === selectedEstadoId
        );
      }
      if (keyword) {
        filtered = filtered.filter((c) =>
          c.titulo.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      if (fechaInicio) {
        filtered = filtered.filter((c) => c.fechaCreacion >= fechaInicio);
      }
      if (fechaFin) {
        filtered = filtered.filter((c) => c.fechaCreacion <= fechaFin);
      }

      setFilteredComplaints(filtered);
      setCurrentPage(1);
      toggleFilterModal();
    } catch (err) {
      console.error("Error al filtrar:", err);
    }
  };

  /* --------------- Paginación --------------- */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => setCurrentPage(page);

  /* ----------------- Utils ------------------ */
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  /* ---------------- Render ------------------ */
  return (
    <div style={styles.page}>
      <style>{`@keyframes modalIn { from { opacity:.4; transform: translateY(6px) } to { opacity:1; transform: translateY(0) } }`}</style>

      {/* Título */}
      <h1 style={styles.title}>Denuncias anónimas</h1>

      {/* Botón filtros anclado a la derecha (sticky) */}
      <div style={styles.rightDock}>
        <button
          onClick={toggleFilterModal}
          style={styles.filterBtn}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}
          type="button"
        >
          <span>Aplicar filtros de búsqueda</span>
          <FiFilter size={18} />
        </button>
      </div>

      {/* Tabla: ancho completo */}
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
                <th style={{ ...styles.th, width: "60%" }}>Título de denuncia</th>
                <th style={{ ...styles.th, width: "20%" }}>Fecha de realización</th>
                <th style={{ ...styles.th, width: "20%", textAlign: "center" }}>
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
                  <td colSpan={3} style={styles.emptyCell}>
                    No hay resultados para los filtros aplicados.
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
              <label style={styles.label}>Departamento</label>
              <select
                value={selectedDepartamentoId}
                onChange={(e) => setSelectedDepartamentoId(e.target.value)}
                style={styles.select}
              >
                <option value="">Todos</option>
                {departamentos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>

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
                onFocus={(e) =>
                  Object.assign(e.currentTarget.style, styles.keywordInputFocus)
                }
                onBlur={(e) =>
                  Object.assign(e.currentTarget.style, styles.keywordInput)
                }
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Fecha desde</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  style={styles.dateInput}
                  onFocus={(e) =>
                    Object.assign(e.currentTarget.style, styles.dateInputFocus)
                  }
                  onBlur={(e) =>
                    Object.assign(e.currentTarget.style, styles.dateInput)
                  }
                />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Fecha hasta</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  style={styles.dateInput}
                  onFocus={(e) =>
                    Object.assign(e.currentTarget.style, styles.dateInputFocus)
                  }
                  onBlur={(e) =>
                    Object.assign(e.currentTarget.style, styles.dateInput)
                  }
                />
              </div>
            </div>

            <div style={styles.modalActions}>
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

/* ================== ESTILOS ================== */
const styles = {
  // Área de contenido: deja el sidebar (260px) y ocupa todo el ancho restante
  page: {
    marginLeft: "260px",
    width: "calc(100% - 260px)",
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "2.2rem 1.5rem 3rem",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
  },

  title: {
    fontFamily: "'Inter','Segoe UI', Arial, sans-serif",
    fontSize: "3rem",
    fontWeight: 900,
    color: "#0f172a",
    margin: "0 0 1rem 0",
    textAlign: "center",
    lineHeight: 1.1,
  },

  // Dock derecho: botón sticky
  rightDock: {
    alignSelf: "flex-end",
    position: "sticky",
    top: 18, // se mantiene visible al hacer scroll
    zIndex: 5,
    marginBottom: "0.9rem",
  },

  filterBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    marginBottom: 15,
    background: "#f3f4f6",
    color: "#111827",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    boxShadow: "0 2px 6px rgba(2,6,23,0.06)",
    fontWeight: 700,
    cursor: "pointer",
  },

  // Wrapper y tabla full width
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

  /* ----- Modal ----- */
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

  // Inputs mejorados (palabras clave y fechas)
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
    transition: "border-color .18s ease, box-shadow .18s ease",
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
  },
  keywordInputFocus: {
    borderColor: "#2563eb",
    boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
  },
  dateInput: {
    width: "100%",
    height: "44px",
    boxSizing: "border-box",
    padding: "0 14px 0 14px",
    paddingRight: "40px",
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#0f172a",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    outline: "none",
    transition: "border-color .18s ease, box-shadow .18s ease",
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "textfield",
  },
  dateInputFocus: {
    borderColor: "#2563eb",
    boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
  },

  modalActions: {
    marginTop: 8,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
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
