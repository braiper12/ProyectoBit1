@echo off
setlocal

REM Verificar si Python está instalado
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python no está instalado en este sistema.
    echo Se necesita Python para ejecutar el servidor local.
    echo Abriendo la página oficial de descarga...
    start https://www.python.org/downloads/windows/
    pause
    exit /b
)

REM  levantar el servidor, si python esta instalado
echo Iniciando servidor local en http://localhost:8000 ...
python -m http.server 8000
pause


