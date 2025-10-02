@echo off
echo ========================================
echo    API REST para Flutter - Instalacion
echo ========================================
echo.

echo Instalando dependencias...
call npm install

echo.
echo ========================================
echo    Iniciando servidor de desarrollo
echo ========================================
echo.
echo Servidor: http://localhost:3000
echo Documentacion: http://localhost:3000/api-docs
echo Health Check: http://localhost:3000/health
echo.

call npm run dev

