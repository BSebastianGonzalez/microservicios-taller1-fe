import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import Footer from '../../../../components/Footer';
import AppealService from '../../../../services/AppealService';

const Appeal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener denunciaId del state pasado por navegación
  const denunciaId = location.state?.complaint?.id || location.state?.complaintId || null;

  const [detalle, setDetalle] = useState('');
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ open: false, type: 'success', title: '', message: '', onConfirm: null, confirmText: 'Aceptar' });
  const [existingAppeal, setExistingAppeal] = useState(null);

  useEffect(() => {
    if (!denunciaId) {
      setModal({
        open: true,
        type: 'error',
        title: 'Denuncia no encontrada',
        message: 'No se encontró el ID de la denuncia. Regrese a la página anterior.',
        onConfirm: () => navigate(-1),
        confirmText: 'Volver'
      });
    }
    else {
      // Consultar si ya existe apelación para esta denuncia
      (async () => {
        try {
          const resp = await AppealService.obtenerPorDenuncia(denunciaId);
          if (resp) {
            setExistingAppeal(resp);
            setModal({
              open: true,
              type: 'info',
              title: 'Apelación existente',
              message: 'Ya existe una apelación para esta denuncia. No se puede registrar otra.',
              onConfirm: null,
              confirmText: 'Cerrar'
            });
          }
        } catch (err) {
          // Si devuelve 404 no hay apelación — silencioso
          console.debug(err?.message || err);
        }
      })();
    }
  }, [denunciaId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!detalle.trim()) {
      setModal({ open: true, type: 'error', title: 'Detalle requerido', message: 'Por favor ingrese el detalle de la apelación.', onConfirm: null, confirmText: 'Cerrar' });
      return;
    }

    if (!denunciaId) {
      setModal({ open: true, type: 'error', title: 'Denuncia no encontrada', message: 'No se pudo obtener el ID de la denuncia.', onConfirm: null, confirmText: 'Cerrar' });
      return;
    }

    try {
      setSaving(true);

      const dto = { denunciaId: Number(denunciaId), detalle: detalle.trim() };

      const formData = new FormData();
      const blob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
      formData.append('data', blob);

      // Si en el futuro se permiten archivos, podríamos append them as 'files'

      const created = await AppealService.crearApelacion(formData);

      setModal({
        open: true,
        type: 'success',
        title: 'Apelación registrada',
        message: 'La apelación se ha registrado correctamente.',
        onConfirm: () => navigate('/', { replace: true }),
        confirmText: 'Ir al inicio'
      });

      console.log('Apelación creada:', created);
    } catch (error) {
      console.error('Error creando apelación:', error);
      setModal({ open: true, type: 'error', title: 'Error', message: (error?.message || 'Ocurrió un error al enviar la apelación.'), onConfirm: null, confirmText: 'Cerrar' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
      <h2 style={styles.title}>Registrar Apelación</h2>
        <div style={styles.card}>
          {existingAppeal ? (
            <div style={{ width: '100%' }}>
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem', textAlign: 'left' }}>Apelación registrada</h3>
              <div style={{ padding: '1rem', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                <div style={{ marginBottom: '0.5rem', color: '#6b7280' }}>Detalle:</div>
                <div style={{ whiteSpace: 'pre-wrap', marginBottom: '0.75rem', color: '#000000' }}>{existingAppeal.detalle || existingAppeal.descripcion || existingAppeal.contenido}</div>
                {existingAppeal.fechaCreacion && (
                  <div style={{ color: '#6b7280' }}>Fecha: {new Date(existingAppeal.fechaCreacion).toLocaleString()}</div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Detalle de la apelación <span style={styles.required}>*</span></label>
                <textarea
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  placeholder="Describa los motivos de la apelación..."
                  rows={8}
                  style={styles.textarea}
                  maxLength={2000}
                  required
                />
                <div style={styles.charCount}>{detalle.length} / 2000</div>
              </div>

              <div style={styles.actions}>
                <Button text="Cancelar" className="bg-gray-200 text-black" onClick={() => navigate(-1)} disabled={saving} />
                <Button type="submit" text={saving ? 'Enviando...' : 'Registrar Apelación'} className="bg-red-600 text-white" disabled={saving} />
              </div>
            </form>
          )}
        </div>
      </div>

      {modal.open && (
        <Modal
          open={modal.open}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(prev => ({ ...prev, open: false }))}
          onConfirm={() => { setModal(prev => ({ ...prev, open: false })); modal.onConfirm && modal.onConfirm(); }}
          confirmText={modal.confirmText}
        />
      )}
      <Footer />
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    cursor: 'default',
    backgroundColor: '#f8fafc'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    flex: 1,
    boxSizing: 'border-box',
    padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)',
    paddingBottom: '5rem',
    cursor: 'default'
  },
  card: {
    width: '100%',
    maxWidth: 'min(90vw, 800px)',
    background: '#fff',
    borderRadius: '1.2rem',
    boxShadow: '0 4px 24px 0 rgba(37,99,235,0.10)',
    padding: 'clamp(2rem, 4vw, 2.5rem) clamp(1.5rem, 3vw, 2rem)',
    textAlign: 'center',
    marginBottom: '2rem',
    marginTop: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  title: { 
    fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
    fontWeight: "900",
    textAlign: "center",
    marginTop: "-1rem",
    marginBottom: "3.5rem",
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
    wordBreak: "break-word",
},
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem', 
    width: '100%' 
},
  field: { 
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%' 
},
  label: { 
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    fontWeight: "bold",
    marginBottom: "1rem",
    marginTop: "-1rem",
    color: "#000000" 
},
  required: { color: '#dc2626' },
  textarea: { 
    padding: 12, 
    borderRadius: 8,
    border: '1px solid #e5e7eb', 
    resize: 'vertical', 
    minHeight: 140,
    fontSize: '0.9rem',
    fontFamily: 'Inter, Arial, sans-serif', 
    width: '100%' 
},
  charCount: { textAlign: 'right', color: '#6b7280', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: '0.5rem', width: '100%' }
};

export default Appeal;
