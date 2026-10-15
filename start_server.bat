@echo off
title Village Hub - Faculty Demonstration Server
cd /d "%~dp0"
cls
echo ======================================================================
echo           VILLAGE HUB - TWO-LAPTOP FACULTY DEMO SERVER
echo ======================================================================
echo.

:: Get primary Wi-Fi / LAN IPv4
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set "MY_IP=%%b"
        goto :found_ip
    )
)
:found_ip

echo  [MY LAPTOP] Local URL : http://localhost:5000
if defined MY_IP (
    echo  [FRIEND]   Wi-Fi URL : http://%MY_IP%:5000
    echo.
    echo  ------------------------------------------------------------------
    echo   Share this exact URL with your friend on the same Wi-Fi:
    echo   http://%MY_IP%:5000
    echo  ------------------------------------------------------------------
) else (
    echo  [FRIEND]   Wi-Fi URL : http://^<YOUR_WIFI_IP^>:5000
)
echo.
echo  Starting Node.js Backend Server on port 5000...
echo  (Keep this terminal open/minimized during demonstration)
echo ======================================================================
echo.

:: Open browser on My Laptop after 2 seconds
start "" /b cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5000"

:: Start Express Backend Server
"C:\Program Files\nodejs\node.exe" server/server.js
pause
