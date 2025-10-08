import Sidebar from "../components/sidebar";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const adminData = location.state?.admin;
  
  return (
    <div style={styles.container}>
      {/* Barra lateral */}
        <Sidebar adminData={adminData} />
      {/* Contenido principal */}
        {children}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#ffffffff",
    overflow: "hidden",
  },
  mainContent: {
    flex: 1,
    height: "100%",
    backgroundColor: "#f8fafc",
    overflow: "auto",
    position: "relative",
    backgroundImage: "linear-gradient(135deg, #f8fafc 0%, #ffffffff 100%)",
  },
};

export default MainLayout;
