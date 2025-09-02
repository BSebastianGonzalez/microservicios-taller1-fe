import React from "react";
import LoginLayout from "../../modules/admin/login/layouts/LoginLayout";
import CredentialsSection from "../../modules/admin/login/components/CredentialsSection";

const LoginPage = () => {
  
  return (
      <LoginLayout>
        <CredentialsSection />
      </LoginLayout>
  );
};

export default LoginPage;