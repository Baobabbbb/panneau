// Service pour gérer l'état des fonctionnalités du site via API
const API_BASE_URL = 'http://192.168.1.19:3000/api';

// Configuration par défaut des fonctionnalités
const DEFAULT_FEATURES = {
  animation: { enabled: true, name: 'Dessin animé', icon: '🎬' },
  comic: { enabled: true, name: 'Bande dessinée', icon: '💬' },
  coloring: { enabled: true, name: 'Coloriage', icon: '🎨' },
  audio: { enabled: true, name: 'Histoire', icon: '📖' },
  rhyme: { enabled: true, name: 'Comptine', icon: '🎵' }
};

// Fonction pour récupérer les fonctionnalités depuis l'API
export const getFeatures = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/features`);
    if (response.ok) {
      const features = await response.json();
      return features;
    } else {
      return DEFAULT_FEATURES;
    }
  } catch (error) {
    return DEFAULT_FEATURES;
  }
};

// Fonction pour mettre à jour une fonctionnalité via l'API
export const updateFeature = async (featureKey, enabled) => {
  try {
    const response = await fetch(`${API_BASE_URL}/features/${featureKey}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled })
    });

    if (response.ok) {
      const result = await response.json();
      
      // Déclencher un événement personnalisé pour notifier les composants
      window.dispatchEvent(new CustomEvent('featuresUpdated', { 
        detail: result.features 
      }));
      
      return result.features;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// Fonction pour vérifier si une fonctionnalité est activée
export const isFeatureEnabled = async (featureKey) => {
  try {
    const features = await getFeatures();
    return features[featureKey]?.enabled || false;
  } catch (error) {
    return false;
  }
};

// Fonction pour récupérer les fonctionnalités activées
export const getEnabledFeatures = async () => {
  try {
    const features = await getFeatures();
    return Object.entries(features)
      .filter(([key, feature]) => feature.enabled)
      .reduce((enabled, [key, feature]) => {
        enabled[key] = feature;
        return enabled;
      }, {});
  } catch (error) {
    return {};
  }
};

// Fonction pour réinitialiser les fonctionnalités
export const resetFeatures = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/features/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      
      // Déclencher un événement personnalisé pour notifier les composants
      window.dispatchEvent(new CustomEvent('featuresUpdated', { 
        detail: result.features 
      }));
      
      return result.features;
    } else {
      return DEFAULT_FEATURES;
    }
  } catch (error) {
    return DEFAULT_FEATURES;
  }
};

// Fonction pour récupérer toutes les fonctionnalités
export const getAllFeatures = () => {
  return { ...DEFAULT_FEATURES };
};

// Fonction utilitaire pour vérifier si toutes les fonctionnalités requises sont activées
export const areRequiredFeaturesEnabled = async (requiredFeatures = []) => {
  try {
    const enabledFeatures = await getEnabledFeatures();
    return requiredFeatures.every(feature => enabledFeatures[feature]);
  } catch (error) {
    return false;
  }
};

// Export par défaut pour compatibilité
export default {
  getFeatures,
  updateFeature,
  isFeatureEnabled,
  getEnabledFeatures,
  resetFeatures,
  getAllFeatures,
  areRequiredFeaturesEnabled
}; 