@echo off
setlocal EnableExtensions EnableDelayedExpansion
for /f "delims=" %%a in (master.txt) do (
set /a c+=1
echo %%a
call import_bot.bat %%a
)
set x

pause