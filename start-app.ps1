# Script para iniciar la aplicación completa de Dulces Caseros
# Backend (NestJS) + Frontend (NextJS)

Write-Host "Iniciando aplicacion Dulces Caseros..." -ForegroundColor Green
Write-Host ""

# Verificar que PostgreSQL esté ejecutándose
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
try {
    $pgProcess = Get-Process -Name "postgres" -ErrorAction SilentlyContinue
    if ($pgProcess) {
        Write-Host "PostgreSQL esta ejecutandose" -ForegroundColor Green
    } else {
        Write-Host "PostgreSQL no esta ejecutandose. Asegurate de que este iniciado." -ForegroundColor Yellow
    }
} catch {
    Write-Host "No se pudo verificar PostgreSQL" -ForegroundColor Yellow
}

Write-Host ""

# Verificar que las dependencias estén instaladas
Write-Host "Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Dependencias del backend no encontradas. Ejecutando npm install..." -ForegroundColor Red
    Set-Location backend
    npm install
    Set-Location ..
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Dependencias del frontend no encontradas. Ejecutando npm install..." -ForegroundColor Red
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "Dependencias verificadas" -ForegroundColor Green
Write-Host ""

# Iniciar la aplicación completa
Write-Host "Iniciando backend y frontend simultaneamente..." -ForegroundColor Cyan
Write-Host ""

Write-Host "URLs de la aplicacion:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "   Backend API: http://localhost:3001" -ForegroundColor Blue
Write-Host "   Swagger Docs: http://localhost:3001/api" -ForegroundColor Magenta
Write-Host ""

Write-Host "Iniciando servicios..." -ForegroundColor Yellow
Write-Host "   Presiona Ctrl+C para detener ambos servicios" -ForegroundColor Gray
Write-Host ""

# Ejecutar ambos servicios
npm run dev
