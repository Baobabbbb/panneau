import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import './App.css';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Composant protégé qui nécessite une authentification admin
const ProtectedApp = () => {
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
};

// Composant principal qui gère l'authentification
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Composant de contenu qui vérifie l'authentification
const AppContent = () => {
  const { isAuthenticated, loading, authenticateWithToken } = useAuth();
  const [autoAuthLoading, setAutoAuthLoading] = useState(false);

  // Vérifier l'authentification automatique au montage
  useEffect(() => {
    const checkAutoAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const source = urlParams.get('source');

      if (token && source === 'herbbie') {
        console.log('🚀 Détection d\'accès via Herbbie - Authentification automatique');
        setAutoAuthLoading(true);
        
        try {
          const result = await authenticateWithToken(token);
          if (result) {
            // Nettoyer l'URL
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log('✅ Authentification automatique réussie');
          } else {
            console.warn('❌ Authentification automatique échouée');
          }
        } catch (error) {
          console.error('Erreur authentification automatique:', error);
        } finally {
          setAutoAuthLoading(false);
        }
      }
    };

    checkAutoAuth();
  }, [authenticateWithToken]);

  // Afficher un écran de chargement pendant la vérification
  if (loading || autoAuthLoading) {
    return (
      <div className="loading-container">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="loading-logo">
            <h1>HERBBIE</h1>
            <span>Administration</span>
          </div>
        </motion.div>
        <p>
          {autoAuthLoading 
            ? 'Authentification automatique en cours...' 
            : 'Vérification de l\'accès administrateur...'
          }
        </p>
      </div>
    );
  }

  // Afficher le formulaire de connexion si non authentifié
  if (!isAuthenticated) {
    return <Login />;
  }

  // Afficher l'application protégée si authentifié
  return <ProtectedApp />;
};

export default App; 