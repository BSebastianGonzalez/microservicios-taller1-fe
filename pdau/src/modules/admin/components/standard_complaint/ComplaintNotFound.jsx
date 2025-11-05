import React from "react";

const ComplaintNotFound = () => (
  <div style={styles.container}>
    No se encontró la denuncia.
  </div>
);

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
    color: "#dc2626",
    fontSize: "1.125rem",
  },
};

export default ComplaintNotFound;