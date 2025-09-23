# 🚀 Guide de déploiement Vercel + Supabase

## Prérequis

- Compte Vercel (gratuit) : [vercel.com](https://vercel.com)
- Compte Supabase (gratuit) : [supabase.com](https://supabase.com)
- Node.js installé sur votre machine

## 📋 Étapes de déploiement

### 1. Installation de Vercel CLI

```bash
npm install -g vercel
```

### 2. Connexion à Vercel

```bash
vercel login
```

### 3. Déploiement automatique

Utilisez le script fourni :
```bash
deploy.bat
```

Ou manuellement :
```bash
npm run build
vercel --prod
```

## 🔧 Configuration des variables d'environnement

### Sur Vercel Dashboard :

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez les variables suivantes :

| Variable | Valeur |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://xfbmdeuzuyixpmouhqcv.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYm1kZXV6dXlpeHBtb3VocWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzE3ODQsImV4cCI6MjA2NDkwNzc4NH0.XzFIT3BwW9dKRrmFFbSAufCpC1SZuUI-VU2Uer5VoTw` |

### Configuration Supabase (optionnel) :

1. Allez dans votre dashboard Supabase
2. **Settings** > **Auth** > **URL Configuration**
3. Ajoutez votre domaine Vercel dans les URLs autorisées :
   - `https://votre-projet.vercel.app`
   - `https://votre-projet.vercel.app/auth/callback`

## 🔄 Redéploiement

Après avoir configuré les variables d'environnement :

```bash
vercel --prod
```

## 📁 Structure des fichiers

```
panneau/
├── vercel.json          # Configuration Vercel
├── env.example          # Variables d'environnement d'exemple
├── deploy.bat           # Script de déploiement automatique
├── vite.config.js       # Configuration Vite (mise à jour)
└── src/
    └── services/
        └── userService.js # Service Supabase (mise à jour)
```

## 🛠️ Dépannage

### Erreur de build
- Vérifiez que toutes les dépendances sont installées : `npm install`
- Vérifiez la syntaxe du code : `npm run lint`

### Erreur de connexion Supabase
- Vérifiez que les variables d'environnement sont correctement configurées
- Vérifiez que votre clé Supabase est valide
- Vérifiez les règles RLS dans Supabase

### Erreur de déploiement
- Vérifiez que vous êtes connecté à Vercel : `vercel login`
- Vérifiez que le projet est bien initialisé : `vercel`

## 🌐 URLs utiles

- **Vercel Dashboard** : [vercel.com/dashboard](https://vercel.com/dashboard)
- **Supabase Dashboard** : [supabase.com/dashboard](https://supabase.com/dashboard)
- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Documentation Supabase** : [supabase.com/docs](https://supabase.com/docs)



