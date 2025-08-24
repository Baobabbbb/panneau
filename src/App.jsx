import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  const [currentSection, setCurrentSection] = useState('features');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    { id: 'features', name: 'Gestion des fonctionnalités', icon: '⚙️', component: 'FeatureManager' },
    { id: 'users', name: 'Gestion des utilisateurs', icon: '👥', component: 'UserManager' },
    { id: 'content', name: 'Gestion du contenu', icon: '📚', component: 'ContentManager' },
    { id: 'analytics', name: 'Analytics', icon: '📊', component: 'Analytics' },
    { id: 'settings', name: 'Paramètres', icon: '🔧', component: 'Settings' }
  ];

  return (
    <div className="admin-app">
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="admin-layout">
        <Sidebar 
          sections={sections}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <AdminPanel 
            currentSection={currentSection}
            sections={sections}
          />
        </main>
      </div>
    </div>
  );
}

export default App; 