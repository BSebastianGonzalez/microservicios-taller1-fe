const SidebarFiles = ({ files }) => (
  <div className="bg-gray-900 text-white rounded-lg p-4 shadow flex flex-col items-center">
    <div className="font-bold mb-3 bg-gray-900 text-white px-4 py-2 rounded text-center">
      Archivos de evidencia
    </div>
    {files.length > 0 ? (
      <ul className="space-y-2 w-full">
        {files.map((file) => {
          const name = (file.nombreArchivo || file.urlArchivo || "").toLowerCase();
          let icon = "/img/document.png";
          if (/\.(jpg|jpeg|png|gif|bmp|webp|tif|tiff|ico|svg)$/.test(name)) {
            icon = "/img/photo.png";
          } else if (/\.(mp4|webm|ogv|ogg|mov|flv|m3u8|3gp)$/.test(name)) {
            icon = "/img/video.png";
          } else if (/\.(mp3|wav|aac)$/.test(name)) {
            icon = "/img/audio.png";
          }
          return (
            <li
              key={file.id}
              className="flex items-center gap-3 bg-gray-300 rounded px-2 py-2 shadow-sm hover:bg-gray-200 transition"
            >
              <img src={icon} alt="Archivo" className="w-6 h-6" />
              <a
                href={file.urlArchivo || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-900 font-medium hover:underline break-all"
                title={file.nombreArchivo || file.urlArchivo}
              >
                {file.nombreArchivo || file.urlArchivo}
              </a>
            </li>
          );
        })}
      </ul>
    ) : (
      <span className="text-gray-300">No hay archivos</span>
    )}
  </div>
);

export default SidebarFiles;