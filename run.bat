@echo off
setlocal
echo ========================================================
echo   Kata • 習慣 — Anime Habit Command Center
echo ========================================================
echo Starting local Vite dev server on http://localhost:5173 ...

set PATH=%~dp0.tools\node-v20.18.0-win-x64;%PATH%
npm run dev
pause
