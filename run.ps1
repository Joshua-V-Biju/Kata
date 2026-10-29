Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Kata • 習慣 — Anime Habit Command Center" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting Kata local dev server on http://localhost:5173 ..." -ForegroundColor Yellow

$toolNode = Join-Path $PSScriptRoot ".tools\node-v20.18.0-win-x64"
if (Test-Path $toolNode) {
    $env:PATH = "$toolNode;$env:PATH"
}

npm run dev
