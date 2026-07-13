@echo off
chcp 65001 > nul
cd /d "C:\Users\sithi\Desktop\sithija-portfolio\portfolio"

echo Ensuring we are on main branch...
:: Stash local changes if you were working on something else, then switch to main
git stash > nul 2>&1
git checkout main
git stash pop > nul 2>&1

echo Pulling latest updates from GitHub...
:: GitHub එකේ තියෙන අලුත්ම ටික කලින්ම ඇදලා ගන්නවා
git pull origin main

echo Staging changes...
git add .

for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set "TIMESTAMP=%%i"

echo Committing local updates...
git commit --allow-empty -m "Auto update at startup: %TIMESTAMP%"

echo Pushing to GitHub...
:: --force නැතුව normal push එකක් දාන එක තමයි safe ම දේ
git push origin main

echo Done! Everything is up to date.
pause