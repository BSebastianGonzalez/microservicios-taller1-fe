import React, { useEffect, useState, useRef } from "react";
import CommentService from "../../../../services/CommentService";

const CommentSection = ({ complaintId, adminId }) => {
  const [open, setOpen] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Obtener el conteo y comentarios iniciales al montar o cuando cambie el complaintId
    if (complaintId) fetchComentarios();
    // eslint-disable-next-line
  }, [complaintId]);

  const fetchComentarios = async () => {
    setLoading(true);
    try {
      const data = await CommentService.getComentariosByDenunciaId(complaintId);
      setComentarios(data);
    } catch {
      setComentarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    setEnviando(true);
    try {
      // Enviar ambos nombres de campo para compatibilidad con distintos backends
      // El modelo Java usa `contenido`, por eso debemos enviarlo para que no quede null
      await CommentService.saveComentarioDenuncia({
        contenido: nuevoComentario,
        comentario: nuevoComentario,
        idDenuncia: complaintId,
        idAdmin: adminId,
      });
      setNuevoComentario("");
      await fetchComentarios();
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollTop = sectionRef.current.scrollHeight;
        }
      }, 100);
    } catch {
      // Manejo de error opcional
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.toggleButton}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>
          {open ? "Ocultar comentarios" : "Ver comentarios"}
        </span>
        <span style={styles.commentCount}>({comentarios.length})</span>
        <svg
          style={{
            ...styles.arrowIcon,
            transform: open ? "rotate(180deg)" : "rotate(0deg)"
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        style={{
          ...styles.content,
          maxHeight: open ? "600px" : "0px",
          opacity: open ? 1 : 0,
          marginTop: open ? "1rem" : "0px"
        }}
      >
        <div
          ref={sectionRef}
          style={styles.commentsList}
        >
          {loading ? (
            <div style={styles.loadingText}>Cargando comentarios...</div>
          ) : comentarios.length === 0 ? (
            <div style={styles.emptyText}>No hay comentarios aún.</div>
          ) : (
            comentarios.map((comentario) => {
              // Compatibilidad: soportar varias formas de representar autor, fecha y texto
              const author = comentario?.admin?.nombre || comentario.nombreAdmin || comentario.adminNombre || comentario.autor || "Administrador";
              const dateRaw = comentario.fechaComentario || comentario.fecha || comentario.fechaCreacion || comentario.createdAt || comentario.created_at || null;
              const dateStr = dateRaw ? new Date(dateRaw).toLocaleString() : "";
              const text = comentario.contenido ?? comentario.comentario ?? comentario.texto ?? comentario.descripcion ?? comentario.body ?? "";
              const commentKey = comentario.id ?? comentario._id ?? comentario._idComentario ?? Math.random();
              const commentOwnerId = comentario.idAdmin ?? comentario.idUsuario ?? comentario.adminId ?? null;
              const idToDelete = comentario.id ?? comentario._id ?? comentario._idComentario ?? null;

              return (
                <div key={commentKey} style={styles.commentItem}>
                  <div style={styles.commentHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={styles.adminName}>{author}</span>
                      <span style={styles.commentDate}>{dateStr}</span>
                    </div>
                    {/* Acción eliminar: visible si adminId coincide o si existe adminId */}
                    {adminId && idToDelete && String(adminId) === String(commentOwnerId) && (
                      <button
                        style={styles.deleteButton}
                        onClick={() => {
                          setPendingDelete({ id: idToDelete, text, author, date: dateStr });
                          setShowDeleteModal(true);
                        }}
                        disabled={deletingIds.includes(idToDelete)}
                      >
                        {deletingIds.includes(idToDelete) ? "Eliminando..." : "Eliminar"}
                      </button>
                    )}
                  </div>
                  <div style={styles.commentText}>{text}</div>
                </div>
              );
            })
          )}
        </div>
        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && pendingDelete && (
          <div style={styles.modalBackdrop} onClick={() => setShowDeleteModal(false)}>
            <div style={styles.modalBox} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <h3 style={styles.modalTitle}>Confirmar eliminación</h3>
              <div style={styles.modalBody}>
                <p>¿Estás seguro de eliminar este comentario?</p>
                <div style={{ marginTop: 8, padding: 8, background: "#f8fafc", borderRadius: 6 }}>
                  <div style={{ fontWeight: 700, color: "#1d4ed8" }}>{pendingDelete.author}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{pendingDelete.date}</div>
                  <div style={{ marginTop: 6 }}>{pendingDelete.text}</div>
                </div>
              </div>
              <div style={styles.modalActions}>
                <button style={styles.btnCancel} onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                <button
                  style={styles.btnConfirm}
                  onClick={async () => {
                    const id = pendingDelete.id;
                    try {
                      setDeletingIds((s) => [...s, id]);
                      await CommentService.deleteComentario(id);
                      setComentarios((prev) => prev.filter((c) => {
                        const key = c.id ?? c._id ?? c._idComentario ?? null;
                        return String(key) !== String(id);
                      }));
                      setShowDeleteModal(false);
                      setPendingDelete(null);
                    } catch (err) {
                      console.error("Error al eliminar comentario:", err);
                      alert("No se pudo eliminar el comentario");
                    } finally {
                      setDeletingIds((s) => s.filter((x) => String(x) !== String(id)));
                    }
                  }}
                >Eliminar</button>
              </div>
            </div>
          </div>
        )}
        <form
          onSubmit={handleEnviarComentario}
          style={styles.form}
        >
          <input
            type="text"
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escribe un comentario..."
            style={styles.input}
            disabled={enviando}
            maxLength={500}
          />
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              opacity: (enviando || !nuevoComentario.trim()) ? 0.6 : 1
            }}
            disabled={enviando || !nuevoComentario.trim()}
          >
            {enviando ? "Enviando..." : "Comentar"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    margin: "1.5rem 0",
  },
  toggleButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "bold",
    fontSize: "1.125rem",
    backgroundColor: "#e5e7eb",
    color: "#000000",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  commentCount: {
    color: "#2563eb",
  },
  arrowIcon: {
    width: "1.25rem",
    height: "1.25rem",
    marginLeft: "0.25rem",
    transition: "transform 0.3s",
  },
  content: {
    overflow: "hidden",
    transition: "all 0.5s ease",
  },
  commentsList: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "1rem",
    maxHeight: "18rem",
    overflowY: "auto",
    transition: "all 0.3s ease",
  },
  loadingText: {
    textAlign: "center",
    color: "#000000ff",
    padding: "2rem 0",
  },
  emptyText: {
    textAlign: "center",
    color: "#000000",
    padding: "2rem 0",
  },
  commentItem: {
    marginBottom: "1rem",
  },
  commentHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.25rem",
  },
  adminName: {
    fontWeight: 600,
    color: "#1d4ed8",
  },
  commentDate: {
    fontSize: "0.75rem",
    color: "#000000",
  },
  commentText: {
    backgroundColor: "#f3f4f6",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    color: "#000000",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 16,
  },
  modalBox: {
    width: "min(520px, 100%)",
    background: "#fff",
    borderRadius: 12,
    padding: "18px",
    boxShadow: "0 24px 64px rgba(2,6,23,.18)",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#111827",
    marginBottom: 8,
  },
  modalBody: {
    marginBottom: 12,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },
  btnCancel: {
    padding: "8px 12px",
    background: "#f1f5f9",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnConfirm: {
    padding: "8px 12px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  },
  form: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  input: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s, opacity 0.2s",
  },
  deleteButton: {
    background: "transparent",
    fontSize: "0.875rem",
    color: "#dc2626",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default CommentSection;