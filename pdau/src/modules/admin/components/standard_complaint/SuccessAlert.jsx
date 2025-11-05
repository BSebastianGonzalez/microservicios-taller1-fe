import React from "react";

const SuccessAlert = ({ show, message }) => {
  if (!show) return null;

  return (
    <div style={styles.container}>
      <div style={styles.alert}>
        {message}
      </div>
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(40px);}
          10% { opacity: 1; transform: translateY(0);}
          90% { opacity: 1; transform: translateY(0);}
          100% { opacity: 0; transform: translateY(40px);}
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 50,
  },
  alert: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "1rem 2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    fontSize: "1.25rem",
    fontWeight: "bold",
    animation: "fadeInOut 2s",
  },
};

export default SuccessAlert;