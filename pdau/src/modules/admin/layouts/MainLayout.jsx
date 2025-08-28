import Sidebar from "../components/sidebar";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const adminData = location.state?.admin;
  return (
    <div className="flex h-screen w-screen">
      {/* Barra lateral */}
      <div className="w-60 flex-shrink-0">
        <Sidebar adminData={adminData} />
      </div>
      {/* Contenido principal */}
      <div className="flex-grow h-full bg-gray-100">{children}</div>
    </div>
  );
};

export default MainLayout;
