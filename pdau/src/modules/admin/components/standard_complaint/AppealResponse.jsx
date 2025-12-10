import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppealService from '../../../../services/AppealService';
import Button from '../../../../components/Button';
import { FiFileText, FiExternalLink } from 'react-icons/fi';

const AppealResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const complaintId = location.state?.complaintId || new URLSearchParams(window.location.search).get('complaintId') || new URLSearchParams(window.location.search).get('id');

  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppeal = async () => {
      if (!complaintId) {
        setError('ID de denuncia no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await AppealService.obtenerPorDenuncia(complaintId);
        // Normalizar: si viene arreglo tomar el primero
        const a = Array.isArray(data) ? (data[0] || null) : (data || null);
        setAppeal(a);
      } catch (err) {
        console.error('Error obteniendo apelación:', err);
        setError('No se pudo cargar la apelación');
      } finally {
        setLoading(false);
      }
    };

    fetchAppeal();
  }, [complaintId]);

  // Formatear fechas para mostrar de forma legible
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return 'Fecha inválida';
      return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const handleOpenDoc = (doc) => {
    if (!doc) return;
    const url = doc.url || doc.ruta || doc.path || doc.downloadUrl;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) return <div style={styles.loadingContainer}><div style={styles.loadingText}>Cargando apelación...</div></div>;
  if (error) return (
    <div style={styles.page}><div style={styles.errorContainer}><div style={styles.errorText}>{error}</div>
      <Button text="Volver" onClick={() => navigate(-1)} className="bg-red-600 text-white" />
    </div><Footer/></div>
  );

  if (!appeal) return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.subtitle}>Apelación</h2>
        <div style={styles.noDocuments}>No se encontró ninguna apelación para esta denuncia.</div>
        <div style={{ marginTop: 16 }}>
          <Button text="Volver a denuncias" onClick={() => navigate('/read_complaint')} className="bg-red-600 text-white" />
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.infoBox}>
          <div style={styles.infoItem}><strong>Fecha de apelación:</strong> {formatDate(appeal.fechaCreacion || appeal.fechaApelacion)}</div>
          <div style={styles.infoItem}><strong>Autor:</strong> {appeal.nombreAutor || appeal.nombre || appeal.usuario || 'Anónimo'}</div>
        </div>

        <div style={styles.detailSection}>
          <h4 style={styles.detailTitle}>Detalle</h4>
          <div style={styles.responseDetail}>{appeal.detalle || appeal.descripcion || appeal.contenido || 'Sin detalle'}</div>
        </div>

        {appeal.documentos && appeal.documentos.length > 0 && (
          <div style={styles.documentsSection}>
            <h4 style={styles.documentsTitle}>Documentos ({appeal.documentos.length})</h4>
            <div style={styles.documentsList}>
              {appeal.documentos.map((doc, idx) => (
                <div key={doc.id || idx} style={{ ...styles.documentCard, cursor: doc.url ? 'pointer' : 'default' }} onClick={() => doc.url && handleOpenDoc(doc)}>
                  <FiFileText style={styles.documentIcon} />
                  <div style={styles.documentInfo}>
                    <span style={styles.documentName}>{doc.nombre || doc.fileName || `Documento ${idx+1}`}</span>
                    {doc.tamaño && <span style={styles.documentSize}>{doc.tamaño}</span>}
                  </div>
                  <div style={styles.documentActions}>
                    {doc.url && <FiExternalLink style={styles.actionIcon} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
          <Button text="Volver" onClick={() => navigate(-1)} className="bg-gray-200 text-black" />
          <Button text="Ir a denuncia" onClick={() => navigate('/complaint_checkout', { state: { complaintId } })} className="bg-red-600 text-white" />
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: 20, background: '#f8fafc', minHeight: '100vh' },
  card: { maxWidth: 800, margin: '24px auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 6px 18px rgba(2,6,23,.06)' },
  subtitle: { fontSize: '1.5rem', fontWeight: 800, color: '#2563eb', marginBottom: 8 },
  infoBox: { display: 'flex', gap: 12, flexDirection: 'column', marginBottom: 12 },
  infoItem: { color: '#0f172a' },
  detailSection: { marginBottom: 12 },
  detailTitle: { fontWeight: 700 },
  responseDetail: { padding: 12, background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 8, whiteSpace: 'pre-wrap' },
  documentsSection: { marginTop: 12 },
  documentsTitle: { fontWeight: 700, marginBottom: 8 },
  documentsList: { display: 'flex', flexDirection: 'column', gap: 8 },
  documentCard: { display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 },
  documentIcon: { fontSize: '1.25rem', color: '#6b7280' },
  documentInfo: { flex: 1, display: 'flex', flexDirection: 'column' },
  documentName: { fontWeight: 700 },
  documentSize: { color: '#6b7280', fontSize: '0.85rem' },
  documentActions: { display: 'flex', alignItems: 'center' },
  actionIcon: { fontSize: '1rem', color: '#6b7280' },
  loadingContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  loadingText: { color: '#6b7280' },
  errorContainer: { padding: 20, textAlign: 'center' },
  errorText: { color: '#dc2626' },
  noDocuments: { padding: 12, color: '#6b7280' }
};

export default AppealResponse;
