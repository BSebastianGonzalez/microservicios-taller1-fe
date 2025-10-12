import React from 'react';
import { FiUser, FiLock, FiFileText, FiLogOut, FiChevronDown } from 'react-icons/fi';

const ProfileMenu = ({ menuRef, isMenuOpen, toggleMenu, handleMenuClick, profile }) => {
  const styles = {
    profileSection: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        cursor: 'pointer', 
        padding: '8px 12px', 
        borderRadius: '8px', 
        transition: 'background-color 0.3s' 
    },
    profileImage: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e9ecef' },
    profileInfo: { display: 'flex', flexDirection: 'column' },
    profileName: { fontWeight: '600', fontSize: '14px', color: '#333' },
    profileRole: { fontSize: '12px', color: '#6c757d' },
    dropdownMenu: { 
        position: 'absolute', 
        top: '70.5px', 
        right: '25px', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
        width: '220px', 
        padding: '8px 0', 
        zIndex: 1000, 
        opacity: isMenuOpen ? 1 : 0, 
        visibility: isMenuOpen ? 'visible' : 'hidden', transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)', 
        transition: 'all 0.3s ease' 
    },
    menuItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer', transition: 'background-color 0.2s', color: '#333', textDecoration: 'none' },
    menuDivider: { height: '1px', backgroundColor: '#e9ecef', margin: '8px 0' },
    icon: { width: '18px', height: '18px', color: '#6c757d', display: 'inline-flex', alignItems: 'center' },
    chevron: { marginLeft: '6px', display: 'inline-flex', alignItems: 'center', transition: 'transform 0.18s ease', color: '#6b7280' },
  };

  return (
    <>
      <div ref={menuRef} style={styles.profileSection} onClick={toggleMenu} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
        <img src={profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} alt="Foto de perfil" style={styles.profileImage} />
        <div style={styles.profileInfo}>
          <div style={styles.profileName}>{profile?.name || 'Juan Pérez'}</div>
          <div style={styles.profileRole}>{profile?.role || 'Administrador'}</div>
        </div>

        <FiChevronDown style={{ ...styles.chevron, transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} aria-hidden="true" />
      </div>

      <div style={styles.dropdownMenu} role="menu" aria-hidden={!isMenuOpen}>
        <div style={styles.menuItem} onClick={() => handleMenuClick('view_profile')} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}><FiUser style={styles.icon} />Ver Perfil</div>
        <div style={styles.menuItem} onClick={() => handleMenuClick('edit_profile')} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}><FiUser style={styles.icon} />Editar Perfil</div>
        <div style={styles.menuItem} onClick={() => handleMenuClick('password')} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}><FiLock style={styles.icon} />Cambiar Contraseña</div>
        <div style={styles.menuDivider}></div>
        <div style={styles.menuItem} onClick={() => handleMenuClick('documents')} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}><FiFileText style={styles.icon} />Documentos Personales</div>
        <div style={styles.menuDivider}></div>
        <div style={styles.menuItem} onClick={() => handleMenuClick('logout')} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}><FiLogOut style={styles.icon} />Cerrar Sesión</div>
      </div>
    </>
  );
};

export default ProfileMenu;