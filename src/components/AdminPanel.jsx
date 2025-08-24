import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeatureManager from './FeatureManager';
import { userService } from '../services/userService';
import './AdminPanel.css';

const AdminPanel = ({ currentSection, sections }) => {
  const getCurrentSectionData = () => {
    return sections.find(section => section.id === currentSection);
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'features':
        return <FeatureManager />;
      case 'users':
        return <UserManager />;
      case 'content':
        return <ContentManager />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <FeatureManager />;
    }
  };

  const currentSectionData = getCurrentSectionData();

  return (
    <div className="admin-panel-container">
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="admin-panel-content"
      >
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <span className="admin-panel-icon">{currentSectionData?.icon}</span>
            <div>
              <h1>{currentSectionData?.name}</h1>
              <p className="admin-panel-subtitle">
                Gérez les paramètres et configurations de cette section
              </p>
            </div>
          </div>
        </div>

        <div className="admin-panel-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderSectionContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// Composant UserManager connecté à Supabase
const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    premium: 0
  });

  // Charger les utilisateurs depuis Supabase
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les utilisateurs depuis la base de données
        const usersData = await userService.getAllUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
        
        // Récupérer les statistiques
        const statsData = await userService.getUserStats();
        setStats({
          total: statsData.total,
          active: statsData.active,
          premium: statsData.premium
        });
        
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        setError('Erreur lors du chargement des utilisateurs. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filtrer les utilisateurs
  useEffect(() => {
    let filtered = users;

    // Filtre par recherche (nom ou email)
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Filtre par rôle
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Actif', class: 'status-active' },
      suspended: { label: 'Suspendu', class: 'status-suspended' },
      inactive: { label: 'Inactif', class: 'status-inactive' },
      deleted: { label: 'Supprimé', class: 'status-deleted' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'status-unknown' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: 'Admin', class: 'role-admin' },
      moderator: { label: 'Modérateur', class: 'role-moderator' },
      user: { label: 'Utilisateur', class: 'role-user' }
    };
    
    const config = roleConfig[role] || { label: role, class: 'role-unknown' };
    return <span className={`role-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      await userService.updateUserStatus(userId, newStatus);
      
      // Mettre à jour la liste locale
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
      // Mettre à jour les statistiques
      const statsData = await userService.getUserStats();
      setStats({
        total: statsData.total,
        active: statsData.active,
        premium: statsData.premium
      });
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Erreur lors de la mise à jour du statut utilisateur.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      
      // Mettre à jour la liste locale
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Mettre à jour les statistiques
      const statsData = await userService.getUserStats();
      setStats({
        total: statsData.total,
        active: statsData.active,
        premium: statsData.premium
      });
      
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'utilisateur.');
    }
  };

  if (loading) {
    return (
      <div className="user-manager">
        <div className="user-manager-header">
          <h2>👥 Gestion Utilisateurs</h2>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des utilisateurs depuis la base de données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-manager">
        <div className="user-manager-header">
          <h2>👥 Gestion Utilisateurs</h2>
        </div>
        <div className="error-container">
          <p>❌ {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-manager">
      <div className="user-manager-header">
        <h2>👥 Gestion Utilisateurs</h2>
        <div className="user-manager-stats">
          <span className="stat-item">
            <strong>{filteredUsers.length}</strong> utilisateurs affichés
          </span>
          <span className="stat-item">
            <strong>{stats.active}</strong> actifs
          </span>
          <span className="stat-item">
            <strong>{stats.premium}</strong> premium
          </span>
        </div>
      </div>

      <div className="user-manager-controls">
        <div className="user-manager-left">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters-container">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">📊 Tous les statuts</option>
              <option value="active">✅ Actif</option>
              <option value="suspended">⚠️ Suspendu</option>
              <option value="inactive">⏸️ Inactif</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">👥 Tous les rôles</option>
              <option value="admin">👑 Admin</option>
              <option value="moderator">🛡️ Modérateur</option>
              <option value="user">👤 Utilisateur</option>
            </select>
          </div>
        </div>
      </div>

      <div className="user-list-container">
        {filteredUsers.length === 0 ? (
          <div className="no-results">
            <p>🔍 Aucun utilisateur trouvé avec ces critères</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Statut</th>
                <th>Rôle</th>
                <th>Premium</th>
                <th>Créé le</th>
                <th>Dernière connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="user-row">
                  <td className="user-info">
                    <div className="user-avatar">
                      <span>{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-id">ID: {user.id}</div>
                    </div>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    {user.premium ? (
                      <span className="premium-badge">⭐ Premium</span>
                    ) : (
                      <span className="standard-badge">Standard</span>
                    )}
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.lastLogin)}</td>
                  <td className="user-actions">
                    <select
                      value={user.status}
                      onChange={(e) => handleUpdateUserStatus(user.id, e.target.value)}
                      className="action-select"
                    >
                      <option value="active">✅ Activer</option>
                      <option value="suspended">⚠️ Suspendre</option>
                      <option value="inactive">⏸️ Désactiver</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="delete-button"
                      title="Supprimer l'utilisateur"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const ContentManager = () => (
  <div className="admin-card">
    <div className="admin-card-header">
      <h2 className="admin-card-title">Gestion du contenu</h2>
    </div>
    <div className="admin-card-body">
      <p>Fonctionnalité à venir...</p>
    </div>
  </div>
);

const Analytics = () => (
  <div className="admin-card">
    <div className="admin-card-header">
      <h2 className="admin-card-title">Analytics</h2>
    </div>
    <div className="admin-card-body">
      <p>Fonctionnalité à venir...</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="admin-card">
    <div className="admin-card-header">
      <h2 className="admin-card-title">Paramètres</h2>
    </div>
    <div className="admin-card-body">
      <p>Fonctionnalité à venir...</p>
    </div>
  </div>
);

export default AdminPanel; 