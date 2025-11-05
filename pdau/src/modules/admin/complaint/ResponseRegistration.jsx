import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ComplaintService from "../../../services/ComplaintService";
import ResponseService from "../../../services/ResponseService";
import Button from "../../../components/Button";

const ResponseRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const complaintId = location.state?.complaintId;

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [responseData, setResponseData] = useState({
    detalleRespuesta: "",
    documentosSoporte: [],
    diasApelacion: 15
  });

  const adminId = (() => {
    try {
      const admin = JSON.parse(localStorage.getItem("admin"));
      return admin?.id || null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchComplaint = async () => {
      // DATOS ESTÁTICOS PARA VISUALIZACIÓN
      const datosEstaticos = {
        id: 1,
        titulo: "Acoso y hostigamiento dentro del campus",
        descripcion: "Se han presentado situaciones de acoso verbal y físico por parte de un profesor hacia varios estudiantes dentro de la facultad.",
        fechaCreacion: "2025-03-25T10:30:00",
        estado: { id: 2, nombre: "En revisión" },
        departamento: { id: 1, nombre: "Decanatura de Ciencias" }
      };

      // Simular delay de carga
      setTimeout(() => {
        setComplaint(datosEstaticos);
        setLoading(false);
      }, 500);

      // CÓDIGO REAL COMENTADO - Descomentar cuando tengas el backend
      /*
      if (!complaintId) {
        navigate("/read_complaint");
        return;
      }
      try {
        const data = await ComplaintService.getComplaintById(complaintId);
        setComplaint(data);
      } catch (error) {
        console.error("Error al cargar denuncia:", error);
        alert("Error al cargar la denuncia");
        navigate("/read_complaint");
      } finally {
        setLoading(false);
      }
      */
    };
    fetchComplaint();
  }, [complaintId, navigate]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file, idx) => ({
      id: Date.now() + idx,
      file: file,
      nombre: file.name,
      tipo: file.type,
      tamaño: (file.size / 1024).toFixed(2) + " KB"
    }));
    
    setResponseData(prev => ({
      ...prev,
      documentosSoporte: [...prev.documentosSoporte, ...newFiles]
    }));
  };

  const removeFile = (fileId) => {
    setResponseData(prev => ({
      ...prev,
      documentosSoporte: prev.documentosSoporte.filter(f => f.id !== fileId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!responseData.detalleRespuesta.trim()) {
      alert("Por favor ingrese el detalle de la respuesta");
      return;
    }

    if (!adminId) {
      alert("No se pudo obtener el ID del administrador");
      return;
    }

    setSaving(true);
    
    // SIMULACIÓN CON DATOS ESTÁTICOS
    setTimeout(() => {
      console.log("Respuesta registrada (datos estáticos):", {
        idDenuncia: complaintId,
        idAdministrador: adminId,
        detalleRespuesta: responseData.detalleRespuesta,
        diasApelacion: responseData.diasApelacion,
        documentosSoporte: responseData.documentosSoporte.map(d => d.nombre),
        fechaRespuesta: new Date().toISOString(),
        nuevoEstado: "Respondida"
      });

      setSaving(false);
      alert("¡Respuesta registrada exitosamente! (Simulación)");
      navigate("/complaint_checkout", { 
        state: { 
          complaintId,
          responseRegistered: true 
        } 
      });
    }, 1500);

    // CÓDIGO REAL COMENTADO - Descomentar cuando tengas el backend
    /*
    try {
      await ResponseService.registrarRespuesta({
        idDenuncia: complaintId,
        idAdministrador: adminId,
        detalleRespuesta: responseData.detalleRespuesta,
        diasApelacion: responseData.diasApelacion,
        documentosSoporte: responseData.documentosSoporte
      });

      navigate("/complaint_checkout", { 
        state: { 
          complaintId,
          responseRegistered: true 
        } 
      });
    } catch (error) {
      console.error("Error al registrar respuesta:", error);
      alert("Error al guardar la respuesta. Por favor intente nuevamente.");
    } finally {
      setSaving(false);
    }
    */
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Cargando información...</div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorText}>No se encontró la denuncia</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button
          onClick={() => navigate("/complaint_checkout", { state: { complaintId } })}
          style={styles.backBtn}
          onMouseEnter={(e) => e.currentTarget.style.background = "#d1d5db"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#e5e7eb"}
        >
          <svg style={styles.icon} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a detalles de denuncia
        </button>
      </div>

      <div style={styles.infoCard}>
        <div style={styles.infoHeader}>
          <h2 style={styles.infoTitle}>Información de la Denuncia</h2>
          <span style={styles.badge}>{complaint.estado?.nombre || "Sin estado"}</span>
        </div>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.label}>Título:</span>
            <span style={styles.value}>{complaint.titulo}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.label}>Fecha de creación:</span>
            <span style={styles.value}>
              {complaint.fechaCreacion ? new Date(complaint.fechaCreacion).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.fieldLabel}>
            Detalle de la Respuesta <span style={styles.required}>*</span>
          </label>
          <textarea
            value={responseData.detalleRespuesta}
            onChange={(e) => setResponseData(prev => ({ ...prev, detalleRespuesta: e.target.value }))}
            placeholder="Describa detalladamente la respuesta dada a la denuncia, incluyendo acciones tomadas, resultados de investigación y decisiones..."
            style={styles.textarea}
            rows={8}
            required
            maxLength={2000}
            onFocus={(e) => Object.assign(e.currentTarget.style, styles.textareaFocus)}
            onBlur={(e) => Object.assign(e.currentTarget.style, styles.textarea)}
          />
          <div style={styles.charCount}>
            {responseData.detalleRespuesta.length} / 2000 caracteres
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.fieldLabel}>
            Días para Apelación/Reposición <span style={styles.required}>*</span>
          </label>
          <input
            type="number"
            value={responseData.diasApelacion}
            onChange={(e) => setResponseData(prev => ({ ...prev, diasApelacion: parseInt(e.target.value) || 0 }))}
            min="1"
            max="90"
            style={styles.numberInput}
            required
            onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
            onBlur={(e) => Object.assign(e.currentTarget.style, styles.numberInput)}
          />
          <div style={styles.helpText}>
            El denunciante tendrá {responseData.diasApelacion} días para apelar o solicitar reposición
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.fieldLabel}>
            Documentos de Soporte
          </label>
          <div style={styles.uploadArea}>
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileUpload}
              style={styles.fileInput}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
            />
            <label htmlFor="file-upload" style={styles.uploadLabel}>
              <svg style={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span style={styles.uploadText}>
                Haz clic para seleccionar archivos
              </span>
              <span style={styles.uploadHint}>
                PDF, DOC, DOCX, JPG, PNG, XLSX (Max 10MB por archivo)
              </span>
            </label>
          </div>

          {responseData.documentosSoporte.length > 0 && (
            <div style={styles.filesList}>
              <div style={styles.filesHeader}>
                Archivos adjuntos ({responseData.documentosSoporte.length})
              </div>
              {responseData.documentosSoporte.map((file) => (
                <div key={file.id} style={styles.fileItem}>
                  <div style={styles.fileInfo}>
                    <span style={styles.fileName}>{file.nombre}</span>
                    <span style={styles.fileSize}>{file.tamaño}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    style={styles.removeBtn}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.warning}>
          <div style={styles.warningIcon}>⚠️</div>
          <div style={styles.warningText}>
            <strong>Importante:</strong> Una vez registrada la respuesta, el estado de la denuncia 
            se actualizará automáticamente a "Respondida" y se calculará la fecha límite de apelación.
          </div>
        </div>

        <div style={styles.actions}>
          <Button
            text="Cancelar"
            className="bg-gray-200 hover:bg-gray-300 text-black"
            onClick={() => navigate("/complaint_checkout", { state: { complaintId } })}
            disabled={saving}
          />
          <Button
            type="submit"
            text={saving ? "Guardando respuesta..." : "Registrar Respuesta"}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={saving}
          />
        </div>
      </form>
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    maxWidth: "100%", // prevent children from causing overflow wider than viewport
    boxSizing: "border-box",
    margin: 0,
    padding: "1rem",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    minHeight: "100vh",
  },

  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#f9fafb",
  },

  loadingText: {
    fontSize: "1.25rem",
    color: "#000000",
  },

  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#f9fafb",
  },

  errorText: {
    fontSize: "1.25rem",
    color: "#dc2626",
  },

  header: {
    marginBottom: "1rem",
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
    color: "#2463eb",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },

  icon: {
    width: 20,
    height: 20,
  },

  infoCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  infoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },

  infoTitle: {
    fontSize: "1.25rem",
    fontWeight: 800,
    color: "#000000",
    margin: 0,
  },

  badge: {
    padding: "6px 14px",
    background: "#dbeafe",
    color: "#1e40af",
    borderRadius: 20,
    fontSize: "0.875rem",
    fontWeight: 600,
  },

  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  infoItem: {
    display: "flex",
    gap: 8,
  },

  label: {
    fontWeight: 700,
    color: "#000000",
    minWidth: "140px",
  },

  value: {
    color: "#000000",
    flex: 1,
  },

  form: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  field: {
    marginBottom: "1rem",

  },

  fieldLabel: {
    display: "block",
    fontWeight: 700,
    color: "#000000",
    fontSize: "1.125rem",
    marginBottom: "0.5rem",
  },

  required: {
    color: "#dc2626",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    fontSize: "0.95rem",
    color: "#000000",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    outline: "none",
    resize: "vertical",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },

  textareaFocus: {
    borderColor: "#dc2626",
    boxShadow: "0 0 0 3px rgba(220,38,38,0.1)",
  },

  charCount: {
    marginTop: "0.5rem",
    fontSize: "0.875rem",
    color: "#000000",
    textAlign: "right",
    marginBottom: "-1rem",
  },

  numberInput: {
    width: "200px",
    padding: "10px 14px",
    fontSize: "0.95rem",
    color: "#000000",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },

  inputFocus: {
    borderColor: "#dc2626",
    boxShadow: "0 0 0 3px rgba(220,38,38,0.1)",
  },

  helpText: {
    marginTop: "0.5rem",
    fontSize: "0.875rem",
    color: "#64748b",
  },

  uploadArea: {
    position: "relative",
    marginBottom: "1rem",
  },

  fileInput: {
    position: "absolute",
    width: "0.1px",
    height: "0.1px",
    opacity: 0,
    overflow: "hidden",
    zIndex: -1,
  },

  uploadLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    background: "#f8fafc",
    border: "2px dashed #cbd5e1",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.2s",
  },

  uploadIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
    color: "#6b7280",
  },

  uploadText: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#000000",
    marginBottom: 4,
  },

  uploadHint: {
    fontSize: "0.875rem",
    color: "#94a3b8",
  },

  filesList: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "1rem",
  },

  filesHeader: {
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "0.75rem",
    fontSize: "0.95rem",
  },

  fileItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    marginBottom: "0.5rem",
  },

  fileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },

  fileName: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#000000",
  },

  fileSize: {
    fontSize: "0.8rem",
    color: "#000000",
  },

  removeBtn: {
    padding: "4px 8px",
    background: "transparent",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    color: "#dc2626",
    fontSize: "1.5rem",
    transition: "background 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },

  warning: {
    display: "flex",
    gap: 12,
    padding: "1rem",
    background: "#fef3c7",
    border: "1px solid #fbbf24",
    borderRadius: 8,
    marginBottom: "1.5rem",
  },

  warningIcon: {
    fontSize: "1.5rem",
  },

  warningText: {
    fontSize: "0.9rem",
    color: "#78350f",
    lineHeight: 1.5,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    paddingTop: "1rem",
    borderTop: "1px solid #e2e8f0",
  },
};

export default ResponseRegistration;