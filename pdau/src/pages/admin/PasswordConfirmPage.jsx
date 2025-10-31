import React from "react";
import LoginLayout from "../../modules/admin/login/layouts/LoginLayout";
import ConfirmPassword from "../../modules/admin/login/components/ConfirmPassword";

const PasswordConfirmPage = () => {
  return (
    <LoginLayout>
      <ConfirmPassword />
    </LoginLayout>
  );
};

export default PasswordConfirmPage;
