// utils/documentViewer.js
// Utilidad para abrir documentos con título y favicon personalizado

/**
 * Genera un favicon SVG según el tipo de archivo
 */
export const generateFaviconSVG = (extension) => {
  const colors = {
    pdf: '#dc2626',
    doc: '#2563eb',
    docx: '#2563eb',
    xls: '#059669',
    xlsx: '#059669',
    jpg: '#7c3aed',
    jpeg: '#7c3aed',
    png: '#7c3aed',
    gif: '#7c3aed',
    webp: '#7c3aed',
    default: '#6b7280'
  };

  const color = colors[extension?.toLowerCase()] || colors.default;

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  `)}`;
};

/**
 * Crea una página HTML completa para mostrar un documento (sin header, pantalla completa)
 */
export const createDocumentViewerHTML = (fileUrl, fileName, fileType) => {
  const extension = fileName?.split('.').pop()?.toLowerCase() || '';
  const faviconUrl = generateFaviconSVG(extension);
  
  const isPdf = fileType === 'application/pdf' || extension === 'pdf';
  const isImage = fileType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
  
  let content = '';
  
  if (isPdf) {
    content = `<embed src="${fileUrl}" type="application/pdf" width="100%" height="100%" style="border: none;">`;
  } else if (isImage) {
    content = `
      <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background: #0f172a;">
        <img src="${fileUrl}" alt="${fileName}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
      </div>
    `;
  } else {
    content = `<iframe src="${fileUrl}" width="100%" height="100%" style="border: none;"></iframe>`;
  }
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${fileName}</title>
      <link rel="icon" href="${faviconUrl}">
      <style>
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        html, body { 
          width: 100%; 
          height: 100%; 
          overflow: hidden;
        }
        body { 
          display: flex;
          background: #ffffff;
        }
        embed, iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
  
  return htmlContent;
};

/**
 * Abre un documento en una nueva pestaña con título y favicon personalizado
 */
export const openDocumentInNewTab = (fileBlob, fileName, fileType) => {
  try {
    console.log('📂 Abriendo documento:', fileName);
    
    // Crear URL del archivo original
    const fileUrl = URL.createObjectURL(fileBlob);
    
    // Generar HTML personalizado
    const htmlContent = createDocumentViewerHTML(fileUrl, fileName, fileType);
    
    // Crear blob del HTML
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    
    // Abrir en nueva pestaña
    const newWindow = window.open(htmlUrl, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      console.error('❌ No se pudo abrir ventana emergente');
      alert('Por favor permite ventanas emergentes en tu navegador para ver los archivos');
      URL.revokeObjectURL(fileUrl);
      URL.revokeObjectURL(htmlUrl);
      return;
    }
    
    console.log('✅ Documento abierto en nueva pestaña');
    
    // Limpiar URLs después de un tiempo
    setTimeout(() => {
      try {
        URL.revokeObjectURL(fileUrl);
        URL.revokeObjectURL(htmlUrl);
        console.log('🗑️ URLs temporales limpiadas');
      } catch (e) {
        console.log('URLs ya revocadas');
      }
    }, 60000); // 1 minuto
    
  } catch (error) {
    console.error('❌ Error abriendo documento:', error);
    throw error;
  }
};

/**
 * Abre un documento desde una URL directa (para archivos ya subidos al servidor)
 */
export const openDocumentFromUrl = (url, fileName) => {
  try {
    console.log('🔗 Abriendo documento desde URL:', url);
    
    // Determinar el tipo de archivo por la extensión
    const extension = fileName?.split('.').pop()?.toLowerCase() || '';
    let fileType = 'application/octet-stream';
    
    if (extension === 'pdf') fileType = 'application/pdf';
    else if (['jpg', 'jpeg'].includes(extension)) fileType = 'image/jpeg';
    else if (extension === 'png') fileType = 'image/png';
    else if (extension === 'gif') fileType = 'image/gif';
    
    // Generar HTML personalizado
    const htmlContent = createDocumentViewerHTML(url, fileName, fileType);
    
    // Crear blob del HTML
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    
    // Abrir en nueva pestaña
    const newWindow = window.open(htmlUrl, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      console.error('❌ No se pudo abrir ventana emergente');
      alert('Por favor permite ventanas emergentes en tu navegador para ver los archivos');
      URL.revokeObjectURL(htmlUrl);
      return;
    }
    
    console.log('✅ Documento abierto en nueva pestaña');
    
    // Limpiar URL después de un tiempo
    setTimeout(() => {
      try {
        URL.revokeObjectURL(htmlUrl);
        console.log('🗑️ URL temporal limpiada');
      } catch (e) {
        console.log('URL ya revocada');
      }
    }, 60000);
    
  } catch (error) {
    console.error('❌ Error abriendo documento:', error);
    throw error;
  }
};