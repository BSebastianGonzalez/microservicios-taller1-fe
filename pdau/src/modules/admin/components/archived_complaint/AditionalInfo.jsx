import React from "react";
import ComplaintSidebar from "../standard_complaint/ComplaintSidebar";
import SidebarCategories from "../standard_complaint/SidebarCategories";
import SidebarFiles from "../standard_complaint/SidebarFiles";
import SidebarState from "../standard_complaint/SidebarState";
import Button from "../../../../components/Button";

const AditionalInfo = ({
  categorias,
  files,
  estado,
  onArchive,
}) => (
  <div className="w-full md:w-65 flex flex-col gap-6">
    <ComplaintSidebar>
      <SidebarCategories categorias={categorias} />
      <SidebarFiles files={files} />
      <SidebarState estado={estado} />
      <Button
        text={
          <span className="flex items-center gap-2">
            <img src="/img/unarchive.png" alt="Desarchivar" className="w-5 h-5" />
            Desarchivar denuncia
          </span>
        }
        className="bg-gray-200 hover:bg-gray-400 text-green-600 mt-2"
        onClick={onArchive}
      />
    </ComplaintSidebar>
  </div>
);

export default AditionalInfo;