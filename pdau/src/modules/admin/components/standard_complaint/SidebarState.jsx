import React from "react";
import StatusTag from "../../../../components/StatusTag";

const SidebarState = ({ estado }) => (
  <div style={styles.container}>
    <div style={styles.title}>Estado actual</div>
    <div style={styles.stateContainer}>
      <StatusTag
        text={estado?.nombre}
        className="text-lg font-bold px-6 py-2 rounded-lg shadow bg-white text-purple-900 border border-purple-300"
      />
    </div>
  </div>
);

const styles = {
  container: {
    backgroundColor: "#d1d5db",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: "0",
    backgroundColor: "#2463eb",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    textAlign: "center",
    width: "100%",
  },
  stateContainer: {
    marginTop: "0",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
};

export default SidebarState;