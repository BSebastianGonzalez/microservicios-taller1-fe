import React from "react";

const SidebarCategories = ({ categorias }) => (
  <div style={styles.container}>
    <div style={styles.title}>Categorias</div>
    <div style={styles.categoriesContainer}>
      {(categorias || []).map((cat) => (
        <span
          key={cat.id}
          style={styles.categoryItem}
        >
          {cat.nombre}
        </span>
      ))}
    </div>
  </div>
);

const styles = {
  container: {
    backgroundColor: "#d1d5db",
    color: "black",
    borderRadius: "0.5rem",
    padding: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    backgroundColor: "#2463eb",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    marginBottom: "0.5rem",
    textAlign: "center",
    width: "100%",
    fontSize: "1rem",
  },
  categoriesContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    justifyContent: "center",
    width: "100%",
  },
  categoryItem: {
    backgroundColor: "#ffffffff", 
    color: "#000000",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontWeight: 600,
    fontSize: "0.875rem",
  },
};

export default SidebarCategories;