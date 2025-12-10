import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiCalendar, FiFilter, FiFileText } from 'react-icons/fi';
import AdminService from '../../../services/AdminService';
import AuditoriaService from '../../../services/AuditoriaService';
import ComplaintService from '../../../services/ComplaintService';

const TABS = {
  ARCHIVOS: 'archivaciones',
  TOTALES: 'totales',
  RESPUESTAS: 'respuestas',
  RESPUESTAS_APEL: 'respuestas-apelacion',
  COMENTARIOS: 'comentarios'
};

const AuditActions = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(true);
  
  const renderRef = (...vals) => {
    for (const v of vals) {
      if (v === null || v === undefined || v === '') continue;
      if (typeof v === 'object') {
        if (v.titulo) return v.titulo;
        if (v.title) return v.title;
        if (v.descripcion) return v.descripcion;
        if (v.descripcionComentario) return v.descripcionComentario;
        if (v.id) return String(v.id);
        if (v._id) return String(v._id);
        try { return JSON.stringify(v); } catch { continue; }
      }
      return String(v);
    }
    return '-';
  };

  const formatDate = (val) => {
    if (!val) return '-';
    if (typeof val === 'object') {
      if (val.fechaCreacion) val = val.fechaCreacion;
      else if (val.fecha_creacion) val = val.fecha_creacion;
      else if (val.fechaArchivado) val = val.fechaArchivado;
      else if (val.fecha_archivado) val = val.fecha_archivado;
      else if (val.fechaArchivar) val = val.fechaArchivar;
      else if (val.fecha_archivar) val = val.fecha_archivar;
      else if (val.fechaRespuesta) val = val.fechaRespuesta;
      else if (val.fecha_respuesta) val = val.fecha_respuesta;
      else if (val.createdAt) val = val.createdAt;
      else if (val.created_at) val = val.created_at;
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString();
    }
    return String(val);
  };

  const [tab, setTab] = useState(TABS.TOTALES);
  const [totals, setTotals] = useState(null);
  const [totalsLoading, setTotalsLoading] = useState(false);
  const [totalsError, setTotalsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [archivados, setArchivados] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [respuestasApelacion, setRespuestasApelacion] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(adminId || '');
  const [complaintsCache, setComplaintsCache] = useState({});
  const [archivedStatusMap, setArchivedStatusMap] = useState({});
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [archiveStatus, setArchiveStatus] = useState('all');
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  const resolveAdminId = (adminObj) => (
    adminObj?.id ?? adminObj?._id ?? adminObj?.admin?.id ?? adminObj?.admin?._id ?? adminObj?.user?.id ?? adminObj?.user?._id ?? null
  );

  const resolveAdminLabel = (adminObj) => (
    adminObj?.nombre || adminObj?.name || adminObj?.correo || adminObj?.email || adminObj?.admin?.nombre || adminObj?.admin?.name || adminObj?.admin?.correo || adminObj?.admin?.email || null
  );

  const getDenunciaFromCache = (id) => {
    if (!id) return null;
    return complaintsCache[id] || null;
  };

  const formatDenunciaLabel = (denunciaObj, denunciaId) => {
    const fallback = !denunciaObj && denunciaId ? getDenunciaFromCache(denunciaId) : null;
    const ref = denunciaObj || fallback;
    if (!ref && denunciaId) return 'Denuncia';
    const title = ref?.titulo || ref?.nombre || ref?.asunto || ref?.tema || ref?.categoria;
    if (title) return title;
    const desc = ref?.descripcion || ref?.detalle || ref?.resumen;
    if (desc) return String(desc);
    return 'Denuncia';
  };

  const extractComplaintId = (it) => (
    it?.denunciaId || it?.denuncia?.id || it?.denuncia?._id || it?.id || null
  );

  const clearFilters = () => {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setArchiveStatus('all');
  };

  const formatDenunciaLabelSinId = (denunciaObj, denunciaId) => formatDenunciaLabel(denunciaObj, denunciaId);

  // Normalizar fecha para comparación (inicio del día en zona local)
  const normalizeDate = (val) => {
    if (!val) return null;
    if (typeof val === 'object') {
      if (val.fechaArchivar) val = val.fechaArchivar;
      else if (val.fecha_archivar) val = val.fecha_archivar;
      else if (val.fechaCambio) val = val.fechaCambio;
      else if (val.fechaComentario) val = val.fechaComentario;
      else if (val.fecha_comentario) val = val.fecha_comentario;
      else if (val.fechaRespuesta) val = val.fechaRespuesta;
      else if (val.fecha_respuesta) val = val.fecha_respuesta;
      else if (val.fechaCreacion) val = val.fechaCreacion;
      else if (val.fecha_creacion) val = val.fecha_creacion;
      else if (val.fechaArchivado) val = val.fechaArchivado;
      else if (val.fecha_archivado) val = val.fecha_archivado;
      else if (val.createdAt) val = val.createdAt;
      else if (val.created_at) val = val.created_at;
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  // Verificar si una fecha está en el rango seleccionado (mejorado)
  const inDateRange = (itemDate) => {
    const d = normalizeDate(itemDate);
    if (!d) return true; // Si no hay fecha, incluir por defecto
    
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      const itemDateNormalized = new Date(d);
      itemDateNormalized.setHours(0, 0, 0, 0);
      if (itemDateNormalized < from) return false;
    }
    
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (d > to) return false;
    }
    
    return true;
  };

  const matchesSearch = (denunciaObj, denunciaId) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const candidates = [];
    if (typeof denunciaObj === 'string') candidates.push(denunciaObj);
    if (denunciaObj && typeof denunciaObj === 'object') {
      candidates.push(denunciaObj.nombre, denunciaObj.titulo, denunciaObj.tokenSeguimiento, denunciaObj.asunto);
    }
    if (!denunciaObj && denunciaId) {
      const cached = complaintsCache[denunciaId];
      if (cached) {
        candidates.push(cached.nombre, cached.titulo, cached.tokenSeguimiento, cached.asunto);
      }
    }
    return candidates.filter(Boolean).some(c => String(c).toLowerCase().includes(s));
  };

  useEffect(() => {
    if (!AdminService.isSpecialAdmin()) {
      setAuthorized(false);
      navigate('/admin_main', { replace: true, state: { denied: true } });
      return;
    }

    const loadAdmins = async () => {
      const current = AdminService.getCurrentAdmin();
      const currentId = resolveAdminId(current);
      const fallbackAdminOption = currentId
        ? [{ id: currentId, nombre: resolveAdminLabel(current) || 'Admin actual' }]
        : [];

      try {
        const list = await AdminService.getAllAdmins();
        const normalized = Array.isArray(list) ? list : [];
        const seen = new Set();
        const combined = [...normalized, ...fallbackAdminOption].filter((a) => {
          const idVal = resolveAdminId(a);
          if (!idVal) return false;
          if (seen.has(idVal)) return false;
          seen.add(idVal);
          return true;
        });
        setAdmins(combined);
        if (!selectedAdminId && combined.length > 0) {
          const firstId = resolveAdminId(combined[0]);
          if (firstId) setSelectedAdminId(String(firstId));
        }
      } catch (err) {
        console.warn('No se pudo cargar la lista de administradores', err);
        if (fallbackAdminOption.length > 0) {
          setAdmins(fallbackAdminOption);
          if (!selectedAdminId) setSelectedAdminId(String(fallbackAdminOption[0].id));
        }
      }
    };

    

    loadAdmins();
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [adminId, navigate, selectedAdminId]);

  // Cargar datos cuando cambie el admin seleccionado
  useEffect(() => {
    if (!selectedAdminId) return;
    
    const load = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [a, r, c, ra, archivedList, unarchivedList] = await Promise.allSettled([
          AuditoriaService.getArchivamientosByAdminId(selectedAdminId),
          AuditoriaService.getRespuestasByAdminId(selectedAdminId),
          AuditoriaService.getComentariosByAdminId(selectedAdminId),
          AuditoriaService.getRespuestasApelacionByAdminId(selectedAdminId),
          ComplaintService.getArchivedComplaints(),
          ComplaintService.getUnarchivedComplaints()
        ]);
        
        if (a.status === 'fulfilled') setArchivados(Array.isArray(a.value) ? a.value : []);
        if (r.status === 'fulfilled') setRespuestas(Array.isArray(r.value) ? r.value : []);
        if (c.status === 'fulfilled') setComentarios(Array.isArray(c.value) ? c.value : []);
        if (ra.status === 'fulfilled') setRespuestasApelacion(Array.isArray(ra.value) ? ra.value : []);

        // Construir mapa de estado archivado usando las listas del backend
        const map = {};
        
        if (archivedList.status === 'fulfilled') {
          const archived = Array.isArray(archivedList.value) ? archivedList.value : [];
          archived.forEach((item) => {
            const id = item?.id ?? item?._id ?? item?.denunciaId ?? item?.denuncia_id;
            const token = item?.tokenSeguimiento ?? item?.token;
            if (id) map[id] = true;
            if (token) map[token] = true;
          });
        }
        
        if (unarchivedList.status === 'fulfilled') {
          const unarchived = Array.isArray(unarchivedList.value) ? unarchivedList.value : [];
          unarchived.forEach((item) => {
            const id = item?.id ?? item?._id ?? item?.denunciaId ?? item?.denuncia_id;
            const token = item?.tokenSeguimiento ?? item?.token;
            if (id) map[id] = false;
            if (token) map[token] = false;
          });
        }
        
        setArchivedStatusMap(map);
      } catch (err) {
        setError('Error cargando acciones administrativas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [selectedAdminId]);

  // Cargar detalles de denuncias faltantes
  useEffect(() => {
    const loadMissingComplaints = async () => {
      const ids = new Set();
      const collectId = (it) => {
        const maybeId = it?.denunciaId || it?.denuncia?.id || it?.denuncia?._id || it?.id_denuncia || it?.idDenuncia;
        if (maybeId) ids.add(maybeId);
      };
      
      archivados.forEach(collectId);
      respuestas.forEach(collectId);
      respuestasApelacion.forEach(collectId);
      comentarios.forEach(collectId);

      const pendingIds = Array.from(ids).filter((id) => !complaintsCache[id]);
      if (pendingIds.length === 0) return;

      try {
        const results = await Promise.allSettled(
          pendingIds.map((id) => ComplaintService.getComplaintById(id))
        );
        
        setComplaintsCache((prev) => {
          const next = { ...prev };
          results.forEach((res, idx) => {
            const id = pendingIds[idx];
            if (res.status === 'fulfilled' && res.value) {
              next[id] = res.value;
            }
          });
          return next;
        });
      } catch (err) {
        console.warn('No se pudieron cargar algunas denuncias', err);
      }
    };
    
    loadMissingComplaints();
  }, [archivados, respuestas, respuestasApelacion, comentarios]);

  // Cargar totales (global o por admin seleccionado)
  useEffect(() => {
    let mounted = true;
    const loadTotals = async () => {
      setTotalsLoading(true);
      setTotalsError(null);
      try {
        let data;
        // If both dateFrom and dateTo provided, call range endpoints (send ISO Z)
        const hasRange = dateFrom && dateTo;
        const startIso = hasRange ? new Date(dateFrom).toISOString() : null;
        const endIso = hasRange ? new Date(dateTo).toISOString() : null;

        if (selectedAdminId) {
          if (hasRange) {
            data = await AuditoriaService.getTotalesPorAdminYRango(selectedAdminId, startIso, endIso);
          } else {
            data = await AuditoriaService.getTotalesPorAdmin(selectedAdminId);
          }
        } else {
          if (hasRange) {
            data = await AuditoriaService.getTotalesRango(startIso, endIso);
          } else {
            data = await AuditoriaService.getTotales();
          }
        }

        if (mounted) setTotals(data);
      } catch (err) {
        if (mounted) setTotalsError(err?.message || String(err));
      } finally {
        if (mounted) setTotalsLoading(false);
      }
    };
    loadTotals();
    return () => { mounted = false; };
  }, [selectedAdminId, dateFrom, dateTo]);

  useEffect(() => {
    setTabVisible(false);
    const id = setTimeout(() => setTabVisible(true), 140);
    return () => clearTimeout(id);
  }, [tab]);

  // Determinar si una denuncia está archivada usando el mapa del backend
  const isComplaintArchived = (it) => {
    if (!it) return false;
    
    const denunciaId = it.denunciaId || it?.denuncia?.id || it?.denuncia?._id;
    const token = it?.denuncia?.tokenSeguimiento || it?.denuncia?.token;
    
    // Priorizar el mapa del backend
    if (denunciaId && Object.prototype.hasOwnProperty.call(archivedStatusMap, denunciaId)) {
      return archivedStatusMap[denunciaId];
    }
    if (token && Object.prototype.hasOwnProperty.call(archivedStatusMap, token)) {
      return archivedStatusMap[token];
    }
    
    // Fallback a flags de la denuncia en caché
    const denunciaObj = it.denuncia || getDenunciaFromCache(denunciaId);
    if (denunciaObj) {
      const archivado = denunciaObj.archivado ?? denunciaObj.archivar ?? denunciaObj.isArchived;
      if (typeof archivado === 'boolean') return archivado;
      if (archivado === 1 || archivado === '1') return true;
      if (archivado === 0 || archivado === '0') return false;
    }
    
    return false;
  };

  // Agrupar archivamientos por denuncia y quedarse con la última acción
  const aggregatedArchivos = useMemo(() => {
    const map = {};
    const getId = (it) => it?.denunciaId || it?.denuncia?.id || it?.denuncia?._id || null;
    const getDate = (it) => normalizeDate(it.fechaArchivar || it.fechaArchivado || it.fecha || it.createdAt) || new Date(0);
    
    for (const it of archivados || []) {
      const id = getId(it);
      if (!id) continue;
      const d = getDate(it);
      const prev = map[id];
      if (!prev || d > prev._date) {
        map[id] = { ...it, _date: d };
      }
    }
    
    return Object.values(map);
  }, [archivados]);

  // Filtros aplicados a las listas
  const filteredArchivos = useMemo(() => {
    return aggregatedArchivos.filter(it => {
      // Filtro de búsqueda
      const denunciaObj = it.denuncia || getDenunciaFromCache(it.denunciaId);
      if (!matchesSearch(denunciaObj, it.denunciaId)) return false;
      
      // Filtro de fechas
      const date = it.fechaArchivar || it.fechaArchivado || it.fecha || it.createdAt;
      if (!inDateRange(date)) return false;
      
      // Filtro de estado de archivo
      if (archiveStatus === 'all') return true;
      
      const archived = isComplaintArchived(it);
      if (archiveStatus === 'archived') return archived;
      if (archiveStatus === 'notArchived') return !archived;
      
      return true;
    });
  }, [aggregatedArchivos, archiveStatus, dateFrom, dateTo, search, archivedStatusMap, complaintsCache]);

  const filteredRespuestas = useMemo(() => {
    return respuestas.filter(it => {
      const denunciaObj = it.denuncia || getDenunciaFromCache(it.denunciaId);
      if (!matchesSearch(denunciaObj, it.denunciaId)) return false;
      
      const date = it.fechaRespuesta || it.fecha || it.createdAt || it.fechaCreacion;
      if (!inDateRange(date)) return false;
      
      return true;
    });
  }, [respuestas, dateFrom, dateTo, search, complaintsCache]);

  const filteredRespuestasApelacion = useMemo(() => {
    return respuestasApelacion.filter(it => {
      const denunciaObj = it.denuncia || getDenunciaFromCache(it.denunciaId);
      if (!matchesSearch(denunciaObj, it.denunciaId)) return false;
      
      const date = it.fechaRespuesta || it.fecha || it.createdAt || it.fechaCreacion;
      if (!inDateRange(date)) return false;
      
      return true;
    });
  }, [respuestasApelacion, dateFrom, dateTo, search, complaintsCache]);

  const filteredComentarios = useMemo(() => {
    return comentarios.filter(it => {
      const denunciaObj = it.denuncia || getDenunciaFromCache(it.denunciaId);
      if (!matchesSearch(denunciaObj, it.denunciaId)) return false;
      
      const date = it.fechaComentario || it.fecha || it.createdAt;
      if (!inDateRange(date)) return false;
      
      return true;
    });
  }, [comentarios, dateFrom, dateTo, search, complaintsCache]);

  // Helper para construir un SVG simple a partir de items (para exportar a imagen)
  const buildTotalsSvg = (items = [], width = 820, height = 300) => {
    const padding = 40;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const max = Math.max(...items.map(i => Number(i.value) || 0), 1);
    const gap = Math.max(8, chartW / Math.max(1, items.length) * 0.08);
    const barWidth = Math.max(24, (chartW - gap * (items.length - 1)) / items.length);

    const bars = items.map((it, idx) => {
      const value = Number(it.value) || 0;
      const h = (value / max) * chartH;
      const x = padding + idx * (barWidth + gap);
      const y = padding + (chartH - h);
      const color = it.color || '#3b82f6';
      return `<g key="bar-${idx}"><rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${color}" rx="8"/><text x="${x + barWidth/2}" y="${y - 6}" font-size="12" text-anchor="middle" fill="#111">${it.value}</text><text x="${x + barWidth/2}" y="${padding + chartH + 20}" font-size="12" text-anchor="middle" fill="#374151">${it.label}</text></g>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<rect width="100%" height="100%" fill="#ffffff"/>` +
      `<g>${bars}</g>` +
      `</svg>`;
  };

  const svgToPngDataUrl = (svgString, width = 820, height = 300) => new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.crossOrigin = 'anonymous';
    img.src = url;
  });

  const exportTotalsPdf = async () => {
    try {
      const palette = {
        rojo: [239, 68, 68],
        naranja: [249, 115, 22],
        verde: [16, 185, 129],
        azul: [59, 130, 246],
        morado: [139, 92, 246],
      };

      const src = totals || {};
      const getVal = (obj, keys) => { for (const k of keys) { if (obj && obj[k] != null) return Number(obj[k]) || 0; } return 0; };
      const items = [
        { label: 'Archivamientos', value: getVal(src, ['archivamientos','archivados']), color: '#ef4444' },
        { label: 'Respuestas', value: getVal(src, ['respuestas']), color: '#3b82f6' },
        { label: 'Respuestas a apelaciones', value: getVal(src, ['respuestasApelacion','apelaciones','respuestasApelacion']), color: '#8b5cf6' },
        { label: 'Comentarios', value: getVal(src, ['comentarios']), color: '#10b981' }
      ];

      const svg = buildTotalsSvg(items, 820, 300);
      const chartImage = await svgToPngDataUrl(svg, 820, 300);

      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const margin = 56;
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();

      const primary = [59, 130, 246];
      const muted = [99, 115, 129];
      const dark = [31, 41, 55];
      const surface = [248, 250, 252];

      const setText = (font = 'normal', size = 11, color = dark) => {
        doc.setFont('helvetica', font);
        doc.setFontSize(size);
        doc.setTextColor(...color);
      };

      const ensureSpace = (currentY, needed = 24) => {
        if (currentY + needed < pageH - margin) return currentY;
        doc.addPage();
        return margin;
      };

      const sectionLabel = (title, yPos) => {
        yPos = ensureSpace(yPos, 34);
        doc.setFillColor(...primary);
        doc.roundedRect(margin, yPos - 18, pageW - margin * 2, 30, 8, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(title, margin + 14, yPos);
        return yPos + 14;
      };

      let y = margin;
      const adminObj = selectedAdminId
        ? admins.find((a) => String(resolveAdminId(a)) === String(selectedAdminId))
        : null;
      const adminLabel = adminObj ? resolveAdminLabel(adminObj) : 'Global';

      // Encabezado principal
      doc.setFillColor(...primary);
      doc.roundedRect(margin, y - 8, pageW - margin * 2, 82, 10, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Reporte de Totales', margin + 18, y + 20);
      doc.setFontSize(11);
      doc.text(adminLabel, margin + 18, y + 40);
      doc.text(`Generado: ${new Date().toLocaleString()}`, margin + 18, y + 56);
      y += 94;

      // Resumen ejecutivo
      setText('bold', 12);
      doc.text('Resumen ejecutivo', margin, y);
      y += 16;
      const cardW = (pageW - margin * 2 - 12) / 2;
      const totalAcciones = items.reduce((sum, it) => sum + (Number(it.value) || 0), 0);
      const allIds = new Set();
      const pushId = (it) => { const id = extractComplaintId(it); if (id) allIds.add(String(id)); };
      (archivados || []).forEach(pushId);
      (respuestas || []).forEach(pushId);
      (respuestasApelacion || []).forEach(pushId);
      (comentarios || []).forEach(pushId);
      const cards = [
        { label: 'Total de acciones', value: totalAcciones, color: primary },
        { label: 'Denuncias con actividad', value: allIds.size, color: palette.verde },
      ];

      cards.forEach((card, idx) => {
        const x = margin + idx * (cardW + 12);
        doc.setFillColor(...surface);
        doc.roundedRect(x, y + 4, cardW, 64, 8, 8, 'F');
        doc.setFillColor(...card.color);
        doc.roundedRect(x + 14, y + 14, 12, 12, 3, 3, 'F');
        setText('bold', 11, dark);
        doc.text(card.label, x + 32, y + 24);
        setText('bold', 18, card.color);
        doc.text(String(card.value), x + 32, y + 48);
      });
      y += 88;

      // Gráfica
      y = sectionLabel('Gráfica actual', y + 6);
      const chartH = 260;
      y = ensureSpace(y, chartH + 24);
      doc.addImage(chartImage, 'PNG', margin, y, pageW - margin * 2, chartH);
      y += chartH + 26;

      // Leyenda
      if (items.length) {
        y = sectionLabel('Leyenda de la gráfica', y + 6);
        const chipH = 18;
        let x = margin;
        items.forEach((item, idx) => {
          const rgb = item.color === '#ef4444' ? palette.rojo : item.color === '#3b82f6' ? palette.azul : item.color === '#8b5cf6' ? palette.morado : palette.verde;
          const text = `${idx + 1}. ${item.label} (${item.value})`;
          const textWidth = doc.getTextWidth(text) + 30;
          if (x + textWidth > pageW - margin) {
            x = margin;
            y += chipH + 12;
            y = ensureSpace(y, chipH + 12);
          }
          doc.setFillColor(...rgb);
          doc.roundedRect(x, y, chipH, chipH, 4, 4, 'F');
          setText('normal', 10, dark);
          doc.text(text, x + chipH + 6, y + 12);
          x += textWidth + 6;
        });
        y += chipH + 22;
      }

      // Detalle de denuncias (agrupado por apartado)
      y = sectionLabel('Detalle de denuncias', y + 10);
      setText('normal', 11, dark);

      const idList = Array.from(allIds);
      const complaintsData = idList.map((id) => {
        const den = getDenunciaFromCache(id) || {};
        return {
          label: formatDenunciaLabel(den, null),
          related: {
            Archivamientos: (archivados || []).filter(a => String(extractComplaintId(a)) === String(id)),
            Respuestas: (respuestas || []).filter(r => String(extractComplaintId(r)) === String(id)),
            'Respuestas a apelaciones': (respuestasApelacion || []).filter(r => String(extractComplaintId(r)) === String(id)),
            Comentarios: (comentarios || []).filter(c => String(extractComplaintId(c)) === String(id)),
          },
        };
      });

      const sectionOrder = [
        { key: 'Archivamientos', color: palette.rojo },
        { key: 'Respuestas', color: palette.azul },
        { key: 'Respuestas a apelaciones', color: palette.morado },
        { key: 'Comentarios', color: palette.verde },
      ];

      sectionOrder.forEach((section) => {
        const hasItems = complaintsData.some(c => (c.related[section.key] || []).length > 0);
        if (!hasItems) return;

        y = ensureSpace(y, 34);
        doc.setFillColor(...primary);
        doc.roundedRect(margin, y - 14, pageW - margin * 2, 36, 8, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(section.key, margin + 18, y + 4);
        y += 40;

        complaintsData.forEach((c, idx) => {
          const entries = c.related[section.key] || [];
          if (!entries.length) return;

          y = ensureSpace(y, 40);
          doc.setFillColor(245, 247, 250);
          const titleH = 34;
          doc.roundedRect(margin, y - 8, pageW - margin * 2, titleH, 8, 8, 'F');
          setText('bold', 12, dark);
          doc.text(`${idx + 1}. ${c.label}`, margin + 12, y + 10);
          y += titleH + 6;

          setText('normal', 11, dark);
          entries.forEach((entry) => {
            const txt = section.key === 'Comentarios'
              ? renderRef(entry.comentario, entry.texto, entry.mensaje, entry.contenido, entry.content, entry.body)
              : renderRef(entry.detalle, entry.justificacion, entry.motivo, entry.descripcion);
            if (!txt) return;
            const lines = doc.splitTextToSize(`- ${txt}`, pageW - margin * 2 - 36);
            y = ensureSpace(y, lines.length * 14 + 12);
            // bullet
            doc.setFillColor(...section.color);
            doc.circle(margin + 14, y + 4, 3, 'F');
            setText('normal', 11, dark);
            doc.text(lines, margin + 28, y + 4);
            y += lines.length * 14 + 6;
          });

          y += 12;
        });

        y += 6;
      });

      // Pie de página
      doc.setDrawColor(220);
      doc.line(margin, pageH - margin + 6, pageW - margin, pageH - margin + 6);
      setText('italic', 10, muted);
      doc.text(`Generado el ${new Date().toLocaleString()}`, margin, pageH - margin + 20);

      doc.save(`totales_${(selectedAdminId || 'global')}.pdf`);
    } catch (err) {
      console.error('Error exportando totales a PDF', err);
      alert('No se pudo exportar el PDF: ' + String(err));
    }
  };

  // Renderizar gráfica según la pestaña activa (usando datos filtrados)
  const renderChartForTab = () => {
    const BarChart = ({ title, subtitle, items }) => {
      const max = Math.max(...items.map(i => Number(i.value) || 0), 1);
      return (
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>{title}</h3>
            <span style={styles.chartSubtitle}>{subtitle}</span>
          </div>
          <div style={{ ...styles.barWrap, gridTemplateColumns: `repeat(${items.length || 1}, minmax(80px, 1fr))` }}>
            {items.map((it) => {
              const value = Number(it.value) || 0;
              const height = (value / max) * 180;
              return (
                <div style={styles.barItem} key={String(it.label)}>
                  <div style={{ ...styles.bar, height, backgroundColor: it.color }} />
                  <div style={styles.barValue}>{it.value}</div>
                  <div style={styles.barLabel}>{it.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    if (tab === TABS.TOTALES) {
      if (totalsLoading) return <div style={styles.loading}>Cargando totales...</div>;
      if (totalsError) return <div style={styles.error}>{totalsError}</div>;

      const src = totals || {};
      const getVal = (obj, keys) => {
        for (const k of keys) {
          if (obj && obj[k] != null) return Number(obj[k]) || 0;
        }
        return 0;
      };

      const items = [
        { label: 'Archivamientos', value: getVal(src, ['archivamientos','archivados','archivadas','archivos']), color: '#ef4444' },
        { label: 'Respuestas', value: getVal(src, ['respuestas','respuesta','respuestas_count']), color: '#3b82f6' },
        { label: 'Respuestas a apelaciones', value: getVal(src, ['respuestasApelacion','respuestasApelacion','apelaciones','respuestas_apelacion']), color: '#8b5cf6' },
        { label: 'Comentarios', value: getVal(src, ['comentarios','comentario','comentarios_count']), color: '#10b981' }
      ];

      return <BarChart title="Totales" subtitle="Resumen global" items={items} />;
    }

    if (tab === TABS.ARCHIVOS) {
      const archivadas = filteredArchivos.filter(it => isComplaintArchived(it)).length;
      const noArchivadas = filteredArchivos.filter(it => !isComplaintArchived(it)).length;
      
      const items = [
        { label: 'Archivadas', value: archivadas, color: '#ef4444' },
        { label: 'No archivadas', value: noArchivadas, color: '#3b82f6' }
      ];
      return <BarChart title="Archivaciones" subtitle="Totales filtrados" items={items} />;
    }

    if (tab === TABS.RESPUESTAS) {
      const items = [{ label: 'Respuestas', value: filteredRespuestas.length, color: '#3b82f6' }];
      return <BarChart title="Respuestas" subtitle="Totales filtrados" items={items} />;
    }

    if (tab === TABS.RESPUESTAS_APEL) {
      const items = [{ label: 'Respuestas a apelaciones', value: filteredRespuestasApelacion.length, color: '#8b5cf6' }];
      return <BarChart title="Respuestas a apelaciones" subtitle="Totales filtrados" items={items} />;
    }

    const items = [{ label: 'Comentarios', value: filteredComentarios.length, color: '#10b981' }];
    return <BarChart title="Comentarios" subtitle="Totales filtrados" items={items} />;
  };

  return (
    !authorized ? null : (
    <div style={styles.container}>
      <div style={styles.maxContainer}>
        <div style={styles.tabContainer}>
          <div style={styles.tabs}>
            <button 
              style={tab === TABS.TOTALES ? styles.activeTab : styles.tab}
              onClick={() => setTab(TABS.TOTALES)}
            >
              Totales
            </button>

            <button 
              style={tab === TABS.ARCHIVOS ? styles.activeTab : styles.tab}
              onClick={() => setTab(TABS.ARCHIVOS)}
            >
              Archivaciones
            </button>
            <button 
              style={tab === TABS.RESPUESTAS ? styles.activeTab : styles.tab}
              onClick={() => setTab(TABS.RESPUESTAS)}
            >
              Respuestas
            </button>
            <button 
              style={tab === TABS.RESPUESTAS_APEL ? styles.activeTab : styles.tab}
              onClick={() => setTab(TABS.RESPUESTAS_APEL)}
            >
              Respuestas a apelaciones
            </button>
            <button 
              style={tab === TABS.COMENTARIOS ? styles.activeTab : styles.tab}
              onClick={() => setTab(TABS.COMENTARIOS)}
            >
              Comentarios
            </button>
          </div>
          
          <div style={styles.filters}>
            <div style={styles.searchContainer}>
              <FiSearch style={styles.searchIcon} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre de denuncia..."
                style={styles.searchInput}
              />
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Administrador</label>
              <select
                value={selectedAdminId}
                onChange={(e) => setSelectedAdminId(e.target.value)}
                style={styles.select}
              >
                <option value="">— Seleccionar administrador —</option>
                {admins.map((a, idx) => {
                  const idVal = resolveAdminId(a) ?? '';
                  const label = resolveAdminLabel(a) || `ID ${idVal}`;
                  const key = idVal || `admin-${idx}`;
                  return (
                    <option key={key} value={idVal}>{label}</option>
                  );
                })}
              </select>
            </div>
            
            <div style={styles.filterGroup}>
              <FiCalendar style={styles.filterIcon} />
              <label style={styles.filterLabel}>Desde</label>
              <input 
                type="datetime-local" 
                value={dateFrom} 
                onChange={(e) => setDateFrom(e.target.value)} 
                style={styles.dateInput}
              />
            </div>
            
            <div style={styles.filterGroup}>
              <FiCalendar style={styles.filterIcon} />
              <label style={styles.filterLabel}>Hasta</label>
              <input 
                type="datetime-local" 
                value={dateTo} 
                onChange={(e) => setDateTo(e.target.value)} 
                style={styles.dateInput}
              />
            </div>
            
            {tab === TABS.ARCHIVOS && (
              <div style={styles.filterGroup}>
                <FiFilter style={styles.filterIcon} />
                <label style={styles.filterLabel}>Estado</label>
                <select 
                  value={archiveStatus} 
                  onChange={(e) => setArchiveStatus(e.target.value)} 
                  style={styles.select}
                >
                  <option value="all">Todas</option>
                  <option value="archived">Archivadas</option>
                  <option value="notArchived">No archivadas</option>
                </select>
              </div>
            )}

            <div style={styles.filterGroup}>
              <button onClick={clearFilters} style={styles.clearButton}>Limpiar filtros</button>
            </div>
            {tab === TABS.TOTALES && (
              <div style={styles.filterGroup}>
                <button onClick={() => exportTotalsPdf()} style={styles.pdfButton}>
                  <FiFileText style={styles.buttonIcon} />
                  Exportar Totales PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {loading && <div style={styles.loading}>Cargando...</div>}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && !error && (
          <div>
            {renderChartForTab()}

            {tab === TABS.ARCHIVOS && (
              <div>
                {filteredArchivos.length === 0 ? (
                  <div style={styles.emptyMessage}>
                    {archivados.length === 0 
                      ? 'No hay archivaciones registradas.'
                      : 'No hay archivaciones que coincidan con los filtros aplicados.'}
                  </div>
                ) : (
                  <div style={styles.list}>
                    {filteredArchivos.map((it, idx) => (
                      <div 
                        key={it.id || it._id || it.denunciaId || `arch-${idx}`} 
                        style={styles.card}
                      >
                        <div style={{
                          ...styles.cardContent,
                          opacity: visible && tabVisible ? 1 : 0,
                          transform: visible && tabVisible ? 'translateY(0)' : 'translateY(-8px)'
                        }}>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Denuncia:</div>
                            <div style={styles.cardValue}>
                              {formatDenunciaLabelSinId(it.denuncia, it.denunciaId)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Estado:</div>
                            <div style={styles.cardValue}>
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                backgroundColor: isComplaintArchived(it) ? '#fee2e2' : '#dbeafe',
                                color: isComplaintArchived(it) ? '#dc2626' : '#2563eb'
                              }}>
                                {isComplaintArchived(it) ? 'Archivada' : 'No archivada'}
                              </span>
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Fecha:</div>
                            <div style={styles.cardValue}>
                              {formatDate(it.fechaArchivar || it.fechaArchivado || it.fecha || it.createdAt)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Justificación:</div>
                            <div style={styles.cardValue}>
                              {renderRef(it.justificacion, it.detalle, it.motivo, it.descripcion)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel} />
                            <div style={styles.cardValue}>
                              <button
                                onClick={() => {
                                  const id = extractComplaintId(it);
                                  if (!id) return;
                                  navigate('/complaint_checkout', { state: { complaintId: String(id) } });
                                }}
                                style={styles.viewButton}
                              >
                                Ver denuncia
                              </button>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === TABS.RESPUESTAS && (
              <div>
                {filteredRespuestas.length === 0 ? (
                  <div style={styles.emptyMessage}>
                    {respuestas.length === 0
                      ? 'No hay respuestas registradas.'
                      : 'No hay respuestas que coincidan con los filtros aplicados.'}
                  </div>
                ) : (
                  <div style={styles.list}>
                    {filteredRespuestas.map((it, idx) => (
                      <div 
                        key={it.id || it._id || it.respuestaId || it.denunciaId || `resp-${idx}`} 
                        style={styles.card}
                      >
                        <div style={{
                          ...styles.cardContent,
                          opacity: visible && tabVisible ? 1 : 0,
                          transform: visible && tabVisible ? 'translateY(0)' : 'translateY(-8px)'
                        }}>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Denuncia:</div>
                            <div style={styles.cardValue}>
                              {formatDenunciaLabelSinId(it.denuncia, it.denunciaId)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Fecha respuesta:</div>
                            <div style={styles.cardValue}>
                              {formatDate(it.fechaRespuesta || it.fecha || it.createdAt || it.fechaCreacion)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Detalle:</div>
                            <div style={styles.cardValue}>
                              {renderRef(it.detalle, it.justificacion, it.motivo, it.descripcion)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel} />
                            <div style={styles.cardValue}>
                              <button
                                onClick={() => {
                                  const id = extractComplaintId(it);
                                  if (!id) {
                                    alert('No se encontró el ID de la denuncia para ver.');
                                    return;
                                  }
                                  navigate('/complaint_checkout', { state: { complaintId: String(id) } });
                                }}
                                style={styles.viewButton}
                              >
                                Ver denuncia
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === TABS.RESPUESTAS_APEL && (
              <div>
                {filteredRespuestasApelacion.length === 0 ? (
                  <div style={styles.emptyMessage}>
                    {respuestasApelacion.length === 0
                      ? 'No hay respuestas a apelaciones registradas.'
                      : 'No hay respuestas a apelaciones que coincidan con los filtros aplicados.'}
                  </div>
                ) : (
                  <div style={styles.list}>
                    {filteredRespuestasApelacion.map((it, idx) => (
                      <div 
                        key={it.id || it._id || it.respuestaApelacionId || it.denunciaId || `resp-apel-${idx}`} 
                        style={styles.card}
                      >
                        <div style={{
                          ...styles.cardContent,
                          opacity: visible && tabVisible ? 1 : 0,
                          transform: visible && tabVisible ? 'translateY(0)' : 'translateY(-8px)'
                        }}>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Denuncia:</div>
                            <div style={styles.cardValue}>
                              {formatDenunciaLabel(it.denuncia, it.denunciaId)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Fecha respuesta:</div>
                            <div style={styles.cardValue}>
                              {formatDate(it.fechaRespuesta || it.fecha || it.createdAt || it.fechaCreacion)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Detalle:</div>
                            <div style={styles.cardValue}>
                              {renderRef(it.detalle, it.justificacion, it.motivo, it.descripcion)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === TABS.COMENTARIOS && (
              <div>
                {filteredComentarios.length === 0 ? (
                  <div style={styles.emptyMessage}>
                    {comentarios.length === 0
                      ? 'No hay comentarios registrados.'
                      : 'No hay comentarios que coincidan con los filtros aplicados.'}
                  </div>
                ) : (
                  <div style={styles.list}>
                    {filteredComentarios.map((it, idx) => (
                      <div 
                        key={it.id || it._id || it.denunciaId || `coment-${idx}`} 
                        style={styles.card}
                      >
                        <div style={{
                          ...styles.cardContent,
                          opacity: visible && tabVisible ? 1 : 0,
                          transform: visible && tabVisible ? 'translateY(0)' : 'translateY(-8px)'
                        }}>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Denuncia:</div>
                            <div style={styles.cardValue}>
                              {formatDenunciaLabelSinId(it.denuncia, it.denunciaId)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Comentario:</div>
                            <div style={styles.cardValue}>
                              {renderRef(it.comentario, it.texto, it.mensaje, it.contenido, it.content, it.body)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel}>Fecha:</div>
                            <div style={styles.cardValue}>
                              {formatDate(it.fechaComentario || it.fecha || it.createdAt || it.fechaCreacion || it.fecha_creacion)}
                            </div>
                          </div>
                          <div style={styles.cardRow}>
                            <div style={styles.cardLabel} />
                            <div style={styles.cardValue}>
                              <button
                                onClick={() => {
                                  const id = extractComplaintId(it);
                                  if (!id) {
                                    alert('No se encontró el ID de la denuncia para ver.');
                                    return;
                                  }
                                  navigate('/complaint_checkout', { state: { complaintId: String(id) } });
                                }}
                                style={styles.viewButton}
                              >
                                Ver denuncia
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    )
  );
};

const styles = {
  container: {
    padding: '1rem',
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    backgroundColor: '#f3f4f6',
  },
  maxContainer: {
    margin: '0 auto',
    backgroundColor: '#f3f4f6',
  },
  tabContainer: {
    marginBottom: '1rem',
    backgroundColor: '#f3f4f6',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    backgroundColor: '#f3f4f6',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTab: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2463eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center',
    marginTop: '0.75rem',
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    fontSize: '1rem',
    color: '#9ca3af',
  },
  searchInput: {
    padding: '0.625rem 1rem 0.625rem 2.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    width: '256px',
    backgroundColor: 'white',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  filterIcon: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  filterLabel: {
    fontSize: '0.875rem',
    color: '#4b5563',
    fontWeight: 500,
  },
  dateInput: {
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'white',
  },
  select: {
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    minWidth: '140px',
  },
  clearButton: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    color: '#374151',
    fontWeight: 600,
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: '#6b7280',
  },
  error: {
    padding: '1rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  emptyMessage: {
    padding: '2rem',
    textAlign: 'center',
    color: '#6b7280',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    transition: 'all 0.3s ease',
  },
  cardRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  cardLabel: {
    width: '160px',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
    flexShrink: 0,
  },
  cardValue: {
    fontSize: '0.875rem',
    color: '#4b5563',
    flex: 1,
  },
  chartCard: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1.25rem 1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    marginBottom: '1.25rem',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '0.75rem',
  },
  chartTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#111827',
  },
  chartSubtitle: {
    fontSize: '0.85rem',
    color: '#6b7280',
  },
  barWrap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
    alignItems: 'end',
  },
  barItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
  },
  bar: {
    width: '48px',
    borderRadius: '12px 12px 10px 10px',
    transition: 'height 240ms ease',
  },
  barValue: {
    fontWeight: 700,
    color: '#111827',
    fontSize: '0.95rem',
  },
  barLabel: {
    textAlign: 'center',
    color: '#4b5563',
    fontSize: '0.9rem',
    lineHeight: 1.2,
  },
  viewButton: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600,
  },
  pdfButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonIcon: {
    fontSize: '1rem',
  },
};

export default AuditActions;