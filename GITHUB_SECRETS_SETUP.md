# GitHub Actions Deployment Setup Guide

Panduan lengkap untuk mengkonfigurasi automatic deployment ke Laravel server menggunakan GitHub Actions.

## 1. Langkah Awal: Siapkan SSH Key

### A. Generate SSH Keypair (di mesin lokal Anda)

Jalankan command ini di PowerShell atau cmd.exe:

**PowerShell:**
```powershell
# Buat folder .ssh jika belum ada
mkdir -Force $env:USERPROFILE\.ssh

# Generate ed25519 key (direkomendasikan)
ssh-keygen -t ed25519 -C "deploy@tautan" -f "$env:USERPROFILE\.ssh\tautan_deploy_key" -N ""

# ATAU jika ed25519 tidak tersedia, gunakan RSA
ssh-keygen -t rsa -b 4096 -C "deploy@tautan" -f "$env:USERPROFILE\.ssh\tautan_deploy_key" -N ""
```

**cmd.exe:**
```cmd
mkdir %USERPROFILE%\.ssh
ssh-keygen -t ed25519 -C "deploy@tautan" -f "%USERPROFILE%\.ssh\tautan_deploy_key" -N ""
```

Setelah sukses, Anda akan memiliki:
- **Private key:** `%USERPROFILE%\.ssh\tautan_deploy_key` (JANGAN dishare)
- **Public key:** `%USERPROFILE%\.ssh\tautan_deploy_key.pub`

### B. Siapkan Server (di Laravel host)

SSH ke server Anda dan jalankan (sebagai deploy user atau dengan sudo):

```bash
# Login sebagai deploy user atau sudo su - deploy

# Buat .ssh folder
mkdir -p ~/.ssh

# Tambahkan public key ke authorized_keys
# GANTI "ssh-ed25519 AAAA..." dengan isi dari tautan_deploy_key.pub
echo "ssh-ed25519 AAAA... deploy@tautan" >> ~/.ssh/authorized_keys

# Set proper permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Pastikan folder target ada dan user bisa write
sudo mkdir -p /var/www/laravel/public/tautan
sudo chown www-data:www-data /var/www/laravel/public/tautan
sudo chmod 755 /var/www/laravel/public/tautan
```

### C. Test SSH Connection (di mesin lokal)

```powershell
# Test SSH dengan key
ssh -i "$env:USERPROFILE\.ssh\tautan_deploy_key" deploy@example.com "echo 'Connected!' && id"

# Jika berhasil, Anda akan melihat output dari remote server
```

## 2. Generate GitHub Secrets

### Informasi yang Anda butuhkan:
- **SSH_HOST:** hostname atau IP server Laravel (contoh: 192.0.2.123 atau example.com)
- **SSH_USER:** username untuk SSH (contoh: deploy)
- **TARGET_PATH:** path absolut di server tempat frontend di-rsync (contoh: /var/www/laravel/public/tautan)

### A. Copy Private Key (untuk GitHub secret SSH_PRIVATE_KEY)

**PowerShell:**
```powershell
# Display private key (copy seluruh output termasuk BEGIN/END lines)
Get-Content "$env:USERPROFILE\.ssh\tautan_deploy_key" -Raw

# Output akan terlihat seperti ini:
# -----BEGIN OPENSSH PRIVATE KEY-----
# b3BlbnNzaC1rZXktdjEAAAAABG5vbmUtbm9uZS1ub25lAA...
# ...
# -----END OPENSSH PRIVATE KEY-----
```

**cmd.exe:**
```cmd
type %USERPROFILE%\.ssh\tautan_deploy_key
```

### B. Generate Known Hosts (opsional tapi direkomendasikan)

Jalankan di command line Anda:

```powershell
# Ganti "example.com" dengan SSH_HOST Anda
ssh-keyscan -t ed25519 example.com 2>$null

# Output akan seperti:
# example.com ssh-ed25519 AAAA... 
# Simpan seluruh baris ini untuk SSH_KNOWN_HOSTS
```

Jika ssh-keyscan tidak tersedia, Anda bisa skip dan workflow akan auto-generate (kurang aman).

## 3. Tambahkan Secrets ke GitHub

Ada 2 cara: GitHub UI atau GitHub CLI.

### Cara A: GitHub UI (Manual - lebih mudah untuk pemula)

1. Buka repository Anda di GitHub: https://github.com/YOUR_USERNAME/TAUTAN.2.9
2. Pergi ke: **Settings** → **Secrets and variables** → **Actions**
3. Klik **New repository secret** dan tambahkan setiap secret:

| Secret Name | Value |
|---|---|
| SSH_PRIVATE_KEY | Paste isi file `tautan_deploy_key` (include BEGIN/END lines) |
| SSH_HOST | example.com atau 192.0.2.123 |
| SSH_USER | deploy |
| TARGET_PATH | /var/www/laravel/public/tautan |
| SSH_KNOWN_HOSTS | (Optional) Paste output dari `ssh-keyscan` |
| DEPLOY_RESTART_CMD | (Optional) `sudo systemctl restart php-fpm && sudo systemctl restart nginx` |

Contoh screenshot (jika UI berbeda):
- Setiap secret adalah key-value pair
- Paste value persis seperti yang diminta (jangan tambah/kurangi spasi)

### Cara B: GitHub CLI (Lebih cepat - perlu `gh` CLI installed)

Jalankan command ini di PowerShell (ganti EXAMPLE.COM, deploy, path sesuai environment Anda):

```powershell
# 1. Login ke GitHub (jika belum)
gh auth login

# 2. Set secrets (ubah values sesuai server Anda)
gh secret set SSH_HOST --body "example.com"
gh secret set SSH_USER --body "deploy"
gh secret set TARGET_PATH --body "/var/www/laravel/public/tautan"

# 3. Set optional secrets
gh secret set SSH_KNOWN_HOSTS --body "example.com ssh-ed25519 AAAA..."
gh secret set DEPLOY_RESTART_CMD --body "sudo systemctl restart php-fpm && sudo systemctl restart nginx"

# 4. Set private key (ini agak panjang)
$privKey = Get-Content "$env:USERPROFILE\.ssh\tautan_deploy_key" -Raw
gh secret set SSH_PRIVATE_KEY --body "$privKey"

# 5. Verify secrets sudah tersimpan
gh secret list
```

## 4. Update Workflow (Opsional - untuk Debugging 404 Issues)

Jika saat deploy di-test ke Netlify atau server dan muncul "404 Page Not Found", saya sudah menyiapkan enhanced workflow dengan verification step.

Workflow saat ini sudah include:
- ✓ Build frontend
- ✓ Archive dan upload artifact
- ✓ SSH key setup
- ✓ Rsync ke target
- ✓ Optional restart command

Jika perlu debugging 404, saya bisa add:
- Step untuk verify index.html ada di target setelah rsync
- Step untuk check file permissions
- Step untuk list directory contents untuk inspection

## 5. Deploy Pertama Kali

### A. Push ke main branch dan trigger workflow

```powershell
# Commit changes (jika ada)
git add .
git commit -m "Configure GitHub Actions deployment"

# Push ke main branch
git push origin main
```

### B. Monitor workflow execution

1. Buka GitHub repository Anda
2. Pergi ke **Actions** tab
3. Cari workflow "Build & Deploy to Laravel Server"
4. Klik job terbaru untuk lihat logs

### C. Troubleshooting Common Errors

| Error | Penyebab | Solusi |
|---|---|---|
| Host key verification failed | SSH_KNOWN_HOSTS tidak set | Set `SSH_KNOWN_HOSTS` dengan output `ssh-keyscan` |
| Permission denied (publickey) | Public key tidak ada di server authorized_keys | SSH ke server, append public key ke `~/.ssh/authorized_keys`, set permissions |
| rsync: command not found | rsync tidak installed di runner | GitHub Actions runner Ubuntu punya rsync by default |
| 404 after deploy | File tidak ada di target path atau webserver misconfigured | Check file permissions, check nginx/Apache config, see section 6 |
| Connection refused | SSH_HOST atau SSH_USER salah | Verify dengan: `ssh -i key deploy@host 'id'` |

## 6. Fix 404 After Deployment

Jika setelah deploy Anda akses URL tapi dapat "Page Not Found":

### A. Verify files exist di server

SSH ke server (ganti host/user sesuai):

```bash
# Login
ssh deploy@example.com

# Check file exists
ls -la /var/www/laravel/public/tautan/index.html

# Check permissions
stat /var/www/laravel/public/tautan/

# Check content (first 20 lines)
head -n 20 /var/www/laravel/public/tautan/index.html
```

### B. Jika file ada tapi curl 404

Kemungkinan webserver misconfigured. Cek:

**Nginx config (usually /etc/nginx/sites-available/...):**

```nginx
# Tambahkan location block untuk subfolder tautan
location /tautan/ {
    alias /var/www/laravel/public/tautan/;
    try_files $uri $uri/ /tautan/index.html;
    # untuk SPA, redirect 404 ke index.html
}
```

Atau jika di root Laravel public:

```nginx
location / {
    alias /var/www/laravel/public/;
    try_files $uri $uri/ /index.html;
}
```

Setelah edit config, test dan reload:

```bash
sudo nginx -t              # test config
sudo systemctl reload nginx # apply
```

**Apache config (usually /etc/apache2/sites-available/...):**

Buat `.htaccess` di `/var/www/laravel/public/tautan/.htaccess`:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /tautan/
  
  # Serve existing files directly
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  
  # Otherwise redirect to index.html for SPA
  RewriteRule ^ index.html [L]
</IfModule>
```

### C. Jika file tidak ada di server

Kemungkinan rsync gagal atau artifact tidak build dengan benar. Check di GitHub Actions logs:

1. Buka Actions job
2. Lihat step "Rsync build to Laravel public directory"
3. Lihat error message (biasanya permission denied atau path salah)

Solusi:
- Verify TARGET_PATH di GitHub secret
- Verify public key di server authorized_keys
- Retry deploy dengan push ke main lagi

## 7. Verify Deployment Success

Setelah deploy, test URLs:

```powershell
# Ganti example.com/tautan dengan URL Anda
curl -I https://example.com/tautan/          # Should return 200
curl -I https://example.com/tautan/index.html # Should return 200
curl https://example.com/tautan/ | head -n 20 # Should show HTML content
```

Jika semua return 200 dan menampilkan HTML, deployment sukses! ✓

## 8. Next Steps (Opsional)

- [ ] Setup HTTPS/SSL certificate (jika belum)
- [ ] Setup CDN (cloudflare, etc) untuk faster delivery
- [ ] Add monitoring/logging (Sentry, etc)
- [ ] Add backend API deployment (jika perlu backend juga)
- [ ] Setup staging environment untuk test sebelum production

---

## Quick Reference - Commands to Run Sekarang

### 1. Generate key (lokal)
```powershell
ssh-keygen -t ed25519 -C "deploy@tautan" -f "$env:USERPROFILE\.ssh\tautan_deploy_key" -N ""
```

### 2. View private key (untuk copy ke GitHub)
```powershell
Get-Content "$env:USERPROFILE\.ssh\tautan_deploy_key" -Raw
```

### 3. View public key (untuk add ke server)
```powershell
Get-Content "$env:USERPROFILE\.ssh\tautan_deploy_key.pub" -Raw
```

### 4. Test SSH
```powershell
ssh -i "$env:USERPROFILE\.ssh\tautan_deploy_key" deploy@example.com "echo 'OK'"
```

### 5. Generate known_hosts
```powershell
ssh-keyscan -t ed25519 example.com 2>$null
```

Setelah semua secret added, push ke GitHub main branch dan workflow akan auto-run!
