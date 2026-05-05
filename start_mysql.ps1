$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$dataDir = Join-Path $repoRoot "backend\mysql-data"
$mysqlExe = "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysqld.exe"
$outLog = Join-Path $repoRoot "backend\mysql-server.out.log"
$errLog = Join-Path $repoRoot "backend\mysql-server.err.log"

if (-not (Test-Path $mysqlExe)) {
  throw "MySQL Server 8.1 was not found at $mysqlExe"
}

if (-not (Test-Path $dataDir)) {
  New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
  & $mysqlExe --initialize-insecure --basedir="C:\Program Files\MySQL\MySQL Server 8.1" --datadir="$dataDir" --console
}

$isRunning = (Test-NetConnection 127.0.0.1 -Port 3306 -InformationLevel Quiet)
if ($isRunning) {
  Write-Host "MySQL is already listening on 127.0.0.1:3306"
  exit 0
}

Start-Process `
  -FilePath $mysqlExe `
  -ArgumentList @(
    '--basedir="C:\Program Files\MySQL\MySQL Server 8.1"',
    "--datadir=`"$dataDir`"",
    "--port=3306",
    "--bind-address=127.0.0.1",
    "--console"
  ) `
  -WindowStyle Hidden `
  -RedirectStandardOutput $outLog `
  -RedirectStandardError $errLog

Start-Sleep -Seconds 5
if (-not (Test-NetConnection 127.0.0.1 -Port 3306 -InformationLevel Quiet)) {
  throw "MySQL did not start. Check $errLog"
}

Write-Host "MySQL started on 127.0.0.1:3306"
