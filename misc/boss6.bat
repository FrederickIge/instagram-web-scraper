@echo off
setlocal EnableExtensions EnableDelayedExpansion
for /f "delims=" %%a in (acroList.txt) do (
set /a c+=1
echo %%a
call scrapjr.bat %%a
)
set x

pause