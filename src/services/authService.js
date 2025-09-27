// Service d'authentification pour le panneau administrateur HERBBIE
// Utilise la même logique que l'application principale

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xfbmdeuzuyixpmouhqcv.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYm1kZXV6dXlpeHBtb3VocWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzE3ODQsImV4cCI6MjA2NDkwNzc4NH0.XzFIT3BwW9dKRrmFFbSAufCpC1SZuUI-VU2Uer5VoTw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Email de l'admin principal (comme dans Herbbie)
const ADMIN_EMAIL = 'fredagathe77@gmail.com';

export const authService = {
  // Initialisation de l'écouteur d'état d'authentification
  initAuthListener(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (callback) {
        if (session?.user) {
          // Vérifier si l'utilisateur est admin (même logique que Herbbie)
          const isAdmin = await this.checkUserIsAdmin(session.user);
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
        // Vérifier si l'utilisateur est admin (même logique que Herbbie)
        const isAdmin = await this.checkUserIsAdmin(data.user);
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
        const isAdmin = await this.checkUserIsAdmin(user);
        return { user, isAdmin };
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  // Vérifier si l'utilisateur est administrateur (même logique que Herbbie)
  async checkUserIsAdmin(user) {
    try {
      // 1. Vérifier si c'est l'admin principal (hardcodé comme dans Herbbie)
      if (user.email === ADMIN_EMAIL) {
        console.log('👑 Admin principal détecté:', user.email);
        return true;
      }

      // 2. Vérifier dans la table profiles pour les autres admins
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Impossible de vérifier le rôle admin:', error);
        return false;
      }

      if (profile) {
        const isAdminRole = profile.role === 'admin' || profile.role === 'super_admin';
        console.log(`👤 Utilisateur ${user.email} - Rôle: ${profile.role} - Admin: ${isAdminRole}`);
        return isAdminRole;
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
