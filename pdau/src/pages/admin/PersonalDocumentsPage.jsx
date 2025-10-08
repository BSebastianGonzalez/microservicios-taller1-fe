import React from "react";
import MainLayout from "../../modules/admin/layouts/MainLayout";
import PersonalDocuments from "../../modules/admin/data/PersonalDocuments";

const PersonalDocumentsPage = () => {
  return (
    <MainLayout>
      <PersonalDocuments />
    </MainLayout>
  );
};

export default PersonalDocumentsPage;