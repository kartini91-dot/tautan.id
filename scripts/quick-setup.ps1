Write-Host "Deployment Setup Check" -ForegroundColor Green
Write-Host ""

$sshFolder = "$env:USERPROFILE\.ssh"
$keyPath = "$sshFolder\tautan_deploy_key"
$pubKeyPath = "$sshFolder\tautan_deploy_key.pub"

Write-Host "SSH Key Status:"
if (Test-Path $keyPath) {
    Write-Host "  [OK] Private key exists: $keyPath"
    Write-Host "  [OK] Public key exists: $pubKeyPath"
} else {
    Write-Host "  [MISSING] No SSH key found"
}

Write-Host ""
Write-Host "To generate SSH key, use Git Bash:"
Write-Host "  ssh-keygen -t ed25519 -C deploy@tautan -f ~/.ssh/tautan_deploy_key -N ''"
Write-Host ""
