import React, { useState, useRef, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';
import AdminService from '../../../services/AdminService';

const Header = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [adminProfile, setAdminProfile] = useState({ name: 'Cargando...', role: 'Administrador' });
  
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        // Primero, leer lo que hay en localStorage (login info)
        const stored = JSON.parse(localStorage.getItem('admin')) || {};

        // Intentar extraer un id numérico conocido
        const idCandidate = stored?.id || stored?._id || stored?.admin?.id || stored?.admin?._id || stored?.user?.id || stored?.admin?.userId;

        if (idCandidate) {
          const id = Number(idCandidate);
          if (Number.isFinite(id)) {
            try {
              const data = await AdminService.getAdminById(id);
              // Mapear posibles nombres/roles devueltos por backend
              const nombre = data?.nombre || data?.firstName || data?.name || data?.admin?.nombre;
              const apellido = data?.apellido || data?.lastName || data?.surname || data?.admin?.apellido;
              const rol = data?.rol || data?.role || data?.admin?.rol || data?.admin?.role;

              setAdminProfile({
                name: `${nombre || ''} ${apellido || ''}`.trim() || 'Administrador',
                role: rol || 'Administrador'
              });
              return;
            } catch (err) {
              console.warn('No se pudo obtener admin por id:', err);
              // caeremos al fallback y mostraremos lo que hay en localStorage
            }
          }
        }

        // Fallback: usar lo que esté guardado en localStorage (si existe)
        const adminData = AdminService.getCurrentAdmin();
        if (adminData && adminData.admin) {
          const { nombre, apellido, rol } = adminData.admin;
          setAdminProfile({
            name: `${nombre || ''} ${apellido || ''}`.trim() || 'Administrador',
            role: rol || 'Administrador'
          });
        } else if (adminData) {
          const { nombre, apellido, rol } = adminData;
          setAdminProfile({
            name: `${nombre || ''} ${apellido || ''}`.trim() || 'Administrador',
            role: rol || 'Administrador'
          });
        }
      } catch (error) {
        console.error('Error cargando datos del admin:', error);
        setAdminProfile({ name: 'Administrador', role: 'Usuario' });
      }
    };

    loadAdminData();
  }, []);

  // Detectar la página actual y establecer el título
  useEffect(() => {
    const path = location.pathname;
    const titles = {
      '/admin_main': 'Inicio',
      '/data': 'Mi Perfil',
      '/data_update': 'Editar Perfil',
      '/personal_documents': 'Mis documentos personales',
      '/read_complaint': 'Denuncias Anónimas',
      '/archived_complaints': 'Denuncias Archivadas',
      '/stats': 'Estadísticas',
      '/reports': 'Reportes',
      '/admin_change_password': 'Cambiar contraseña'
    };
    
    setPageTitle(titles[path] || 'Dashboard');
  }, [location.pathname]);

  // ejemplo de notificaciones
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nuevo mensaje', text: 'Tienes un nuevo mensaje de soporte.', time: '2h', type: 'message', read: false },
    { id: 2, title: 'Actualización de perfil', text: 'Tus datos fueron actualizados correctamente.', time: '1d', type: 'success', read: true },
    { id: 3, title: 'Recordatorio', text: 'Revisa la documentación pendiente.', time: '3d', type: 'reminder', read: false },
  ]);

  // handlers usados por los subcomponentes
  const toggleMenu = () => {
    setIsMenuOpen((s) => {
      const next = !s;
      if (next) setIsNotifOpen(false);
      return next;
    });
  };

  const toggleNotifMenu = (e) => {
    e.stopPropagation();
    setIsNotifOpen((s) => {
      const next = !s;
      if (next) setIsMenuOpen(false);
      return next;
    });
  };

  const markAllRead = () => setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  const handleNotifClick = (notif) => { 
    setNotifications((prev) => prev.map(n => n.id === notif.id ? { ...n, read: true } : n)); 
    setIsNotifOpen(false); 
  };

  const handleMenuClick = async (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);

    if (section === 'view_profile') return navigate('/data');

    if (section === 'edit_profile') {
      // intentar pasar los datos del admin al navegar para que el formulario cargue inmediatamente
      try {
        const stored = AdminService.getCurrentAdmin() || {};
        const idCandidate = stored?.id || stored?._id || stored?.admin?.id || stored?.admin?._id || stored?.user?.id || stored?.admin?.userId;
        if (idCandidate) {
          const id = Number(idCandidate);
          if (Number.isFinite(id)) {
            try {
              const data = await AdminService.getAdminById(id);
              // navegar pasando adminData en state
              return navigate('/data_update', { state: { adminData: data } });
            } catch (err) {
              console.warn('No se pudo obtener admin por id antes de navegar a editar:', err);
              // fallback al stored
            }
          }
        }

        // fallback: navegar con lo que tengamos en localStorage (puede contener admin o token+admin)
        return navigate('/data_update', { state: { adminData: stored } });
      } catch (err) {
        console.error('Error preparando datos para editar perfil:', err);
        return navigate('/data_update');
      }
    }

    if (section === 'documents') return navigate('/personal_documents');

    // admitir tanto 'password' (vía versiones previas) como 'change_password' (ProfileMenu)
    if (section === 'password' || section === 'change_password') return navigate('/admin_change_password');

    if (section === 'logout') {
      AdminService.logout();
      navigate('/admin_login', { replace: true });
    }
  };

  // click fuera (comportamiento mejorado)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuClicked = menuRef.current?.contains(event.target);
      const notifClicked = notifRef.current?.contains(event.target);
      
      if (!menuClicked) setIsMenuOpen(false);
      if (!notifClicked) setIsNotifOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  return (
    <div style={styles.header}>
      {/* Título de la página actual */}
      <div style={styles.headerLeft}>
        <h1 style={styles.pageTitle}>{pageTitle}</h1>
      </div>

      <div style={styles.headerRight}>
        {/* Notificaciones: componente separado */}
        <div style={{ position: 'relative' }}>
          <NotificationMenu
            notifRef={notifRef}
            notifications={notifications}
            isNotifOpen={isNotifOpen}
            toggleNotifMenu={toggleNotifMenu}
            markAllRead={markAllRead}
            handleNotifClick={handleNotifClick}
            navigate={navigate}
          />
        </div>

        {/* Perfil: componente separado */}
        <ProfileMenu
          menuRef={menuRef}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          handleMenuClick={handleMenuClick}
          profile={adminProfile}
        />
      </div>
    </div>
  );
};

const styles = {
    header: { 
      backgroundColor: 'white', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',  
      height: '70px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      position: 'relative',
      padding: '0 24px',
      width: '(100% - 260px)',
      zIndex: 800,
    },
    headerLeft: {
      display: 'flex',
      flexDirection: 'column',
    },
    pageTitle: { 
      fontSize: '1.8rem', 
      fontWeight: '700', 
      color: '#1f2937',
      margin: 0,
    },
    pageSubtitle: {
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: '500',
      margin: 0,
    },
    headerRight: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '16px' 
    },
    notificationIcon: { 
      position: 'relative', 
      cursor: 'pointer', 
      padding: '8px', 
      borderRadius: '50%', 
      transition: 'background-color 0.3s', 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
  };


export default Header;