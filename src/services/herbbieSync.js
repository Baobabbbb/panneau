// Service pour synchroniser les fonctionnalités avec Herbbie
const HERBBIE_STORAGE_KEY = 'herbbie_features_config';

// Fonction pour synchroniser les fonctionnalités avec Herbbie
export const syncFeaturesWithHerbbie = (features) => {
  try {
    // Sauvegarder dans le localStorage pour que Herbbie puisse les récupérer
    localStorage.setItem(HERBBIE_STORAGE_KEY, JSON.stringify(features));
    
    // Déclencher plusieurs événements pour s'assurer que Herbbie reçoit la mise à jour
    window.dispatchEvent(new CustomEvent('herbbieFeaturesUpdate', { 
      detail: features 
    }));
    
    // Événement alternatif pour compatibilité
    window.dispatchEvent(new CustomEvent('featuresUpdated', { 
      detail: features 
    }));
    
    // Événement de stockage pour déclencher les écouteurs storage
    window.dispatchEvent(new StorageEvent('storage', {
      key: HERBBIE_STORAGE_KEY,
      newValue: JSON.stringify(features),
      oldValue: localStorage.getItem(HERBBIE_STORAGE_KEY),
      storageArea: localStorage
    }));
    
    console.log('🔄 Fonctionnalités synchronisées avec Herbbie:', features);
    return true;
  } catch (error) {
    console.error('Erreur lors de la synchronisation avec Herbbie:', error);
    return false;
  }
};

// Fonction pour récupérer les fonctionnalités depuis Herbbie
export const getFeaturesFromHerbbie = () => {
  try {
    const stored = localStorage.getItem(HERBBIE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des fonctionnalités depuis Herbbie:', error);
  }
  return null;
};

// Fonction pour écouter les changements de fonctionnalités
export const listenForFeatureChanges = (callback) => {
  const handleFeatureUpdate = (event) => {
    if (callback && typeof callback === 'function') {
      callback(event.detail);
    }
  };
  
  window.addEventListener('herbbieFeaturesUpdate', handleFeatureUpdate);
  
  // Retourner une fonction pour nettoyer l'écouteur
  return () => {
    window.removeEventListener('herbbieFeaturesUpdate', handleFeatureUpdate);
  };
};

// Fonction pour forcer la synchronisation avec Herbbie
export const forceSyncWithHerbbie = async (features) => {
  try {
    // Sauvegarder dans le localStorage
    localStorage.setItem(HERBBIE_STORAGE_KEY, JSON.stringify(features));
    
    // Déclencher plusieurs événements pour s'assurer que Herbbie reçoit la mise à jour
    window.dispatchEvent(new CustomEvent('herbbieFeaturesUpdate', { 
      detail: features 
    }));
    
    // Événement alternatif pour compatibilité
    window.dispatchEvent(new CustomEvent('featuresUpdated', { 
      detail: features 
    }));
    
    console.log('🔄 Synchronisation forcée avec Herbbie:', features);
    return true;
  } catch (error) {
    console.error('Erreur lors de la synchronisation forcée:', error);
    return false;
  }
};

export default {
  syncFeaturesWithHerbbie,
  getFeaturesFromHerbbie,
  listenForFeatureChanges,
  forceSyncWithHerbbie
};
