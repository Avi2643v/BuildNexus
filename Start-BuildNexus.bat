@echo off
title BuildNexus - AI Construction Platform
color 0b

echo ===================================================================
echo                     BUILDNEXUS PLATFORM
echo          "AI-Orchestrated Construction Operating System"
echo ===================================================================
echo.

cd /d "%~dp0"

:: Ensure Node is in PATH
set "PATH=%LOCALAPPDATA%\Programs\nodejs;C:\Program Files\nodejs;%PATH%"

:: Check if port 3000 is already active
netstat -ano | findstr :3000 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] BuildNexus server is already active on http://localhost:3000!
    echo Launching web browser now...
    start http://localhost:3000
    echo.
    echo ===================================================================
    echo BuildNexus is open in your browser: http://localhost:3000
    echo ===================================================================
    echo.
    powershell -NoProfile -Command "Start-Sleep -Seconds 3" >nul 2>&1
    exit /b 0
)

echo [1/2] Launching web browser for http://localhost:3000...
start "" cmd /c "powershell -NoProfile -Command ""Start-Sleep -Seconds 4"" & start http://localhost:3000"

echo [2/2] Starting Next.js Dev Server...
echo.
echo ===================================================================
echo BuildNexus is active and running at: http://localhost:3000
echo KEEP THIS WINDOW OPEN while using BuildNexus.
echo ===================================================================
echo.

call npm.cmd run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [RETRY] Starting with npx.cmd next dev...
    call npx.cmd next dev
)

pause
