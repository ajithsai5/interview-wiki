@echo off
REM Build the wiki, then serve it over your local Wi-Fi so you can open it
REM on your phone. A URL like http://192.168.x.x:8765/ will be printed —
REM type that into your phone's browser (same Wi-Fi). Press Ctrl+C to stop.

setlocal
cd /d "%~dp0"

REM --- find a real Python (avoid the Microsoft Store stub) ---
set "PY="
if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" set "PY=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
if not defined PY (
  where py >nul 2>nul && set "PY=py"
)
if not defined PY (
  for /f "delims=" %%p in ('where python 2^>nul') do (
    echo %%p | find /i "WindowsApps" >nul || if not defined PY set "PY=%%p"
  )
)
if not defined PY (
  echo Could not find Python. Install it from https://www.python.org/downloads/ and retry.
  pause
  exit /b 1
)

"%PY%" build.py --serve
endlocal
