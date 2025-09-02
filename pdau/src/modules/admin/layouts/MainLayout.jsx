import Sidebar from "../components/sidebar";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const adminData = location.state?.admin;
  
  return (
    <div style={styles.container}>
      {/* Barra lateral */}
      <div style={styles.sidebar}>
        <Sidebar adminData={adminData} />
      </div>
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
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f8fafc",
    overflow: "hidden",
  },
  sidebar: {
    width: "260px",
    flexShrink: 0,
    backgroundColor: "#1e293b",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
    position: "relative",
    zIndex: 10,
    borderRight: "1px solid #334155",
  },
  mainContent: {
    flex: 1,
    height: "100%",
    backgroundColor: "#f8fafc",
    overflow: "auto",
    position: "relative",
    backgroundImage: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  },
};

export default MainLayout;
