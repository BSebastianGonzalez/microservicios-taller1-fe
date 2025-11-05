import React, { useEffect, useState, useRef } from "react";
import CommentService from "../../../../services/CommentService";

const CommentSection = ({ complaintId, adminId }) => {
  const [open, setOpen] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (open) {
      fetchComentarios();
    }
    // eslint-disable-next-line
  }, [open]);

  const fetchComentarios = async () => {
    setLoading(true);
    try {
      const data = await CommentService.getComentariosByDenunciaId(complaintId);
      setComentarios(data);
    } catch (error) {
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
      await CommentService.saveComentarioDenuncia({
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
    } catch (error) {
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
            comentarios.map((comentario) => (
              <div key={comentario.id} style={styles.commentItem}>
                <div style={styles.commentHeader}>
                  <span style={styles.adminName}>{comentario.admin?.nombre || "Administrador"}</span>
                  <span style={styles.commentDate}>
                    {comentario.fechaComentario
                      ? new Date(comentario.fechaComentario).toLocaleString()
                      : ""}
                  </span>
                </div>
                <div style={styles.commentText}>{comentario.comentario}</div>
              </div>
            ))
          )}
        </div>
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
    color: "#6b7280",
    padding: "2rem 0",
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
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
    color: "#9ca3af",
  },
  commentText: {
    backgroundColor: "#f3f4f6",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    color: "#000000",
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
};

export default CommentSection;