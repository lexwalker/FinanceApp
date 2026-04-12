@echo off
setlocal

cd /d "%~dp0"

set "APP_URL=http://localhost:3000"

where pnpm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] pnpm not found. Install pnpm and try again.
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  call pnpm install
  if errorlevel 1 (
    echo [ERROR] Failed to install dependencies.
    exit /b 1
  )
)

echo Starting Clean Finance MVP on %APP_URL% ...
start "Clean Finance Dev Server" cmd /k "cd /d ""%~dp0"" && pnpm dev --port 3000"

timeout /t 6 /nobreak >nul
start "" "%APP_URL%"

exit /b 0
