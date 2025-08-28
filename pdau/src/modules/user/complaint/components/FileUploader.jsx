import React, { useState } from "react";

const FileUploader = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const updatedFiles = [...files, ...selectedFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    e.target.value = null;
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const styles = {
    container: {
      width: '100%',
    },
    uploadArea: {
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      padding: '1rem',
    },
    fileList: {
      marginBottom: '1rem',
    },
    fileItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f3f4f6',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      marginBottom: '0.5rem',
    },
    removeButton: {
      color: '#ef4444',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      textDecoration: 'underline',
    },
    noFiles: {
      color: '#6b7280',
    },
    uploadLabel: {
      display: 'block',
      marginTop: '1rem',
    },
    uploadLink: {
      color: '#3b82f6',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    fileInput: {
      display: 'none',
    },
    infoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    infoIcon: {
      width: '1rem',
      height: '1rem',
      color: '#9ca3af',
    },
    infoText: {
      fontSize: '0.75rem',
      color: '#6b7280',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.uploadArea}>
        <div style={styles.fileList}>
          {files.length > 0 ? (
            files.map((file, index) => (
              <div key={index} style={styles.fileItem}>
                <span>{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  style={styles.removeButton}
                >
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <div style={styles.noFiles}>No se han subido archivos</div>
          )}
        </div>
        <label style={styles.uploadLabel}>
          <span style={styles.uploadLink}>
            Subir archivo
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            style={styles.fileInput}
            multiple
            accept="
              .jpg,.jpeg,.png,.gif,.bmp,.webp,.tif,.tiff,.ico,.svg,
              .mp4,.webm,.ogv,.ogg,.mov,.flv,.m3u8,.3gp,
              .mp3,.wav,.aac,
              image/jpeg,image/png,image/gif,image/bmp,image/webp,image/tiff,image/x-icon,image/svg+xml,
              video/mp4,video/webm,video/ogg,video/quicktime,video/x-flv,application/x-mpegURL,video/3gpp,
              audio/mpeg,audio/wav,audio/ogg,audio/aac
            "
          />
        </label>
        <div style={styles.infoSection}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={styles.infoIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <span style={styles.infoText}>
            Imágenes: .jpg, .jpeg, .png, .gif, .bmp, .webp, .tif, .tiff, .ico, .svg&nbsp;|&nbsp;
            Video/Audio: .mp4, .webm, .ogv, .ogg, .mov, .flv, .m3u8, .3gp, .mp3, .wav, .aac
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;