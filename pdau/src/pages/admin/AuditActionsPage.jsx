import React from "react";
import MainLayout from "../../modules/admin/layouts/MainLayout";
import AuditActions from "../../modules/admin/audit/AuditActions";

const AuditActionsPage = () => {
  return (
    <MainLayout>    
        <AuditActions />
    </MainLayout>
  );
}

export default AuditActionsPage;