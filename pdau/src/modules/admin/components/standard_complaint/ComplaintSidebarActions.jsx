import React from "react";
import ComplaintSidebar from "./ComplaintSidebar";
import SidebarCategories from "./SidebarCategories";
import SidebarFiles from "./SidebarFiles";
import SidebarState from "./SidebarState";
import Button from "../../../../components/Button";

const ComplaintSidebarActions = ({
  categorias,
  files,
  estado,
  onChangeState,
  onShowHistory,
  onArchive,
  stateChanges,
}) => {
  // Determinar si el botón debe estar deshabilitado
  const isStateChangeDisabled = estado?.nombre === "Resuelta";
  
  return (
    <div style={styles.container}>
      <ComplaintSidebar>
        <SidebarCategories categorias={categorias} />
        <SidebarFiles files={files} />
        <SidebarState estado={estado} />
        <Button
          text={isStateChangeDisabled ? "Estado Resuelto (Bloqueado)" : "Cambiar estado"}
          className={
            isStateChangeDisabled 
              ? "bg-gray-400 cursor-not-allowed text-white" 
              : "bg-red-600 hover:bg-red-700 text-white"
          }
          onClick={isStateChangeDisabled ? undefined : onChangeState}
          disabled={isStateChangeDisabled}
        />
        {stateChanges.length > 0 && (
          <Button
            text="Historial de cambio de estado"
            className="bg-gray-200 hover:bg-gray-400 text-black"
            onClick={onShowHistory}
          />
        )}
        <Button
          text={
            <span style={styles.archiveButtonContent}>
              <img src="/img/file.png" alt="Archivo" style={styles.archiveIcon} />
              Archivar denuncia
            </span>
          }
          className="bg-gray-200 hover:bg-gray-400 text-red-600"
          onClick={onArchive}
        />
      </ComplaintSidebar>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  archiveButtonContent: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  archiveIcon: {
    width: "1.25rem",
    height: "1.25rem",
  },
};

export default ComplaintSidebarActions;