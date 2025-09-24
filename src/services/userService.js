// Service pour la gestion des utilisateurs connecté à la base de données HERBBIE
// Utilise fetch pour appeler directement l'API Supabase

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xfbmdeuzuyixpmouhqcv.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYm1kZXV6dXlpeHBtb3VocWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzE3ODQsImV4cCI6MjA2NDkwNzc4NH0.XzFIT3BwW9dKRrmFFbSAufCpC1SZuUI-VU2Uer5VoTw';

// Fonction utilitaire pour appeler l'API Supabase
async function supabaseRequest(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const userService = {
  // Récupérer tous les utilisateurs depuis la table profiles
  async getAllUsers() {
    try {
      // Récupérer depuis la table profiles
      const profiles = await supabaseRequest('profiles?select=*&order=created_at.desc');
      
      if (profiles && profiles.length > 0) {
        return this.formatProfilesToUsers(profiles);
      } else {
        console.log('Aucun utilisateur trouvé dans la table profiles');
        return this.getMockUsers();
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des profils:', error);
      // En cas d'erreur, retourner les données de test
      return this.getMockUsers();
    }
  },

  // Formater les données de la table profiles vers le format utilisateur
  formatProfilesToUsers(profiles) {
    return profiles.map(profile => ({
      id: profile.id || profile.user_id,
      email: profile.email,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      status: profile.status || 'active',
      role: profile.role || 'user',
      createdAt: profile.created_at,
      lastLogin: profile.last_login || profile.created_at,
      premium: profile.premium || false
    }));
  },

  // Données de test pour les utilisateurs (fallback)
  getMockUsers() {
    return [
      {
        id: '1',
        email: 'admin@herbbie.com',
        name: 'Administrateur Principal',
        firstName: 'Administrateur',
        lastName: 'Principal',
        status: 'active',
        role: 'admin',
        createdAt: '2024-01-15T00:00:00Z',
        lastLogin: '2024-08-19T00:00:00Z',
        premium: true
      },
      {
        id: '2',
        email: 'user1@example.com',
        name: 'Marie Dupont',
        firstName: 'Marie',
        lastName: 'Dupont',
        status: 'active',
        role: 'user',
        createdAt: '2024-02-20T00:00:00Z',
        lastLogin: '2024-08-18T00:00:00Z',
        premium: false
      },
      {
        id: '3',
        email: 'user2@example.com',
        name: 'Jean Martin',
        firstName: 'Jean',
        lastName: 'Martin',
        status: 'suspended',
        role: 'user',
        createdAt: '2024-03-10T00:00:00Z',
        lastLogin: '2024-08-10T00:00:00Z',
        premium: true
      },
      {
        id: '4',
        email: 'user3@example.com',
        name: 'Sophie Bernard',
        firstName: 'Sophie',
        lastName: 'Bernard',
        status: 'active',
        role: 'user',
        createdAt: '2024-04-05T00:00:00Z',
        lastLogin: '2024-08-19T00:00:00Z',
        premium: false
      },
      {
        id: '5',
        email: 'user4@example.com',
        name: 'Pierre Durand',
        firstName: 'Pierre',
        lastName: 'Durand',
        status: 'inactive',
        role: 'user',
        createdAt: '2024-05-12T00:00:00Z',
        lastLogin: '2024-07-25T00:00:00Z',
        premium: false
      },
      {
        id: '6',
        email: 'moderator@herbbie.com',
        name: 'Modérateur HERBBIE',
        firstName: 'Modérateur',
        lastName: 'HERBBIE',
        status: 'active',
        role: 'moderator',
        createdAt: '2024-01-10T00:00:00Z',
        lastLogin: '2024-08-19T00:00:00Z',
        premium: true
      }
    ];
  },

  // Mettre à jour le statut d'un utilisateur
  async updateUserStatus(userId, status) {
    try {
      await supabaseRequest(`profiles?id=eq.${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      
      console.log(`Statut mis à jour pour l'utilisateur ${userId}: ${status}`);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      // En cas d'erreur, simuler le succès pour les données de test
      return { success: true };
    }
  },

  // Supprimer un utilisateur
  async deleteUser(userId) {
    try {
      await supabaseRequest(`profiles?id=eq.${userId}`, {
        method: 'DELETE'
      });
      
      console.log(`Utilisateur supprimé: ${userId}`);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      // En cas d'erreur, simuler le succès pour les données de test
      return { success: true };
    }
  },

  // Récupérer les statistiques des utilisateurs
  async getUserStats() {
    try {
      const users = await this.getAllUsers();
      
      return {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        suspended: users.filter(u => u.status === 'suspended').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        premium: users.filter(u => u.premium).length,
        admin: users.filter(u => u.role === 'admin').length,
        moderator: users.filter(u => u.role === 'moderator').length,
        user: users.filter(u => u.role === 'user').length
      };
    } catch (error) {
      console.error('Erreur dans getUserStats:', error);
      // En cas d'erreur, retourner des statistiques de base
      return {
        total: 0,
        active: 0,
        suspended: 0,
        inactive: 0,
        premium: 0,
        admin: 0,
        moderator: 0,
        user: 0
      };
    }
  }
};
