@echo off
setlocal
echo ========================================================
echo   Kata • 習慣 — Habit Command Center & Forge
echo ========================================================
echo Starting local dev server and launching web browser...

set PATH=%~dp0.tools\node-v20.18.0-win-x64;%PATH%
npm run dev -- --open
pause
