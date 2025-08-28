import React from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import ComplaintSection from "../../modules/user/complaint/components/ComplaintSection";

const ComplaintInfo = () => {

  return (
    <UserLayout title="Registro de denuncia anonima">
    <ComplaintSection />
    </UserLayout>
  );
};

export default ComplaintInfo;