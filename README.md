# 🎨 HERBBIE - Panneau Administrateur

## 📋 Vue d'ensemble

Panneau d'administration dédié pour HERBBIE, permettant de gérer les fonctionnalités et paramètres du système de génération de contenu créatif pour enfants.

## 🚀 Lancement Rapide

### Option 1 : Script automatique (Recommandé)
```bash
start.bat
```

### Option 2 : Lancement manuel
```bash
# Installation des dépendances
npm install

# Démarrage du serveur
npm run dev
```

## 🌐 Accès

**URL :** http://localhost:5174

## 🏗️ Architecture

```
panneau/
├── src/
│   ├── components/          # Composants React
│   │   ├── Header.jsx      # En-tête avec navigation
│   │   ├── Sidebar.jsx     # Barre latérale de navigation
│   │   ├── AdminPanel.jsx  # Panneau principal
│   │   └── FeatureManager.jsx # Gestion des fonctionnalités
│   ├── services/           # Services et API
│   │   └── features.js     # Gestion des fonctionnalités
│   ├── styles/             # Styles CSS
│   └── App.jsx             # Composant principal
├── styles/                 # Styles CSS globaux
├── package.json            # Dépendances
└── vite.config.js         # Configuration Vite
```

## 🎯 Fonctionnalités

### ✅ Implémentées

#### 1. **Gestion des fonctionnalités** ⚙️
- Activation/désactivation des services HERBBIE
- Statistiques en temps réel
- Interface intuitive avec toggles
- Notifications de confirmation
- Réinitialisation des paramètres

**Services gérés :**
- 🎬 **Dessin animé** : Génération de vidéos animées
- 📚 **Bande dessinée** : Création de BD avec bulles
- 🎨 **Coloriage** : Pages de coloriage à imprimer
- 📖 **Histoire** : Contes audio avec narration
- 🎵 **Comptine** : Chansons avec musique générée

### 🔄 À venir

#### 2. **Gestion des utilisateurs** 👥
- Liste des utilisateurs
- Gestion des rôles et permissions
- Statistiques d'utilisation

#### 3. **Gestion du contenu** 📚
- Modération du contenu généré
- Statistiques de génération
- Gestion des thèmes et styles

#### 4. **Analytics** 📊
- Tableaux de bord
- Métriques d'utilisation
- Rapports de performance

#### 5. **Paramètres** 🔧
- Configuration système
- Gestion des APIs
- Paramètres de sécurité

## 🎨 Design

### Couleurs HERBBIE
- **Primaire** : `#6B4EFF` (Violet)
- **Secondaire** : `#FF85A1` (Rose)
- **Accent** : `#FFD166` (Jaune)
- **Succès** : `#A0E7E5` (Turquoise)
- **Erreur** : `#FF6B6B` (Rouge)

### Caractéristiques
- **Design moderne** et professionnel
- **Interface responsive** (desktop, tablet, mobile)
- **Animations fluides** avec Framer Motion
- **Navigation intuitive** avec sidebar
- **Notifications en temps réel**

## 🔧 Technologies

- **React 18** : Interface utilisateur
- **Vite** : Build tool et serveur de développement
- **Framer Motion** : Animations
- **CSS Modules** : Styles modulaires
- **LocalStorage** : Persistance des données

## 📱 Responsive Design

### Desktop (1024px+)
- Sidebar toujours visible
- Layout en colonnes
- Navigation complète

### Tablet (768px - 1023px)
- Sidebar rétractable
- Layout adaptatif
- Navigation optimisée

### Mobile (< 768px)
- Sidebar en overlay
- Layout en colonne unique
- Navigation simplifiée

## 🚀 Déploiement

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

## 🔐 Authentification et Sécurité

Le panneau administrateur est protégé par un système d'authentification basé sur Supabase qui garantit que seuls les administrateurs peuvent accéder aux fonctionnalités.

### 🔒 Fonctionnalités de sécurité

- **Connexion obligatoire** : Accès impossible sans authentification
- **Vérification du rôle admin** : Seuls les utilisateurs avec le rôle `admin` ou `super_admin` peuvent se connecter
- **Session persistante** : L'utilisateur reste connecté entre les sessions
- **Déconnexion sécurisée** : Nettoyage complet de la session

### 👤 Gestion des comptes administrateurs

Pour ajouter un nouvel administrateur :

1. **Créer un compte utilisateur** dans HERBBIE principal
2. **Modifier le rôle** dans la base de données Supabase :
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE id = 'user_id';
   ```
3. **L'utilisateur peut maintenant se connecter** au panneau administrateur

### 🔑 Connexion

- **URL d'accès** : `http://localhost:5174` (en développement)
- **Identifiants** : Email et mot de passe du compte HERBBIE
- **Vérification** : Le système vérifie automatiquement le rôle administrateur

## 🔗 Intégration avec HERBBIE

Le panneau administrateur utilise le même système de gestion des fonctionnalités que HERBBIE principal :

- **LocalStorage partagé** : `herbbieFeatures`
- **Événements synchronisés** : `featuresUpdated`
- **API cohérente** : Mêmes fonctions de gestion

## 📊 Statistiques

Le panneau affiche en temps réel :
- Nombre de fonctionnalités activées
- Taux d'activation global
- Statut de chaque service

## 🔐 Sécurité

- **Interface d'administration** séparée
- **Validation des données** côté client
- **Notifications de confirmation** pour les actions critiques
- **Persistance sécurisée** dans le navigateur

## 🎯 Roadmap

### Phase 1 ✅ (Terminée)
- [x] Structure de base
- [x] Gestion des fonctionnalités
- [x] Interface responsive
- [x] Design cohérent avec HERBBIE

### Phase 2 🔄 (En cours)
- [ ] Gestion des utilisateurs
- [ ] Analytics de base
- [ ] Notifications avancées

### Phase 3 📋 (Planifiée)
- [ ] Gestion du contenu
- [ ] Paramètres système
- [ ] Rapports détaillés

## 🤝 Contribution

Le panneau administrateur est conçu pour être extensible. Chaque nouvelle fonctionnalité peut être ajoutée comme un nouveau composant dans `src/components/`.

---

**HERBBIE Panneau Administrateur** - Interface moderne pour la gestion de HERBBIE 🎨✨ 