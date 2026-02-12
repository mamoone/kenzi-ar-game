@echo off
title AR Game Server - Auto Start
setlocal enabledelayedexpansion

echo =====================================
echo      Demarrage du jeu AR
echo =====================================

:: -------------------------------
:: Trouver un port libre (8080+)
:: -------------------------------
set PORT=8080

:CHECK_PORT
netstat -ano | findstr ":%PORT%" >nul
if %errorlevel%==0 (
    set /a PORT+=1
    goto CHECK_PORT
)

echo Port libre trouve: %PORT%

:: -------------------------------
:: Trouver IP locale (wifi/lan)
:: -------------------------------
set IP=localhost
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    set IP=!IP: =!
    goto IP_FOUND
)

:IP_FOUND

:: -------------------------------
:: Afficher liens acces
:: -------------------------------
echo.
echo =====================================
echo Ouvre sur ce PC:
echo http://localhost:%PORT%
echo.
echo Sur telephone (meme wifi):
echo http://%IP%:%PORT%
echo =====================================
echo.

:: -------------------------------
:: Ouvrir navigateur auto
:: -------------------------------
start http://localhost:%PORT%

:: -------------------------------
:: Lancer serveur portable Caddy
:: -------------------------------
"%~dp0caddy.exe" file-server --listen :%PORT% --root "%~dp0"

pause
