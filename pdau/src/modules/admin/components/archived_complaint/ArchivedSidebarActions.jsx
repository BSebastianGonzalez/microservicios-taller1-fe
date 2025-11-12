import React from "react";
import ComplaintSidebar from "../standard_complaint/ComplaintSidebar";
import SidebarCategories from "../standard_complaint/SidebarCategories";
import SidebarFiles from "../standard_complaint/SidebarFiles";
import SidebarState from "../standard_complaint/SidebarState";
import Button from "../../../../components/Button";

const ArchivedSidebarActions = ({
  categorias,
  files,
  estado,
  onUnarchive,
  onShowHistory,
  archivingHistory,
}) => {
  

  return (
    <div style={styles.container}>
      <ComplaintSidebar>
        <SidebarCategories categorias={categorias} />
        <SidebarFiles files={files} />
        <SidebarState estado={estado} />

        {/* Botón para ver historial */}
        {archivingHistory.length > 0 && (
          <Button
            text={`Ver Historial (${archivingHistory.length})`}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onShowHistory}
          />
        )}

        {/* Botón para desarchivar */}
        <Button
          text="Desarchivar denuncia"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={onUnarchive}
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

export default ArchivedSidebarActions;