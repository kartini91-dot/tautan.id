# Deployment Setup Script
Write-Host "========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT AUTO SETUP" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$sshFolder = "$env:USERPROFILE\.ssh"
$keyPath = "$sshFolder\tautan_deploy_key"
$pubKeyPath = "$sshFolder\tautan_deploy_key.pub"

if (-not (Test-Path $sshFolder)) {
    New-Item -ItemType Directory -Path $sshFolder -Force | Out-Null
    Write-Host "✓ .ssh folder created"
} else {
    Write-Host "✓ .ssh folder exists"
}

if (Test-Path $keyPath) {
    Write-Host "✓ SSH key already exists"
    Write-Host ""
    Write-Host "KEY LOCATION: $keyPath"
} else {
    Write-Host "⚠ SSH key not found at: $keyPath"
    Write-Host ""
    Write-Host "TO GENERATE KEY, RUN THIS:"
    Write-Host "  ssh-keygen -t ed25519 -C 'deploy@tautan' -f '$keyPath' -N ''" -ForegroundColor Yellow
}

Write-Host ""
if (Test-Path $pubKeyPath) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "PUBLIC KEY (Copy to server)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Get-Content $pubKeyPath
    Write-Host "========================================" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Ensure SSH key exists (generate if needed, see above)"
Write-Host "2. Setup server with public key in ~/.ssh/authorized_keys"
Write-Host "3. Add GitHub secrets: SSH_PRIVATE_KEY, SSH_HOST, SSH_USER, TARGET_PATH"
Write-Host "4. Push to main branch: git push origin main"
Write-Host "5. Watch: GitHub repo > Actions tab"
Write-Host ""
Write-Host "DETAILS: See START_HERE_DEPLOYMENT.md"
Write-Host "========================================" -ForegroundColor Green
