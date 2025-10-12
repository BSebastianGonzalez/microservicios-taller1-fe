import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Header from "../components/Header";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const adminData = location.state?.admin;
  
  return (
    <div style={styles.container}>
      {/* Sidebar fijo */}
      <div style={styles.sidebarWrapper}>
        <Sidebar adminData={adminData} />
      </div>
      
      {/* Contenido principal */}
      <div style={styles.mainWrapper}>
        {/* Header que empieza después del sidebar */}
        <div style={styles.headerWrapper}>
          <Header />
        </div>
        
        {/* Contenido de la página */}
        <main style={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  
  sidebarWrapper: {
    width: "260px",
    flexShrink: 0,
    position: "fixed",
    left: 0,
    top: 0,
    height: "100vh",
    zIndex: 1000,
  },
  
  mainWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginLeft: "260px",
    minHeight: "100vh",
  },
  
  headerWrapper: {
    flexShrink: 0,
    position: "sticky",
    top: 0,
    zIndex: 900,
  },
  
  mainContent: {
    flex: 1,
    overflow: "auto",
    minHeight: "calc(100vh - 70px)", // Altura total menos header
    width: "100%",
    position: "relative",
  },
};

export default MainLayout;