import React from 'react';
import './Sidebar.css';

const Sidebar = ({ sections, currentSection, onSectionChange, isOpen, onClose }) => {
  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className={`admin-sidebar-overlay ${isOpen ? 'show' : ''}`}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-content">
          <nav className="admin-sidebar-nav">
            <ul className="admin-nav-list">
              {sections.map((section) => (
                <li key={section.id} className="admin-nav-item">
                                     <button
                     className={`admin-nav-link ${currentSection === section.id ? 'active' : ''}`}
                     onClick={() => {
                       onSectionChange(section.id);
                       // Ne pas fermer la sidebar quand on clique sur un onglet
                     }}
                   >
                    <span className="admin-nav-icon">{section.icon}</span>
                    <span className="admin-nav-text">{section.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
              </aside>
    </>
  );
};

export default Sidebar; 