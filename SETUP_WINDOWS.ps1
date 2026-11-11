# Installs dependencies and starts the app. Run from anywhere: .\SETUP_WINDOWS.ps1
# $PSScriptRoot is the folder containing this script (the repository root).
Set-Location $PSScriptRoot
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Write-Error 'Node.js 20+ and npm are required.'; exit 1 }
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run dev
