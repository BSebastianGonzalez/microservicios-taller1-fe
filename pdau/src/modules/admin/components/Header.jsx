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
    const loadAdminData = () => {
      try {
        const adminData = AdminService.getCurrentAdmin();
        if (adminData && adminData.admin) {
          // Si tu API devuelve los datos dentro de un objeto "admin"
          const { nombre, apellido, rol } = adminData.admin;
          setAdminProfile({
            name: `${nombre || ''} ${apellido || ''}`.trim() || 'Administrador',
            role: rol || 'Administrador'
          });
        } else if (adminData) {
          // Si los datos están en el nivel principal
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
      '/password_change': 'Cambiar Contraseña'
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

  const handleMenuClick = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    if (section === 'view_profile') return navigate('/data');
    if (section === 'edit_profile') return navigate('/data_update');
    if (section === 'documents') return navigate('/personal_documents');
    if (section === 'password') return navigate('/password_change');
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