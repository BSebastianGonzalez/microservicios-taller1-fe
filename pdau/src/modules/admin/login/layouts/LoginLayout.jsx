import React from "react";

const LoginLayout = ({ children }) => {
  
  return (
    <div style={styles.container}>
      {/* Contenido principal */}
      <div style={styles.mainContent}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  mainContent: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: "0", // Eliminado el padding
    minHeight: 0, // Elimina el minHeight para que el contenido y el footer se ajusten al alto de la pantalla
    backgroundImage: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    boxSizing: "border-box",
    flexDirection: "column",
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    cursor: 'default',
  },
};

export default LoginLayout;