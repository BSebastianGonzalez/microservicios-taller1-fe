import React from 'react';
import { FiX, FiClock, FiCheckCircle } from 'react-icons/fi';

// Componente independiente para el menú de notificaciones
const NotificationMenu = ({
  notifRef,
  notifications,
  isNotifOpen,
  toggleNotifMenu,
  markAllRead,
  handleNotifClick,
  navigate,
}) => {
  const styles = {
    root: { position: 'relative' },
    iconBtn: {
      position: 'relative',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      transition: 'background-color 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menu: {
      position: 'absolute',
      top: '52px',
      right: '0px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 8px 24px rgba(2,6,23,0.12)',
      width: '320px',
      maxHeight: '360px',
      overflowY: 'auto',
      padding: '8px',
      zIndex: 1200,
      opacity: isNotifOpen ? 1 : 0,
      visibility: isNotifOpen ? 'visible' : 'hidden',
      transform: isNotifOpen ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'all 0.22s cubic-bezier(.2,.9,.2,1)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      borderBottom: '1px solid #eef2f7',
      marginBottom: '6px',
    },
    item: {
      display: 'flex',
      gap: '12px',
      padding: '10px 12px',
      alignItems: 'flex-start',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.15s',
    },
    itemIcon: {
      minWidth: '36px',
      minHeight: '36px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
      color: '#0f172a',
    },
    empty: { padding: '18px', textAlign: 'center', color: '#64748b' },
    footer: { padding: '8px 12px', borderTop: '1px solid #eef2f7', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    unreadDot: { position: 'absolute', top: '6px', right: '6px', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.08)' },
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div ref={notifRef} style={styles.root}>
      <div
        style={styles.iconBtn}
        onClick={toggleNotifMenu}
        title="Notificaciones"
        aria-haspopup="true"
        aria-expanded={isNotifOpen}
      >
        {/* Icon provisto por el padre (FiBell) — aquí solo contenedor */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        {unreadCount > 0 && <span style={styles.unreadDot} />}
      </div>

      <div style={styles.menu} role="dialog" aria-label="Menú de notificaciones">
        <div style={styles.header}>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>Notificaciones</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={(e) => { e.stopPropagation(); markAllRead(); }} style={{ background: 'transparent', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Marcar todo</button>
            <button onClick={(e) => { e.stopPropagation(); toggleNotifMenu(e); }} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '4px', borderRadius: '6px' }} aria-label="Cerrar notificaciones"><FiX /></button>
          </div>
        </div>

        <div>
          {notifications.length === 0 && <div style={styles.empty}>No hay notificaciones</div>}
          {notifications.map((n) => (
            <div key={n.id}
              style={{
                ...styles.item,
                backgroundColor: n.read ? 'transparent' : '#f8fafc',
                borderLeft: n.read ? 'none' : '3px solid #2563eb',
                marginBottom: 6,
              }}
              onClick={() => handleNotifClick(n)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fbfbfd'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : '#f8fafc'}
            >
              <div style={styles.itemIcon}>
                {n.type === 'success' ? <FiCheckCircle /> : n.type === 'reminder' ? <FiClock /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.2 }}>{n.text}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 6 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <button onClick={(e) => { e.stopPropagation(); navigate('/notifications'); }} style={{ background: 'transparent', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>Ver todas</button>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{unreadCount} sin leer</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationMenu;