Set-Location -Path $PSScriptRoot

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   JanSahayak Platform Startup (localhost:3737)   " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "[INFO] Launching backend and frontend..." -ForegroundColor Green
node start.js
