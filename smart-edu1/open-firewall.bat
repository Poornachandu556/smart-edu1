@echo off
echo Opening Windows Firewall for Next.js development server...
echo This requires administrator privileges.
echo.
netsh advfirewall firewall add rule name="Next.js Dev Server" dir=in action=allow protocol=TCP localport=3001
echo.
echo Firewall rule added successfully!
echo Your website is now accessible at: http://10.181.149.16:3001
echo.
echo Press any key to continue...
pause > nul
