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
    <section style={styles.section}>
      {/* Modal de carga animado */}
      {loadingModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content(isLoadingModalOpen)}>
            <span style={modalStyles.title}>
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
            <span style={modalStyles.title}>
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
            <span style={modalStyles.title}>
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
            <span style={modalStyles.title}>
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
        Registro de denuncia anónima
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
    </section>
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
  title: {
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
  section: {
    position: "relative",
    padding: "2rem 1rem",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#ffffff", // Fondo blanco explícito
    minHeight: "400px", // Altura mínima para asegurar que se vea
  },
  title: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    textAlign: "center",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "1rem",
    letterSpacing: "0.025em",
  },
  obligatoryText: {
    textAlign: "left",
    color: "#6b7280",
    marginTop: "0.5rem",
    marginBottom: "2rem",
    fontSize: "0.875rem",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  fieldRow: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "2rem",
    padding: "1.5rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
  },
  fieldRowSmall: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
    padding: "1.5rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
  },
  fieldLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  obligatoryIcon: {
    width: "1.5rem",
    height: "1.5rem",
    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
  },
  hiddenObligatoryIcon: {
    width: "1.5rem",
    height: "1.5rem",
    visibility: "hidden",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: "0.875rem",
    fontStyle: "italic",
    textAlign: "center",
    padding: "1rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(1rem, 3vw, 1.5rem)",
    marginTop: "2rem",
    flexWrap: "wrap",
  },
};

export default RegisterSection;