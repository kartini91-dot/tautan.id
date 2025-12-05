# Automatic Deployment to Laravel Server

Dokumentasi lengkap untuk automatic deployment frontend ke Laravel server menggunakan GitHub Actions dan SSH/rsync.

## Quick Links

- **🚀 START HERE:** [`DEPLOYMENT_QUICKSTART.md`](./DEPLOYMENT_QUICKSTART.md) — Step-by-step commands untuk langsung deploy
- **📋 DETAILED SETUP:** [`GITHUB_SECRETS_SETUP.md`](./GITHUB_SECRETS_SETUP.md) — Panduan lengkap dengan troubleshooting
- **⚙️ WORKFLOW FILE:** [`.github/workflows/deploy_to_laravel.yml`](./.github/workflows/deploy_to_laravel.yml) — GitHub Actions workflow config

## Overview

GitHub Actions workflow `deploy_to_laravel.yml` otomatis:
1. ✓ Checkout code dari repository
2. ✓ Install Node.js dan dependencies
3. ✓ Build frontend (`npm run build`)
4. ✓ Archive hasil build dan upload ke GitHub
5. ✓ SSH ke server Laravel
6. ✓ Rsync files ke `TARGET_PATH` (contoh: `/var/www/laravel/public/tautan`)
7. ✓ Verify index.html ada dan permissions benar
8. ✓ Restart PHP-FPM/nginx (optional)

**Trigger:** Setiap push ke `main` branch

## What You Need

### 1. GitHub Repository (sudah punya)
- Akses ke Settings → Secrets and variables → Actions

### 2. SSH Access ke Server
- User dengan SSH key login (contoh: `deploy`)
- Write permission ke target folder (contoh: `/var/www/laravel/public/tautan`)

### 3. Server Tools (biasanya sudah ada)
- `rsync` — untuk copy files
- `tar` — untuk extract archive
- `ssh` — untuk remote command execution

### 4. SSL Certificate (recommended)
- HTTPS support untuk domain Anda
- Self-signed juga boleh untuk testing

## Quick Start (5 minutes)

Lihat **[`DEPLOYMENT_QUICKSTART.md`](./DEPLOYMENT_QUICKSTART.md)** untuk command-by-command guide.

Ringkas:
```powershell
# 1. Generate SSH key (lokal)
ssh-keygen -t ed25519 -C "deploy@tautan" -f "$env:USERPROFILE\.ssh\tautan_deploy_key" -N ""

# 2. Add public key ke server ~/.ssh/authorized_keys

# 3. Add GitHub secrets (SSH_PRIVATE_KEY, SSH_HOST, SSH_USER, TARGET_PATH)

# 4. Push ke main branch
git push origin main

# 5. GitHub Actions otomatis deploy!
```

## Detailed Setup

Lihat **[`GITHUB_SECRETS_SETUP.md`](./GITHUB_SECRETS_SETUP.md)** untuk:
- Langkah-langkah detail setiap step
- Troubleshooting common errors
- Fix 404 Page Not Found issues
- Nginx/Apache configuration examples
- Post-deployment verification

## GitHub Secrets Required

| Secret | Required | Example | Note |
|--------|----------|---------|------|
| `SSH_PRIVATE_KEY` | ✓ | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Full file content, no passphrase |
| `SSH_HOST` | ✓ | `192.0.2.123` atau `example.com` | Server IP atau domain |
| `SSH_USER` | ✓ | `deploy` | SSH username yang punya write access |
| `TARGET_PATH` | ✓ | `/var/www/laravel/public/tautan` | Absolute path untuk rsync target |
| `SSH_KNOWN_HOSTS` | - | `example.com ssh-ed25519 AAAA...` | Optional tapi recommended untuk security |
| `DEPLOY_RESTART_CMD` | - | `sudo systemctl restart php-fpm` | Optional command setelah deploy |

## Workflow Steps (What Happens on Push)

```
PUSH to main
    ↓
[BUILD JOB]
  1. Checkout code
  2. Install Node.js 18
  3. npm ci (install dependencies)
  4. npm run build (build frontend)
  5. tar -czf (compress files)
  6. Upload artifact to GitHub
    ↓
[DEPLOY JOB] (depends on BUILD)
  1. Download artifact
  2. Extract tar.gz
  3. Setup SSH key & known_hosts
  4. rsync files to server
  5. ✓ Verify index.html exists
  6. ✓ Check file permissions
  7. Optional: restart services
    ↓
DEPLOYMENT COMPLETE
```

## Example Deployment Scenarios

### Scenario 1: Simple SPA to Subfolder

```
GitHub repo:
  frontend/
    index.html
    js/app.js
    css/styles.css

GitHub Secret:
  TARGET_PATH = /var/www/laravel/public/tautan

Result on Server:
  /var/www/laravel/public/tautan/
    index.html
    js/app.js
    css/styles.css

Access URL:
  https://example.com/tautan/
```

### Scenario 2: Frontend at Root

```
GitHub Secret:
  TARGET_PATH = /var/www/laravel/public

Result:
  https://example.com/
  https://example.com/index.html
```

### Scenario 3: Different Domain/Subdomain

```
GitHub Secret:
  TARGET_PATH = /var/www/myapp/public

Access:
  https://app.example.com/
```

## Security Notes

1. **SSH Key**: Generate without passphrase untuk CI (passphrases tidak bisa di-input otomatis)
2. **SSH_KNOWN_HOSTS**: Selalu isi untuk avoid man-in-the-middle attacks
3. **Private Key**: Keep in GitHub secret ONLY, jangan commit ke repo
4. **File Permissions**: Set proper ownership (`www-data:www-data` untuk nginx/apache)
5. **Firewall**: Pastikan server allow SSH dari GitHub Actions runners (atau whitelist IP ranges)

## Troubleshooting

### 404 After Deployment

Kemungkinan penyebab:
1. **Files tidak ada di server** → Check GitHub Actions logs, lihat rsync errors
2. **Files ada tapi permissions salah** → `sudo chown www-data:www-data -R /var/www/laravel/public/tautan`
3. **Webserver misconfigured** → Check nginx/Apache config, add rewrite rules untuk SPA
4. **URL tidak benar** → Check TARGET_PATH di secret

### Connection Refused / Host Not Found

Kemungkinan:
1. SSH_HOST salah atau typo
2. SSH port bukan 22 (workflow assume port 22, perlu custom jika berbeda)
3. Firewall block SSH dari GitHub runners

Solusi:
1. Test lokal: `ssh -i key deploy@host 'id'`
2. Verify SSH_KNOWN_HOSTS di secret

### Permission Denied (publickey)

Public key tidak di-recognize:
1. SSH ke server, check `~/.ssh/authorized_keys` ada public key
2. Check format — harus dimulai dengan `ssh-ed25519` atau `ssh-rsa`
3. Check permissions: `chmod 600 ~/.ssh/authorized_keys` dan `chmod 700 ~/.ssh`

## Advanced Options

### Custom SSH Port

Jika server SSH tidak di port 22, edit workflow step "Rsync build":

```yaml
run: |
  rsync -avz -e "ssh -i ~/.ssh/id_rsa -p 2222" ...
```

### Deploy to Multiple Servers

Duplicate deploy job:

```yaml
deploy-prod:
  needs: build
  # ... dengan secret dari prod server

deploy-staging:
  needs: build
  # ... dengan secret dari staging server
```

### Custom Build Command

Jika `npm run build` tidak sesuai, edit workflow step "Build frontend":

```yaml
- name: Build frontend
  run: npx vite build  # atau custom build command lainnya
```

### Include Backend Deployment

Tambahkan step setelah rsync untuk deploy backend:

```yaml
- name: Deploy backend
  run: |
    ssh ${SSH_USER}@${SSH_HOST} "cd /var/www/laravel && \
      git pull origin main && \
      composer install && \
      php artisan migrate && \
      php artisan cache:clear"
```

## Next Steps After Successful Deploy

1. **Verify in browser** → Open https://example.com/tautan/
2. **Check logs** → `journalctl -u nginx` atau `tail -f /var/log/apache2/error.log`
3. **Monitor** → Setup Sentry, DataDog, atau tools lainnya
4. **SSL** → Ensure HTTPS works, use Let's Encrypt untuk free certificate
5. **CDN** → Optional, add Cloudflare atau AWS CloudFront untuk faster delivery

## Files

- 📝 [`DEPLOYMENT_QUICKSTART.md`](./DEPLOYMENT_QUICKSTART.md) — Step-by-step commands
- 📝 [`GITHUB_SECRETS_SETUP.md`](./GITHUB_SECRETS_SETUP.md) — Detailed setup & troubleshooting
- ⚙️ [`.github/workflows/deploy_to_laravel.yml`](./.github/workflows/deploy_to_laravel.yml) — Workflow definition
- 📋 [`DEPLOY_TO_LARAVEL.md`](./DEPLOY_TO_LARAVEL.md) — This file

---

**Status:** ✓ GitHub Actions workflow ready. Add secrets to GitHub and deploy otomatis akan berjalan setiap push ke main!

Pertanyaan? Lihat [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) troubleshooting section atau contact team.
