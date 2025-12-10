import React, { useEffect, useState, useRef } from "react";
import { FiDownload, FiFileText, FiX, FiPrinter, FiFile, FiImage } from "react-icons/fi";
import { HiOutlineChartBar } from "react-icons/hi";
import { MdOutlineDescription } from "react-icons/md";
import ReportService from "../../../services/ReportService";

const Bars = ({ data, width = 1000, height = 420, palette = [], xLabel = "", generation = 0, svgRef = null }) => {
  const [animate, setAnimate] = useState(false);

  const leftPad = 72;
  const rightPad = 48;
  const topPad = 32;
  const adjustedBottomPad = 64;

  const chartWidth = width - leftPad - rightPad;
  const chartHeight = height - topPad - adjustedBottomPad;
  const safeData = Array.isArray(data) ? data : [];
  const max = safeData.length === 0 ? 0 : Math.max(...safeData.map((d) => d.value), 0);
  const gap = 14;
  const barWidth = Math.max(20, chartWidth / Math.max(1, safeData.length) - gap);

  const ticks = 5;

  // trigger animation when generation changes (remount-safe)
  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 30);
    return () => clearTimeout(t);
  }, [generation]);

  return (
    <div style={styles.overflowContainer}>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={styles.svg}>
        <g transform={`translate(${leftPad}, ${topPad})`}>
          {/* y-axis gridlines and ticks */}
          {[...Array(ticks + 1)].map((_, i) => {
            const y = (chartHeight * i) / ticks;
            const value = Math.round(max - (i * max) / ticks);
            return (
              <g key={`tick-${i}`}>
                <line x1={0} y1={y} x2={chartWidth} y2={y} stroke="#eef2f7" />
                <text x={-12} y={y + 4} textAnchor="end" fontSize={12} fill="#6b7280">
                  {value}
                </text>
              </g>
            );
          })}

          {/* y-axis label */}
          <text x={-leftPad / 2} y={chartHeight / 2} transform={`rotate(-90, ${-leftPad / 2}, ${chartHeight / 2})`} textAnchor="middle" fontSize={12} fill="#374151">
            Cantidad
          </text>

          {/* bars */}
          {safeData.map((d, i) => {
            const barHeight = max === 0 ? 0 : (d.value / max) * chartHeight;
            const x = i * (barWidth + gap);
            const y = chartHeight - barHeight;
            const label = d.label;
            const barColor = palette[i % palette.length] || "#ef4444";
            return (
              <g key={`${d.label}-${i}`}>
                <title>{`${label}: ${d.value}`}</title>

                <g transform={`translate(${x}, ${chartHeight})`}>
                  <rect
                    x={0}
                    y={animate ? -barHeight : 0}
                    width={barWidth}
                    height={animate ? barHeight : 0}
                    fill={barColor}
                    rx={6}
                    style={{
                      transition: "height 700ms cubic-bezier(0.2,0.8,0.2,1), y 700ms cubic-bezier(0.2,0.8,0.2,1)",
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                </g>

                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize={12} fill="#111827">
                  {d.value}
                </text>
                <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" fontSize={12} fill="#374151">
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* x-axis baseline */}
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e5e7eb" />

          {/* x-axis label */}
          {xLabel && (
            <text x={chartWidth / 2} y={chartHeight + 44} textAnchor="middle" fontSize={13} fill="#374151">
              {xLabel}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};

// Small modal wrapper that handles overlay and entry/exit animations
const ModalWrapper = ({ children, active = false, onClose = () => {} }) => {
  return (
    <div style={styles.modalContainer} aria-modal="true">
      <div
        style={{ ...styles.modalOverlay, opacity: active ? 0.4 : 0 }}
        onClick={onClose}
      />
      <div style={{ animation: active ? 'modalScale 220ms cubic-bezier(.2,.8,.2,1) both' : 'modalScale 180ms cubic-bezier(.2,.8,.2,1) reverse both' }}>
        {children}
      </div>
    </div>
  );
};

const Graph = () => {
  const [loading, setLoading] = useState(true);
  const [generation, setGeneration] = useState(0);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const [metric, setMetric] = useState("category");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chartData, setChartData] = useState([]);

  // Inject animation keyframes once
  useEffect(() => {
    const id = 'graph-animations-style';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = `
      @keyframes legendFade {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes modalScale {
        from { opacity: 0; transform: translateY(8px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      `;
    document.head.appendChild(style);
  }, []);

  const [showExportModal, setShowExportModal] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [exportMode, setExportMode] = useState("pdf");
  const [exportName, setExportName] = useState("");
  const [exportDescription, setExportDescription] = useState("");

  // control modal active state for entry animation
  useEffect(() => {
    if (showExportModal) {
      const t = setTimeout(() => setModalActive(true), 20);
      return () => clearTimeout(t);
    } else {
      setModalActive(false);
    }
  }, [showExportModal]);

  // Prevent background scroll/interaction while modal is open
  useEffect(() => {
    if (!showExportModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showExportModal]);

  useEffect(() => {
    let active = true;
    const fetchChart = async () => {
      try {
        setLoading(true);
        const raw = metric === "category"
          ? await ReportService.getPorCategoria()
          : await ReportService.getPorEstado();

        const entries = Object.entries(raw || {});
        const data = entries
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 12);

        if (!active) return;
        setChartData(data);
        setGeneration((g) => g + 1);
      } catch (err) {
        console.error("Error al obtener estadísticas desde ReportService:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchChart();
    return () => {
      active = false;
    };
  }, [metric, fromDate, toDate]);

  if (loading) return <p style={styles.loadingText}>Cargando estadísticas...</p>;
  
  const basePalette = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#ef6b8a",
    "#14b8a6",
  ];

  const normalizeStatusLabel = (label) =>
    String(label || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const statusColorMap = {
    resuelta: "#10b981", // verde para resuelta
    "en revision": "#f97316",
    "en revisión": "#f97316",
    pendiente: "#f59e0b",
    archivada: "#6b7280",
  };

  const paletteForChart =
    metric === "status"
      ? chartData.map((d, i) => {
          const key = normalizeStatusLabel(d.label);
          return statusColorMap[key] || basePalette[i % basePalette.length];
        })
      : basePalette;

  const fetchReportData = async () => {
    const [total, porEstado, porCategoria] = await Promise.all([
      ReportService.getTotal(),
      ReportService.getPorEstado(),
      ReportService.getPorCategoria(),
    ]);

    let porFechas = null;
    if (fromDate && toDate) {
      porFechas = await ReportService.getPorFechas(fromDate, toDate);
    }

    return {
      total,
      porEstado,
      porCategoria,
      porFechas,
      filtros: {
        inicio: fromDate || null,
        fin: toDate || null,
      },
    };
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div style={styles.headerTitle}>
        </div>
        <p style={styles.subtitle}>Visualiza y analiza las denuncias por categoría o estado</p>
      </div>

      <div style={styles.controlsContainer}>
        <div style={styles.controlsRow}>
          <div style={styles.controlsLeft}>
            <div style={styles.controlGroup}>
              <label style={styles.controlLabel}>Métrica</label>
              <div style={styles.selectWrapper}>
                <select 
                  value={metric} 
                  onChange={(e) => setMetric(e.target.value)} 
                  style={styles.select}
                >
                  <option value="category">Por Categoría</option>
                  <option value="status">Por Estado</option>
                </select>
              </div>
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.controlLabel}>Desde</label>
              <input 
                type="date" 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)} 
                style={styles.input}
              />
            </div>

            <div style={styles.controlGroup}>
              <label style={styles.controlLabel}>Hasta</label>
              <input 
                type="date" 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)} 
                style={styles.input}
              />
            </div>

            <div style={styles.controlGroup}>
              <button 
                onClick={() => { setFromDate(""); setToDate(""); }} 
                style={styles.clearButton}
              >
                Limpiar fechas
              </button>
            </div>
          </div>

          <div style={styles.exportButtonsInline}>
            <button 
              onClick={() => { 
                setExportMode("pdf"); 
                setExportName(""); 
                setExportDescription(""); 
                setShowExportModal(true); 
              }} 
              style={styles.pdfButton}
            >
              <FiFileText style={styles.buttonIcon} />
              Generar reporte PDF
            </button>

            <button 
              onClick={() => { 
                setExportMode("excel"); 
                setExportName(""); 
                setExportDescription(""); 
                setShowExportModal(true); 
              }} 
              style={styles.excelButton}
            >
              <FiDownload style={styles.buttonIcon} />
              Exportar Excel
            </button>
          </div>
        </div>
      </div>

      <div ref={containerRef} style={styles.chartContainer}>
        <div style={styles.chartLayout}>
          <div style={styles.chartSection}>
            <Bars 
              key={`bars-${generation}`} 
              data={chartData} 
              palette={paletteForChart} 
              xLabel={metric === "category" ? "Categorías" : "Estados"} 
              generation={generation} 
              svgRef={chartRef} 
            />
          </div>

          <aside style={styles.legendSection}>
            <h3 style={styles.legendTitle}>Leyenda</h3>
            <div style={styles.legendList}>
              {chartData.map((d, i) => (
                <div 
                  key={d.label} 
                  style={{ 
                    ...styles.legendItem,
                    animation: `legendFade 420ms ease ${i * 80}ms both`
                  }}
                >
                  <span style={styles.legendNumber}>{i + 1}.</span>
                  <span 
                    style={{ 
                      ...styles.legendColor,
                      backgroundColor: paletteForChart[i % paletteForChart.length]
                    }} 
                  />
                  <span style={styles.legendLabel}>{d.label}</span>
                  <span style={styles.legendValue}>{d.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {showExportModal && (
        <ModalWrapper 
          active={modalActive} 
          onClose={() => {
            setModalActive(false);
            setTimeout(() => setShowExportModal(false), 220);
          }}
        >
          <div
            style={styles.modalContent}
          >
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {exportMode === "pdf" ? "Exportar PDF" : "Exportar Excel"}
              </h3>
              <button 
                onClick={() => {
                  setModalActive(false);
                  setTimeout(() => setShowExportModal(false), 220);
                }}
                style={styles.closeButton}
              >
                <FiX />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Nombre del archivo</label>
                <input 
                  value={exportName} 
                  onChange={(e) => setExportName(e.target.value)} 
                  style={styles.formInput}
                  placeholder="Ingrese el nombre del archivo"
                />
              </div>

              {exportMode === "pdf" && (
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <MdOutlineDescription style={styles.labelIcon} />
                    Descripción (opcional)
                  </label>
                  <textarea 
                    rows={6} 
                    value={exportDescription} 
                    onChange={(e) => setExportDescription(e.target.value)} 
                    style={styles.formTextarea}
                    placeholder="Agregue una descripción para el reporte PDF..."
                  />
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button 
                style={styles.cancelButton}
                onClick={() => { 
                  setModalActive(false); 
                  setTimeout(() => setShowExportModal(false), 220); 
                }}
              >
                Cancelar
              </button>
              <button 
                style={styles.exportButton}
                onClick={async () => {
                  if (!exportName) { 
                    alert('Ingresa un nombre para el archivo'); 
                    return; 
                  }
                  setModalActive(false);
                  setTimeout(async () => {
                    try {
                      const reportData = await fetchReportData();
                      if (exportMode === "pdf") {
                        const chartImage = await exportChartImage(chartRef.current);
                        await generatePdfReport(reportData, exportName, exportDescription, {
                          chartImage,
                          metric,
                          chartData,
                          palette: paletteForChart,
                        });
                      } else {
                        await generateExcelReport(reportData, exportName);
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Error exportando. Revisa la consola para más detalles.');
                    }
                    setShowExportModal(false);
                  }, 220);
                }}
              >
                <FiDownload style={styles.exportIcon} />
                Exportar
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

// --- Shared export helpers ---
async function exportChartImage(svgEl) {
  if (!svgEl) return null;

  const viewBox = svgEl.viewBox?.baseVal;
  const width = viewBox?.width || svgEl.getBoundingClientRect().width || 1000;
  const height = viewBox?.height || svgEl.getBoundingClientRect().height || 420;

  const svgString = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.crossOrigin = "anonymous";

  const dataUrl = await new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL("image/png", 1));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = url;
  });

  URL.revokeObjectURL(url);
  return dataUrl;
}

const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255,
  ];
};

// --- EXCEL export helper ---
async function generateExcelReport(reportData, name = "reporte") {
  const { total, porEstado, porCategoria, porFechas, filtros } = reportData || {};

  let ExcelJSModule;
  try {
    ExcelJSModule = await import("exceljs");
  } catch (err) {
    void err;
    throw new Error('Instala "exceljs" con: npm install exceljs');
  }
  const ExcelJS = ExcelJSModule && (ExcelJSModule.default || ExcelJSModule);

  const mapToRows = (obj) => Object.entries(obj || {}).map(([label, value]) => ({ label, value }));
  const workbook = new ExcelJS.Workbook();
  const primary = "#3b82f6";

  const styleHeader = (sheet) => {
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FF111827" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE5E7EB" } };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });
    sheet.views = [{ state: "frozen", ySplit: 1 }];
  };

  const addTitle = (sheet, title) => {
    sheet.insertRow(1, [title]);
    const titleRow = sheet.getRow(1);
    titleRow.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
    titleRow.height = 22;
    sheet.mergeCells(1, 1, 1, sheet.columnCount || 2);
    const cell = sheet.getCell(1, 1);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: primary.replace("#", "FF") } };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    sheet.insertRow(2, []);
  };

  // Resumen
  const resumen = workbook.addWorksheet("Resumen", { properties: { defaultRowHeight: 18 } });
  resumen.columns = [
    { header: "Campo", key: "campo", width: 34 },
    { header: "Valor", key: "valor", width: 28 },
  ];
  addTitle(resumen, "Resumen ejecutivo");
  resumen.addRow({ campo: "Total de denuncias", valor: total ?? "-" });
  if (filtros?.inicio || filtros?.fin) {
    resumen.addRow({
      campo: "Rango seleccionado",
      valor: `${filtros?.inicio || ""}${filtros?.inicio && filtros?.fin ? " a " : ""}${filtros?.fin || ""}` || "--",
    });
  }
  if (porFechas !== null && porFechas !== undefined) {
    resumen.addRow({ campo: "Total en rango", valor: porFechas });
  }
  styleHeader(resumen);
  resumen.getColumn("valor").alignment = { horizontal: "left" };

  // Por estado
  const estadoSheet = workbook.addWorksheet("Por estado", { properties: { defaultRowHeight: 18 } });
  estadoSheet.columns = [
    { header: "Estado", key: "estado", width: 38 },
    { header: "Cantidad", key: "cantidad", width: 16 },
  ];
  addTitle(estadoSheet, "Distribución por estado");
  mapToRows(porEstado).forEach((row) => {
    estadoSheet.addRow({ estado: row.label, cantidad: row.value });
  });
  styleHeader(estadoSheet);
  estadoSheet.getColumn("cantidad").numFmt = "0";

  // Por categoría
  const categoriaSheet = workbook.addWorksheet("Por categoría", { properties: { defaultRowHeight: 18 } });
  categoriaSheet.columns = [
    { header: "Categoría", key: "categoria", width: 42 },
    { header: "Cantidad", key: "cantidad", width: 16 },
  ];
  addTitle(categoriaSheet, "Distribución por categoría");
  mapToRows(porCategoria).forEach((row) => {
    categoriaSheet.addRow({ categoria: row.label, cantidad: row.value });
  });
  styleHeader(categoriaSheet);
  categoriaSheet.getColumn("cantidad").numFmt = "0";

  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9-_ ]/gi, "") || 'reporte'}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// --- PDF export helper ---
async function generatePdfReport(reportData, name, description, options = {}) {
  const { chartImage, metric, chartData = [], palette = [] } = options;
  const { total, porEstado, porCategoria, porFechas, filtros } = reportData || {};

  let jsPDFModule;
  try {
    jsPDFModule = await import("jspdf");
  } catch (err) {
    void err;
    throw new Error('Instala "jspdf" con: npm install jspdf');
  }
  const { jsPDF } = jsPDFModule;

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const margin = 56;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const rowsFromMap = (obj) => Object.entries(obj || {});
  const ensureSpace = (docRef, currentY, needed = 18) => {
    if (currentY + needed < pageH - margin) return currentY;
    docRef.addPage();
    return margin;
  };

  const primary = [59, 130, 246];
  const muted = [99, 115, 129];
  const dark = [31, 41, 55];
  const success = [16, 185, 129];
  const warn = [249, 115, 22];
  const surface = [248, 250, 252];

  const setText = (font = "normal", size = 11, color = dark) => {
    doc.setFont("helvetica", font);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const sectionLabel = (title, yPos) => {
    yPos = ensureSpace(doc, yPos, 34);
    doc.setFillColor(...primary);
    doc.roundedRect(margin, yPos - 18, pageW - margin * 2, 30, 8, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title, margin + 14, yPos);
    return yPos + 14;
  };

  let y = margin;
  const spacer = (amount = 16) => {
    y += amount;
    return y;
  };

  // Header card
  doc.setFillColor(...primary);
  doc.roundedRect(margin, y - 8, pageW - margin * 2, 86, 10, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(name || "Reporte de denuncias", margin + 18, y + 20);
  doc.setFontSize(11);
  doc.text(`Generado: ${new Date().toLocaleString()}`, margin + 18, y + 40);
  doc.text(`Métrica: ${metric === "status" ? "Por estado" : "Por categoría"}`, margin + 18, y + 56);
  y += 100;

  // Description block
  if (description) {
    doc.setFillColor(...surface);
    doc.roundedRect(margin, y - 12, pageW - margin * 2, 78, 8, 8, "F");
    setText("bold", 12);
    doc.text("Descripción", margin + 14, y + 6);
    setText("normal", 11, muted);
    const descLines = doc.splitTextToSize(description, pageW - margin * 2 - 28);
    doc.text(descLines, margin + 14, y + 22);
    y += 88;
  }

  // Summary cards
  setText("bold", 12);
  doc.text("Resumen ejecutivo", margin, y);
  spacer(14);

  const cardW = (pageW - margin * 2 - 12) / 2;
  const cards = [
    { label: "Total de denuncias", value: total ?? "-", color: primary },
    { label: "Total en rango", value: porFechas ?? "-", color: warn },
  ];

  cards.forEach((card, idx) => {
    const x = margin + idx * (cardW + 12);
    doc.setFillColor(...surface);
    doc.roundedRect(x, y + 4, cardW, 64, 8, 8, "F");
    doc.setFillColor(...card.color);
    doc.roundedRect(x + 14, y + 14, 12, 12, 3, 3, "F");
    setText("bold", 11, dark);
    doc.text(card.label, x + 32, y + 24);
    setText("bold", 18, card.color);
    doc.text(String(card.value), x + 32, y + 48);
  });

  y += 90;
  spacer(4);

  // Filters row
  doc.setFillColor(...surface);
  doc.roundedRect(margin, y - 4, pageW - margin * 2, 60, 8, 8, "F");
  setText("bold", 12);
  doc.text("Filtros aplicados", margin + 14, y + 14);
  setText("normal", 11, muted);
  const rango = `${filtros?.inicio || "Sin inicio"}${filtros?.inicio || filtros?.fin ? " a " : ""}${filtros?.fin || "Sin fin"}`;
  doc.text(`Rango: ${rango}`, margin + 14, y + 34);
  y += 70;
  spacer(6);

  // Chart section
  if (chartImage) {
    y = sectionLabel("Gráfica actual", y + 6);
    const chartHeight = 280;
    y = ensureSpace(doc, y, chartHeight + 20);
    doc.addImage(chartImage, "PNG", margin, y, pageW - margin * 2, chartHeight);
    y += chartHeight + 26;
  }

  // Legend chips for current chart
  if (chartData.length) {
    y = sectionLabel("Leyenda de la gráfica", y + 10);
    setText("normal", 11, dark);
    const chipH = 18;
    let x = margin;
    const maxWidth = pageW - margin * 2;
    chartData.forEach((item, idx) => {
      const color = palette[idx % palette.length] || "#6b7280";
      const text = `${idx + 1}. ${item.label} (${item.value})`;
      const textWidth = doc.getTextWidth(text) + 30;
      if (x + textWidth > margin + maxWidth) {
        x = margin;
        y += chipH + 12;
        y = ensureSpace(doc, y, chipH + 12);
      }
      doc.setFillColor(...hexToRgb(color));
      doc.roundedRect(x, y, chipH, chipH, 4, 4, "F");
      setText("normal", 10, dark);
      doc.text(text, x + chipH + 6, y + 12);
      x += textWidth + 6;
    });
    y += chipH + 26;
  }

  // Breakdown by estado
  y = sectionLabel("Distribución por estado", y + 10);
  setText("normal", 11, dark);
  rowsFromMap(porEstado).forEach(([estado, valor]) => {
    y = ensureSpace(doc, y, 18);
    doc.setFillColor(244, 247, 252);
    doc.roundedRect(margin, y - 12, pageW - margin * 2, 26, 6, 6, "F");
    doc.setFillColor(...success);
    doc.circle(margin + 10, y + 1, 4, "F");
    doc.text(`${estado}`, margin + 22, y + 2);
    setText("bold", 11, success);
    doc.text(String(valor), pageW - margin - 14, y + 2, { align: "right" });
    setText("normal", 11, dark);
    y += 26;
  });

  y = ensureSpace(doc, y + 12, 18);
  y = sectionLabel("Distribución por categoría", y + 10);
  rowsFromMap(porCategoria).forEach(([cat, valor]) => {
    y = ensureSpace(doc, y, 18);
    doc.setFillColor(246, 248, 252);
    doc.roundedRect(margin, y - 12, pageW - margin * 2, 26, 6, 6, "F");
    doc.setFillColor(...primary);
    doc.circle(margin + 10, y + 1, 4, "F");
    doc.text(`${cat}`, margin + 22, y + 2);
    setText("bold", 11, primary);
    doc.text(String(valor), pageW - margin - 14, y + 2, { align: "right" });
    setText("normal", 11, dark);
    y += 26;
  });

  // Footer
  doc.setDrawColor(220);
  doc.line(margin, pageH - margin + 6, pageW - margin, pageH - margin + 6);
  setText("italic", 10, muted);
  doc.text(`Generado el ${new Date().toLocaleString()}`, margin, pageH - margin + 20);

  doc.save(`${(name || "reporte").replace(/[^a-z0-9-_ ]/gi, "") || "reporte"}.pdf`);
}

const styles = {
  container: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    padding: "0",
    margin: "0",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  headerSection: {
    padding: "1.5rem 1.25rem 0.5rem",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#000000",
    margin: 0,
    marginBottom: "0.5rem",
  },
  controlsContainer: {
    padding: "0 1.25rem 1.25rem",
  },
  controlsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    alignItems: "flex-end",
    marginBottom: "1rem",
  },
  controlGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  controlLabel: {
    fontSize: "0.875rem",
    fontWeight: 650,
    color: "#000000",
  },
  selectWrapper: {
    position: "relative",
  },
  select: {
    padding: "0.625rem 2.5rem 0.625rem 0.875rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    color: "#1f2937",
    backgroundColor: "white",
    cursor: "pointer",
    minWidth: "180px",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1rem",
  },
  input: {
    padding: "0.625rem 0.875rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    color: "#1f2937",
    backgroundColor: "white",
    minWidth: "160px",
  },
  clearButton: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  controlsLeft: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    alignItems: "flex-end",
  },
  exportButtonsInline: {
    display: "flex",
    gap: "0.5rem",
    marginLeft: "auto",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  pdfButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.25rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  excelButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.25rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonIcon: {
    fontSize: "1rem",
  },
  chartContainer: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    margin: "0 1.25rem 1.25rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  chartLayout: {
    display: "flex",
    gap: "2rem",
  },
  chartSection: {
    flex: 1,
  },
  overflowContainer: {
    overflowX: "auto",
  },
  svg: {
    margin: "0 auto",
  },
  legendSection: {
    width: "440px",
    borderLeft: "1px solid #e5e7eb",
    paddingLeft: "1.5rem",
    display: "flex",
    flexDirection: "column",
  },
  legendTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.75rem",
  },
  legendList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "0.75rem 1rem",
    marginTop: "0.5rem",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.375rem 0.25rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.5rem",
  },
  legendNumber: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
    width: "1.5rem",
    textAlign: "right",
    marginRight: "0.5rem",
  },
  legendColor: {
    width: "1.25rem",
    height: "1.25rem",
    borderRadius: "0.25rem",
    flexShrink: 0,
  },
  legendLabel: {
    fontSize: "0.875rem",
    color: "#4b5563",
    marginLeft: "0.75rem",
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  legendValue: {
    marginLeft: "1rem",
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  loadingText: {
    padding: "2rem",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "1rem",
  },
  modalContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    transition: "opacity 220ms ease",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "2.5rem",
    zIndex: 60,
    transform: "translateZ(0)",
    transition: "transform 220ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease",
    width: "min(1100px, 94vw)",
    maxWidth: "1100px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#1f2937",
    margin: 0,
  },
  closeButton: {
    padding: "0.375rem",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "0.375rem",
    color: "#6b7280",
    cursor: "pointer",
    fontSize: "1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  formLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#4b5563",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  labelIcon: {
    fontSize: "1rem",
    color: "#6b7280",
  },
  formInput: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    color: "#1f2937",
    backgroundColor: "white",
  },
  formTextarea: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    color: "#1f2937",
    backgroundColor: "white",
    resize: "vertical",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1.5rem",
  },
  cancelButton: {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  exportButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1.25rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  exportIcon: {
    fontSize: "1rem",
  },
};

export default Graph;