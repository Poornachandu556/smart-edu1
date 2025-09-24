@echo off
echo Enabling network access for your website...
echo.
echo This will open Windows Firewall for port 3001
echo You need to run this as Administrator
echo.
echo Adding firewall rule...
netsh advfirewall firewall add rule name="Next.js 3001" dir=in action=allow protocol=TCP localport=3001
echo.
if %errorlevel% equ 0 (
    echo SUCCESS! Firewall rule added.
    echo.
    echo Your website is now accessible at:
    echo http://10.181.149.16:3001
    echo.
    echo Test it from another device on your network!
) else (
    echo FAILED! You need to run this as Administrator.
    echo Right-click this file and select "Run as administrator"
)
echo.
pause
