import React from "react";
import UserLayout from "../../modules/user/layouts/UserLayout";
import RegisterSection from "../../modules/user/complaint/components/RegisterSection";
import Footer from "../../components/Footer";

const ComplaintRegister = () => {
  return (
    <>
      <UserLayout title="Formulario de denuncia anónima">
        <div style={styles.container}>
          <RegisterSection />
        </div>
      </UserLayout>
      <Footer />
    </>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "2rem 1rem",
    background: "#ffffff",
    borderRadius: "1rem",
    boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
    minHeight: "500px", // Altura mínima
  },
};

export default ComplaintRegister;