@echo off
setlocal
echo Creating Desktop shortcut for Kata...
powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([IO.Path]::Combine($ws.SpecialFolders('Desktop'), 'Kata.lnk')); $s.TargetPath = [IO.Path]::Combine('%~dp0', 'run.bat'); $s.WorkingDirectory = '%~dp0'; $s.IconLocation = [IO.Path]::Combine('%~dp0', 'kata.ico') + ',0'; $s.Description = 'Kata - Habit Command Center and Forge'; $s.Save(); Write-Host 'Desktop shortcut created with kata.ico!'"
pause
