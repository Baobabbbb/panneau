@echo off
echo ========================================
echo    🎨 HERBBIE - Panneau Administrateur
echo ========================================
echo.
echo Lancement du panneau administrateur...
echo URL: http://localhost:5174
echo.

REM Vérifier que Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

echo 📦 Installation des dépendances...
call npm install

echo.
echo 🚀 Démarrage du serveur de développement...
echo.
echo 🌐 Accès au panneau : http://localhost:5174
echo.
echo ========================================
echo   Appuyez sur Ctrl+C pour arrêter
echo ========================================
echo.

npm run dev 