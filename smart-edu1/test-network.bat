@echo off
echo Testing network access to your website...
echo.
echo Your IP address: 10.181.149.16
echo Port: 3001
echo.
echo Testing local access...
curl -s -o nul -w "Local access: %%{http_code}\n" http://10.181.149.16:3001
echo.
echo Testing localhost access...
curl -s -o nul -w "Localhost access: %%{http_code}\n" http://localhost:3001
echo.
echo If both show 200, your server is working!
echo.
echo To allow network access, run this as Administrator:
echo netsh advfirewall firewall add rule name="Next.js 3001" dir=in action=allow protocol=TCP localport=3001
echo.
echo Then test from another device: http://10.181.149.16:3001
echo.
pause
