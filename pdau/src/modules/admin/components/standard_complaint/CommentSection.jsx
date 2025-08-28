import React, { useEffect, useState, useRef } from "react";
import CommentService from "../../../../services/CommentService";

const CommentSection = ({ complaintId, adminId }) => {
  const [open, setOpen] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const sectionRef = useRef(null);

  // Cargar comentarios al abrir la sección
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
      // Desplaza hacia abajo al agregar comentario
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
    <div className="my-6">
      <button
        className="flex items-center gap-2 font-bold text-lg bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-all"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>
          {open ? "Ocultar comentarios" : "Ver comentarios"}
        </span>
        <span className="text-blue-600">({comentarios.length})</span>
        <svg
          className={`w-5 h-5 ml-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${open ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}
        style={{ transitionProperty: "all" }}
      >
        <div
          ref={sectionRef}
          className="bg-white border rounded-lg shadow p-4 max-h-72 overflow-y-auto transition-all"
        >
          {loading ? (
            <div className="text-center text-gray-500 py-8">Cargando comentarios...</div>
          ) : comentarios.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No hay comentarios aún.</div>
          ) : (
            comentarios.map((comentario) => (
              <div key={comentario.id} className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-blue-700">{comentario.admin?.nombre || "Administrador"}</span>
                  <span className="text-xs text-gray-400">
                    {comentario.fechaComentario
                      ? new Date(comentario.fechaComentario).toLocaleString()
                      : ""}
                  </span>
                </div>
                <div className="bg-gray-100 rounded px-3 py-2">{comentario.comentario}</div>
              </div>
            ))
          )}
        </div>
        <form
          onSubmit={handleEnviarComentario}
          className="flex gap-2 mt-4"
        >
          <input
            type="text"
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escribe un comentario..."
            className="flex-1 border rounded px-3 py-2"
            disabled={enviando}
            maxLength={500}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold transition"
            disabled={enviando || !nuevoComentario.trim()}
          >
            {enviando ? "Enviando..." : "Comentar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;