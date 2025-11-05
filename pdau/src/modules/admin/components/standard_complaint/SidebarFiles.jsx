import React from "react";

const SidebarFiles = ({ files }) => {
  const getFileIcon = (fileName) => {
    const name = (fileName || "").toLowerCase();
    if (/\.(jpg|jpeg|png|gif|bmp|webp|tif|tiff|ico|svg)$/.test(name)) {
      return "/img/photo.png";
    } else if (/\.(mp4|webm|ogv|ogg|mov|flv|m3u8|3gp)$/.test(name)) {
      return "/img/video.png";
    } else if (/\.(mp3|wav|aac)$/.test(name)) {
      return "/img/audio.png";
    }
    return "/img/document.png";
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Archivos de evidencia</div>
      {files.length > 0 ? (
        <ul style={styles.filesList}>
          {files.map((file) => (
            <li
              key={file.id}
              style={styles.fileItem}
            >
              <img 
                src={getFileIcon(file.nombreArchivo || file.urlArchivo)} 
                alt="Archivo" 
                style={styles.fileIcon} 
              />
              <a
                href={file.urlArchivo || "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.fileLink}
                title={file.nombreArchivo || file.urlArchivo}
              >
                {file.nombreArchivo || file.urlArchivo}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <span style={styles.noFiles}>No hay archivos</span>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#d1d5db",
    color: "white",
    borderRadius: "0.5rem",
    padding: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: "0.75rem",
    backgroundColor: "#2463eb",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    textAlign: "center",
    width: "100%",
  },
  filesList: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  fileItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    backgroundColor: "#ffffffff",
    borderRadius: "0.25rem",
    padding: "0.5rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    transition: "background-color 0.2s",
  },
  fileIcon: {
    width: "1.5rem",
    height: "1.5rem",
    flexShrink: 0,
  },
  fileLink: {
    color: "#1e3a8a",
    fontWeight: 500,
    textDecoration: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  noFiles: {
    color: "#d1d5db",
    fontStyle: "italic",
  },
};

export default SidebarFiles;