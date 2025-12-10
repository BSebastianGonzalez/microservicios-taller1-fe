import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppealService from '../../../services/AppealService';
import AppealResponseService from '../../../services/AppealResponseService';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import { FiFileText, FiExternalLink, FiX } from 'react-icons/fi';
import { openDocumentInNewTab, openDocumentFromUrl } from '../../../utils/documentViewer';

const AppealRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const complaintId = location.state?.complaintId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appeal, setAppeal] = useState(null);
  const [form, setForm] = useState({ 
    detalle: '', 
    resultado: 'ACEPTADA', 
    documentosSoporte: [] 
  });

  const [modal, setModal] = useState({ 
    open: false, 
    type: 'info', 
    title: '', 
    message: '', 
    onConfirm: null,
    confirmText: 'Aceptar',
    cancelText: null,
    onCancel: null
  });

  const adminId = (() => {
    try { 
      const admin = JSON.parse(localStorage.getItem('admin')); 
      return admin?.id || null; 
    } catch { 
      return null; 
    }
  })();

  useEffect(() => {
    const fetch = async () => {
      if (!complaintId) {
        setModal({ 
          open: true, 
          type: 'error', 
          title: 'Denuncia no encontrada', 
          message: 'No se encontró el ID de la denuncia.', 
          onConfirm: () => navigate('/read_complaint'),
          confirmText: 'Ir a denuncias'
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const a = await AppealService.obtenerPorDenuncia(complaintId);
        const normalized = Array.isArray(a) ? (a[0] || null) : (a || null);
        setAppeal(normalized);
      } catch (err) {
        console.error('Error cargando apelación:', err);
        setModal({ 
          open: true, 
          type: 'error', 
          title: 'Error', 
          message: 'No se pudo cargar la apelación.',
          confirmText: 'Cerrar'
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [complaintId, navigate]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        setModal({
          open: true,
          type: "error",
          title: "Archivo demasiado grande",
          message: `El archivo "${file.name}" es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Tamaño máximo permitido: 2MB`,
          onConfirm: null,
          confirmText: "Cerrar",
        });
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map((file, idx) => ({
      id: Date.now() + idx,
      file: file,
      nombre: file.name,
      tipo: file.type,
      tamaño: `(${(file.size / 1024).toFixed(0)} KB)`
    }));
    
    setForm(prev => ({
      ...prev,
      documentosSoporte: [...prev.documentosSoporte, ...newFiles]
    }));
    
    e.target.value = '';
  };

  const removeFile = (e, fileId) => {
    e.stopPropagation();
    setForm(prev => ({
      ...prev,
      documentosSoporte: prev.documentosSoporte.filter(f => f.id !== fileId)
    }));
  };

  const handleDocumentClick = (doc) => {
    try {
      if (doc.file && doc.file instanceof File) {
        openDocumentInNewTab(doc.file, doc.nombre, doc.tipo);
        return;
      }

      if (doc.url && !doc.file) {
        openDocumentFromUrl(doc.url, doc.nombre);
        return;
      }

      throw new Error('No se puede abrir el archivo. Formato no soportado.');
    } catch (err) {
      console.error('Error abriendo archivo:', err);
      setModal({
        open: true,
        type: 'error',
        title: 'Error al abrir archivo',
        message: err.message || 'No se pudo abrir el archivo.',
        onConfirm: null,
        confirmText: 'Cerrar',
      });
    }
  };

  const getFileIcon = (nombre) => {
    const extension = nombre?.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'pdf':
        return <FiFileText style={{ ...styles.documentIcon, color: '#dc2626' }} />;
      case 'doc':
      case 'docx':
        return <FiFileText style={{ ...styles.documentIcon, color: '#2563eb' }} />;
      case 'xls':
      case 'xlsx':
        return <FiFileText style={{ ...styles.documentIcon, color: '#059669' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FiFileText style={{ ...styles.documentIcon, color: '#7c3aed' }} />;
      default:
        return <FiFileText style={styles.documentIcon} />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!appeal?.id) {
      setModal({ 
        open: true, 
        type: 'error', 
        title: 'Apelación no encontrada', 
        message: 'No hay apelación asociada a esta denuncia.',
        confirmText: 'Cerrar'
      });
      return;
    }
    
    if (!form.detalle.trim()) {
      setModal({ 
        open: true, 
        type: 'error', 
        title: 'Detalle requerido', 
        message: 'Ingrese el detalle de la respuesta.',
        confirmText: 'Cerrar'
      });
      return;
    }
    
    if (!adminId) {
      setModal({ 
        open: true, 
        type: 'error', 
        title: 'Administrador no encontrado', 
        message: 'Inicie sesión de nuevo.',
        confirmText: 'Cerrar'
      });
      return;
    }

    setSaving(true);
    try {
      const dto = {
        apelacionId: appeal.id,
        adminId: adminId,
        detalle: form.detalle,
        resultado: form.resultado
      };

      // Enviar solo los objetos File al servicio (form.documentosSoporte contiene wrappers {file, nombre, ...})
      const archivosAEnviar = (form.documentosSoporte || []).map(d => d.file).filter(Boolean);
      await AppealResponseService.registrarRespuestaApelacion(dto, archivosAEnviar);

      setModal({ 
        open: true, 
        type: 'success', 
        title: 'Registrado', 
        message: 'Respuesta de apelación registrada correctamente.', 
        onConfirm: () => navigate('/complaint_checkout', { state: { complaintId, responseRegistered: true } }),
        confirmText: 'Ver detalles'
      });
    } catch (err) {
      console.error('Error guardando respuesta apelación:', err);
      setModal({ 
        open: true, 
        type: 'error', 
        title: 'Error', 
        message: err.message || 'No se pudo registrar la respuesta.',
        confirmText: 'Cerrar'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Cargando información de la apelación...</div>
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

      {/* Información de la apelación */}
      {appeal ? (
        <div style={styles.infoCard}>
          <div style={styles.infoHeader}>
            <h2 style={styles.infoTitle}>Información de la Apelación</h2>
            <span style={{
              ...styles.badge,
              backgroundColor: '#dbeafe',
              color: '#1e40af'
            }}>
              Apelación pendiente
            </span>
          </div>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.label}>Fecha de apelación:</span>
              <span style={styles.value}>
                {appeal.fechaCreacion || appeal.fechaApelacion 
                  ? new Date(appeal.fechaCreacion || appeal.fechaApelacion).toLocaleDateString() 
                  : 'N/A'}
              </span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>Autor:</span>
              <span style={styles.value}>
                {appeal.nombreAutor || appeal.nombre || appeal.usuario || 'Anónimo'}
              </span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>Detalle:</span>
              <span style={styles.value}>
                {appeal.detalle || appeal.descripcion || 'Sin detalle'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.infoCard}>
          <div style={styles.infoHeader}>
            <h2 style={styles.infoTitle}>Información de la Apelación</h2>
            <span style={{
              ...styles.badge,
              backgroundColor: '#f3f4f6',
              color: '#6b7280'
            }}>
              No encontrada
            </span>
          </div>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.value}>
                No se encontró una apelación para esta denuncia. Asegúrese de que exista una apelación pendiente.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de respuesta a apelación */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.fieldLabel}>
            Resultado de la Apelación <span style={styles.required}>*</span>
          </label>
          <select 
            value={form.resultado} 
            onChange={(e) => setForm(prev => ({ ...prev, resultado: e.target.value }))} 
            style={styles.select}
            onFocus={(e) => Object.assign(e.currentTarget.style, styles.selectFocus)}
            onBlur={(e) => Object.assign(e.currentTarget.style, styles.select)}
          >
            <option value="ACEPTADA">Aceptada</option>
            <option value="RECHAZADA">Rechazada</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.fieldLabel}>
            Detalle de la Respuesta <span style={styles.required}>*</span>
          </label>
          <textarea
            value={form.detalle}
            onChange={(e) => setForm(prev => ({ ...prev, detalle: e.target.value }))}
            placeholder="Describa detalladamente la respuesta a la apelación, incluyendo la justificación de la decisión..."
            style={styles.textarea}
            rows={8}
            required
            maxLength={2000}
            onFocus={(e) => Object.assign(e.currentTarget.style, styles.textareaFocus)}
            onBlur={(e) => Object.assign(e.currentTarget.style, styles.textarea)}
          />
          <div style={styles.charCount}>
            {form.detalle.length} / 2000 caracteres
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
                PDF, DOC, DOCX, JPG, PNG, XLSX (Max 2MB por archivo)
              </span>
            </label>
          </div>

          {form.documentosSoporte.length > 0 && (
            <div style={styles.documentsList}>
              <div style={styles.documentsTitle}>
                Documentos de Soporte ({form.documentosSoporte.length})
              </div>
              {form.documentosSoporte.map((doc, index) => {
                const esPdf = doc.nombre?.toLowerCase().endsWith('.pdf') || 
                             doc.tipo === 'application/pdf';
                
                return (
                  <div
                    key={doc.id || index}
                    style={{
                      ...styles.documentCard,
                      borderLeft: `4px solid ${esPdf ? '#dc2626' : '#3b82f6'}`
                    }}
                    onClick={() => handleDocumentClick(doc)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                      e.currentTarget.style.borderColor = "#3b82f6";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {getFileIcon(doc.nombre)}
                    <div style={styles.documentInfo}>
                      <span style={styles.documentName}>
                        {doc.nombre || `Documento ${index + 1}`}
                      </span>
                      {doc.tamaño && (
                        <span style={styles.documentSize}>{doc.tamaño}</span>
                      )}
                    </div>
                    <div style={styles.documentActions}>
                      <FiExternalLink style={styles.actionIcon} title="Abrir en nueva pestaña" />
                      <button
                        type="button"
                        onClick={(e) => removeFile(e, doc.id)}
                        style={styles.removeIconBtn}
                        title="Eliminar archivo"
                      >
                        <FiX style={styles.removeIcon} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={styles.warning}>
          <div style={styles.warningIcon}>⚠️</div>
          <div style={styles.warningText}>
            <strong>Importante:</strong> Una vez registrada la respuesta a la apelación, 
            el proceso de denuncia será finalizado según el resultado seleccionado.
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

      {/* Modal para mensajes */}
      {modal.open && (
        <Modal
          open={modal.open}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(prev => ({ ...prev, open: false }))}
          onConfirm={() => {
            setModal(prev => ({ ...prev, open: false }));
            modal.onConfirm && modal.onConfirm();
          }}
          confirmText={modal.confirmText}
          onCancel={modal.onCancel}
          cancelText={modal.cancelText}
          autoFocusConfirm={true}
        />
      )}
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    maxWidth: "100%",
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

  select: {
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

  selectFocus: {
    borderColor: "#dc2626",
    boxShadow: "0 0 0 3px rgba(220,38,38,0.1)",
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

  documentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  documentsTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "0.5rem",
  },

  documentCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  documentIcon: {
    fontSize: "1.25rem",
    color: "#6b7280",
    flexShrink: 0
  },

  documentInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    flex: 1
  },

  documentName: {
    fontWeight: "600",
    color: "#000000",
    fontSize: "0.9rem"
  },

  documentSize: {
    color: "#6b7280",
    fontSize: "0.8rem"
  },

  documentActions: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },

  actionIcon: {
    fontSize: "1rem",
    color: "#6b7280"
  },

  removeIconBtn: {
    padding: "4px",
    background: "transparent",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
  },

  removeIcon: {
    fontSize: "1.25rem",
    color: "#dc2626",
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

export default AppealRegistration;