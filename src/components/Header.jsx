import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = ({ onMenuClick, sidebarOpen }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <motion.header
      className="admin-header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="admin-header-content">
        <div className="admin-header-left">
          <button
            className="admin-menu-btn"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <span className={`menu-icon ${sidebarOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <div className="admin-header-brand">
            <div className="admin-logo">
              <div className="admin-logo-text">
                <h1>HERBBIE</h1>
                <span>Administration</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-header-right">
          <div className="admin-header-actions">
            <div className="admin-user-menu">
              <button
                className="admin-user-btn"
                onClick={toggleUserMenu}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="admin-user-avatar">
                  <span>👤</span>
                </div>
                <span className="admin-user-name">
                  {user?.email?.split('@')[0] || 'Admin'}
                </span>
                <span className={`admin-user-arrow ${userMenuOpen ? 'open' : ''}`}>▼</span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className="admin-user-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="admin-user-info">
                      <div className="admin-user-email">{user?.email}</div>
                      <div className="admin-user-role">Administrateur</div>
                    </div>
                    <div className="admin-user-actions">
                      <button
                        className="admin-user-action-btn"
                        onClick={handleSignOut}
                      >
                        <span>🚪</span>
                        Se déconnecter
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 