@echo off
setlocal EnableExtensions EnableDelayedExpansion
for /f "delims=" %%a in (list5.txt) do (
set /a c+=1
echo %%a
call mr_scrape_bot.bat %%a
)
set x

pause