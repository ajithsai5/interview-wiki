@echo off
REM One-click publish: rebuild from your .md notes and upload to your server.
REM Needs deploy-config.json (copy from deploy-config.sample.json first).

setlocal
cd /d "%~dp0"

set "PY="
if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" set "PY=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
if not defined PY ( where py >nul 2>nul && set "PY=py" )
if not defined PY (
  for /f "delims=" %%p in ('where python 2^>nul') do (
    echo %%p | find /i "WindowsApps" >nul || if not defined PY set "PY=%%p"
  )
)
if not defined PY ( echo Could not find Python. & pause & exit /b 1 )

"%PY%" deploy.py %*
echo.
pause
endlocal
