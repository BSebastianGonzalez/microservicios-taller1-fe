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
}) => (
  <div className="w-full md:w-65 flex flex-col gap-6">
    <ComplaintSidebar>
      <SidebarCategories categorias={categorias} />
      <SidebarFiles files={files} />
      <SidebarState estado={estado} />
      <Button
        text="Cambiar estado"
        className="bg-red-600 hover:bg-red-700 text-white mt-2"
        onClick={onChangeState}
      />
      {stateChanges.length > 0 && (
        <Button
          text="Historial de cambio de estado"
          className="bg-gray-200 hover:bg-gray-400 text-black mt-0"
          onClick={onShowHistory}
        />
      )}
      <Button
        text={
          <span className="flex items-center gap-2">
            <img src="/img/file.png" alt="Archivo" className="w-5 h-5" />
            Archivar denuncia
          </span>
        }
        className="bg-gray-200 hover:bg-gray-400 text-red-600 mt-2"
        onClick={onArchive}
      />
    </ComplaintSidebar>
  </div>
);

export default ComplaintSidebarActions;