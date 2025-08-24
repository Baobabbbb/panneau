import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';

const Header = ({ onMenuClick, sidebarOpen }) => {
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
                <h1>FRIDAY</h1>
                <span>Administration</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="admin-header-right">
          <div className="admin-header-actions">
            <div className="admin-user-menu">
              <button className="admin-user-btn">
                <div className="admin-user-avatar">
                  <span>👤</span>
                </div>
                <span className="admin-user-name">Administrateur</span>
                <span className="admin-user-arrow">▼</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 