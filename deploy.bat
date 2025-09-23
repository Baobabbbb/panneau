@echo off
echo 🚀 Deploiement sur Vercel...
echo.

REM Vérifier si Vercel CLI est installé
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI n'est pas installé. Installation en cours...
    npm install -g vercel
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation de Vercel CLI
        pause
        exit /b 1
    )
)

echo ✅ Vercel CLI est installé
echo.

REM Build du projet
echo 📦 Construction du projet...
npm run build
if errorlevel 1 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo ✅ Build terminé
echo.

REM Déploiement
echo 🌐 Deploiement en cours...
vercel --prod

if errorlevel 1 (
    echo ❌ Erreur lors du déploiement
    pause
    exit /b 1
)

echo.
echo ✅ Deploiement terminé avec succès !
echo.
pause



