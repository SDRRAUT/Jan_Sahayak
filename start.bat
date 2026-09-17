@echo off
title JanSahayak Platform (localhost:3737)
cd /d "%~dp0"

echo ==================================================
echo    JanSahayak Platform Startup (localhost:3737)
echo ==================================================
echo.

if not exist node_modules (
    echo [INFO] Installing dependencies...
    call npm install
)

echo [INFO] Launching backend and frontend...
node start.js
pause
