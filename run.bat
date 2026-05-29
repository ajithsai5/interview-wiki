@echo off
REM Build the wiki data from your .md notes and open the viewer.
REM Double-click this file, or run it from a terminal.

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

"%PY%" build.py --open
endlocal
