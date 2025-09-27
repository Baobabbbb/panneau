// Service d'authentification pour le panneau administrateur HERBBIE
// Utilise Supabase pour l'authentification et vérifie le rôle admin

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xfbmdeuzuyixpmouhqcv.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYm1kZXV6dXlpeHBtb3VocWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzE3ODQsImV4cCI6MjA2NDkwNzc4NH0.XzFIT3BwW9dKRrmFFbSAufCpC1SZuUI-VU2Uer5VoTw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const authService = {
  // Initialisation de l'écouteur d'état d'authentification
  initAuthListener(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (callback) {
        if (session?.user) {
          // Vérifier si l'utilisateur est admin
          const isAdmin = await this.checkUserIsAdmin(session.user.id);
          callback({ user: session.user, isAdmin, session });
        } else {
          callback(null);
        }
      }
    });
    return subscription;
  },

  // Connexion avec email et mot de passe
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Vérifier si l'utilisateur est admin
        const isAdmin = await this.checkUserIsAdmin(data.user.id);
        if (!isAdmin) {
          // Déconnecter l'utilisateur s'il n'est pas admin
          await this.signOut();
          throw new Error('Accès refusé. Seuls les administrateurs peuvent accéder à ce panneau.');
        }

        return { user: data.user, session: data.session, isAdmin };
      }

      return null;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },

  // Déconnexion
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  },

  // Obtenir l'utilisateur actuel
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }

      if (user) {
        const isAdmin = await this.checkUserIsAdmin(user.id);
        return { user, isAdmin };
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  // Vérifier si l'utilisateur est administrateur
  async checkUserIsAdmin(userId) {
    try {
      // Utiliser fetch directement pour éviter les problèmes d'import
      const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=role`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('Impossible de vérifier le rôle admin:', response.status);
        return false;
      }

      const profiles = await response.json();

      if (profiles && profiles.length > 0) {
        const userRole = profiles[0].role;
        return userRole === 'admin' || userRole === 'super_admin';
      }

      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error);
      return false;
    }
  },

  // Obtenir la session actuelle
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      return session;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return null;
    }
  }
};

export default authService;
