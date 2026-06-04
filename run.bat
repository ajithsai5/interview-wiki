@echo off
REM ============================================================
REM  Interview Prep Wiki - one click does everything:
REM    1) rebuilds the wiki from your .md notes
REM    2) opens it on this laptop
REM    3) serves it to your phone (same Wi-Fi)
REM  A phone URL like  http://192.168.x.x:8765/  is printed below.
REM  Keep this window open while you use it. Close it (or press Ctrl+C) to stop.
REM ============================================================

setlocal
cd /d "%~dp0"

REM --- find a real Python (skip the Microsoft Store stub) ---
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

"%PY%" build.py --serve --open
endlocal
