import React, { useEffect, useState } from "react";
import Tag from "../../../../components/Tag";
import TextField from "../../../../components/TextField";
import CategorySelector from "./CategorySelector";
import FileUploader from "./FileUploader";
import Button from "../../../../components/Button";
import { useNavigate } from "react-router-dom";
import ComplaintService from "../../../../services/ComplaintService";

const RegisterSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

  // Modales personalizados
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ComplaintService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (loadingModal) {
      setTimeout(() => setIsLoadingModalOpen(true), 10);
    } else {
      setIsLoadingModalOpen(false);
    }
  }, [loadingModal]);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
  };


  const handleSubmit = async () => {
    if (!title || !description || selectedCategories.length === 0) {
      setShowIncompleteModal(true);
      return;
    }

    setLoadingModal(true);

    const complaintData = {
      titulo: title,
      descripcion: description,
      categoriasIds: selectedCategories.map((category) => category.id),
    };

    try {
      const response = await ComplaintService.createComplaint(complaintData);
      const token = response.token;
      
      setLoadingModal(false);
      navigate("/finished_register", { state: { token } });
    } catch {
      setLoadingModal(false);
      setErrorMessage("Hubo un error al registrar la denuncia. Inténtelo nuevamente.");
      setShowErrorModal(true);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    // Navega a la página anterior en el historial
    window.history.back();
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
  };

  const closeIncompleteModal = () => {
    setShowIncompleteModal(false);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
      {/* Modal de carga animado */}
      {loadingModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content(isLoadingModalOpen)}>
            <span style={modalStyles.titlemodal}>
              Enviando denuncia. Esto podría demorar un poco.
            </span>
            <div style={modalStyles.progressBarContainer}>
              <div style={modalStyles.progressBar}></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de cancelación */}
      {showCancelModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content(true)}>
            <span style={modalStyles.titlemodal}>
              ¿Estás seguro de que deseas cancelar la denuncia?
            </span>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <Button
                text="Sí, cancelar"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmCancel}
              />
              <Button
                text="No, continuar"
                className="bg-gray-300 hover:bg-gray-400 text-black"
                onClick={closeCancelModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de campos obligatorios incompletos */}
      {showIncompleteModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content(true)}>
            <span style={modalStyles.titlemodal}>
              Por favor, complete todos los campos obligatorios antes de enviar la denuncia.
            </span>
            <Button
              text="Entendido"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={closeIncompleteModal}
              style={{ marginTop: "1rem" }}
            />
          </div>
        </div>
      )}

      {/* Modal de error al registrar */}
      {showErrorModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content(true)}>
            <span style={modalStyles.titlemodal}>
              {errorMessage}
            </span>
            <Button
              text="Cerrar"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={closeErrorModal}
              style={{ marginTop: "1rem" }}
            />
          </div>
        </div>
      )}

      <h1 style={styles.title}>
        Registro de Denuncia Anónima
      </h1>
      <p style={styles.obligatoryText}>
        Los campos obligatorios se indican con{" "}
        <img
          src="img/obligatory.svg"
          alt="Campo obligatorio"
          style={styles.obligatoryIcon}
        />
      </p>

      {/* Campo de Título */}
      <div style={styles.fieldRow}>
        <div style={styles.fieldLabel}>
          <img
            src="img/obligatory.svg"
            alt="Campo obligatorio"
            style={styles.obligatoryIcon}
          />
          <Tag text="Título" />
        </div>
        <TextField
          placeholder="Escribe un título corto, claro y conciso"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Campo de Descripción */}
      <div style={styles.fieldRowSmall}>
        <div style={styles.fieldLabel}>
          <img
            src="img/obligatory.svg"
            alt="Campo obligatorio"
            style={styles.obligatoryIcon}
          />
          <Tag text="Descripción" />
        </div>
        <TextField
          placeholder="Añade una descripción detallada"
          height="h-32"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Campo de Seleccionar Categoría */}
      <div style={styles.fieldRowSmall}>
        <div style={styles.fieldLabel}>
          <img
            src="img/obligatory.svg"
            alt="Campo obligatorio"
            style={styles.obligatoryIcon}
          />
          <Tag text="Seleccionar categoría" />
        </div>
        {loading ? (
          <p style={styles.loadingText}>Cargando categorías...</p>
        ) : (
          <CategorySelector
            categories={categories}
            onSelect={handleCategorySelect}
          />
        )}
      </div>


      {/* Botones de acción */}
      <div style={styles.actionButtons}>
        <Button
          text="Enviar denuncia"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleSubmit}
        />
        <Button
          text="Cancelar"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleCancel}
        />
      </div>
      </div>
    </div>
  );
};

// Estilos para los modales
const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(4px)",
    transition: "background 0.3s",
  },
  content: (isOpen) => ({
    backgroundColor: "#fff",
    borderRadius: "1rem",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    padding: "2.5rem 2rem 2rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "340px",
    minHeight: "120px",
    maxWidth: "90vw",
    maxHeight: "90vh",
    transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
    transform: isOpen ? "translateY(0)" : "translateY(100%)",
    opacity: isOpen ? 1 : 0,
    border: "1.5px solid #e5e7eb",
    position: "relative",
    overflow: "hidden",
  }),
  titlemodal: {
    fontSize: "1.15rem",
    fontWeight: 700,
    marginBottom: "1.2rem",
    textAlign: "center",
    color: "#1f2937",
    lineHeight: "1.5",
    letterSpacing: "0.01em",
  },
  progressBarContainer: {
    width: "16rem",
    height: "0.75rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "9999px",
    overflow: "hidden",
    marginBottom: "0.5rem",
    border: "1px solid #e5e7eb",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #dc2626 0%, #ef4444 100%)",
    width: "60%",
    animation: "pulse-bar 1.5s infinite",
    borderRadius: "9999px",
  },
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
    maxWidth: "100%",
    margin: "0 auto",
    flex: 1,
    boxSizing: "border-box",
    padding: "3.5rem 1rem",
    //padding: "3.5rem clamp(0rem, 2vw, 0rem)",
    paddingBottom: "11rem",
    cursor: 'default',
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
    fontWeight: "900",
    textAlign: "center",
    marginTop: "-5rem",
    marginBottom: "1.5rem",
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
    boxSizing: "border-box",
  },
  obligatoryText: {
    textAlign: "center",
    color: "#000000",
    marginBottom: "1rem",
    fontSize: "clamp(0.875rem, 2vw, 1.2rem)",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    maxWidth: "min(90vw, 600px)",
    padding: "1rem",
    //backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: "0.75rem",
    //border: "1px solid #e5e7eb",
    //boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
  fieldRow: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "2rem",
    padding: "clamp(1.5rem, 3vw, 2rem)",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: "1rem",
    border: "1px solid #e5e7eb",
    width: "100%",
    maxWidth: "min(90vw, 800px)",
    boxSizing: "border-box",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  fieldRowSmall: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1.5rem",
    padding: "clamp(1.5rem, 3vw, 2rem)",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: "1rem",
    border: "1px solid #e5e7eb",
    width: "100%",
    maxWidth: "min(90vw, 800px)",
    boxSizing: "border-box",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  fieldLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.75rem",
  },
  obligatoryIcon: {
    width: "clamp(1.25rem, 2vw, 1.5rem)",
    height: "clamp(1.25rem, 2vw, 1.5rem)",
    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
  },
  hiddenObligatoryIcon: {
    width: "clamp(1.25rem, 2vw, 1.5rem)",
    height: "clamp(1.25rem, 2vw, 1.5rem)",
    visibility: "hidden",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: "clamp(0.875rem, 2vw, 1rem)",
    fontStyle: "italic",
    textAlign: "center",
    padding: "1.5rem",
    backgroundColor: "rgba(243,244,246,0.8)",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
    width: "100%",
    boxSizing: "border-box",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(1rem, 3vw, 2rem)",
    marginTop: "3rem",
    flexWrap: "wrap",
    width: "100%",
    maxWidth: "min(90vw, 600px)",
  },
};

export default RegisterSection;