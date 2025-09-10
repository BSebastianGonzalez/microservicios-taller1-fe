import React from "react";
import Header from "../../../components/Header";

const UserLayout = ({ children }) => {
  return (
    <div style={styles.layout}>
      {/* Header fijo en la parte superior */}
      <Header />
      {/* Contenido principal con margen superior dinámico */}
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "transparent",
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
    position: "relative",
    cursor: 'default',
  },
  main: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent", // Cambia esto
    paddingTop: "100px", // Espacio para el header fijo
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    cursor: 'default',
  },
};

export default UserLayout;