# Deployment Quick Start - RUN THESE COMMANDS NOW

Panduan langkah demi langkah untuk setup deployment otomatis. Copy-paste dan jalankan command ini di terminal Anda.

## STEP 1: Generate SSH Key (di Local Machine)

### PowerShell
```powershell
# Run di PowerShell sebagai user normal (bukan admin)
mkdir -Force $env:USERPROFILE\.ssh
ssh-keygen -t ed25519 -C "deploy@tautan" -f "$env:USERPROFILE\.ssh\tautan_deploy_key" -N ""

# Jika sukses, Anda akan lihat:
# Your identification has been saved in C:\Users\[YOUR_USER]\.ssh\tautan_deploy_key
# Your public key has been saved in C:\Users\[YOUR_USER]\.ssh\tautan_deploy_key.pub
```

### cmd.exe
```cmd
mkdir %USERPROFILE%\.ssh
ssh-keygen -t ed25519 -C "deploy@tautan" -f "%USERPROFILE%\.ssh\tautan_deploy_key" -N ""
```

✓ Selesai. Key sudah generated.

---

## STEP 2: Setup di Server Laravel

SSH ke server Anda dan jalankan command ini (replace `deploy` dengan username Anda):

```bash
# Login ke server terlebih dahulu
ssh deploy@your-server-ip

# Buat .ssh folder
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Copy public key dari local machine ke authorized_keys
# Method A: Jika Anda punya SSH akses, gunakan ssh-copy-id
#   (di local machine)
#   ssh-copy-id -i ~/.ssh/tautan_deploy_key.pub deploy@your-server-ip

# Method B: Manual - Copy public key content dan paste ke server
# Step 1: Display public key (di local machine)
#   cat ~/.ssh/tautan_deploy_key.pub
# Step 2: SSH ke server dan append ke authorized_keys
#   echo "ssh-ed25519 AAAA... deploy@tautan" >> ~/.ssh/authorized_keys
#   chmod 600 ~/.ssh/authorized_keys

# Buat target folder untuk frontend
sudo mkdir -p /var/www/laravel/public/tautan
sudo chown www-data:www-data /var/www/laravel/public/tautan
sudo chmod 755 /var/www/laravel/public/tautan

# Test permissions
sudo -u www-data touch /var/www/laravel/public/tautan/.test
rm /var/www/laravel/public/tautan/.test
echo "✓ Folder siap"
```

✓ Server siap menerima deployment.

---

## STEP 3: Add GitHub Secrets

### Option A: GitHub UI (Easy)

1. Buka: https://github.com/YOUR_USERNAME/TAUTAN.2.9/settings/secrets/actions
2. Klik "New repository secret"
3. Tambahkan 4 secret wajib:

#### Secret 1: SSH_PRIVATE_KEY
- **Name:** SSH_PRIVATE_KEY
- **Value:** Paste isi file `C:\Users\YOUR_USER\.ssh\tautan_deploy_key` (seluruh file including BEGIN/END lines)

PowerShell (copy isi):
```powershell
Get-Content "$env:USERPROFILE\.ssh\tautan_deploy_key" -Raw
```

#### Secret 2: SSH_HOST
- **Name:** SSH_HOST
- **Value:** your-server-ip atau your-domain.com (contoh: 192.0.2.123 atau example.com)

#### Secret 3: SSH_USER
- **Name:** SSH_USER
- **Value:** deploy (atau username yang Anda gunakan di server)

#### Secret 4: TARGET_PATH
- **Name:** TARGET_PATH
- **Value:** /var/www/laravel/public/tautan

#### Secret 5 (Optional): SSH_KNOWN_HOSTS
- **Name:** SSH_KNOWN_HOSTS
- **Value:** Hasil dari ssh-keyscan (untuk security improvement)

PowerShell (generate):
```powershell
ssh-keyscan -t ed25519 your-server-ip 2>$null
# Copy seluruh output (1 baris)
```

#### Secret 6 (Optional): DEPLOY_RESTART_CMD
- **Name:** DEPLOY_RESTART_CMD
- **Value:** sudo systemctl restart php-fpm && sudo systemctl restart nginx

---

### Option B: GitHub CLI (Fast)

PowerShell:
```powershell
# Login ke GitHub (jika belum)
gh auth login

# Ganti values di bawah sesuai server Anda
$SSH_HOST = "192.0.2.123"  # UBAH INI
$SSH_USER = "deploy"        # UBAH INI jika berbeda
$TARGET_PATH = "/var/www/laravel/public/tautan"  # UBAH INI jika berbeda

# Set secrets
gh secret set SSH_HOST --body "$SSH_HOST"
gh secret set SSH_USER --body "$SSH_USER"
gh secret set TARGET_PATH --body "$TARGET_PATH"

# Set private key (baca dari file)
$privKey = Get-Content "$env:USERPROFILE\.ssh\tautan_deploy_key" -Raw
gh secret set SSH_PRIVATE_KEY --body "$privKey"

# Optional: Set known hosts
$knownHosts = ssh-keyscan -t ed25519 "$SSH_HOST" 2>$null
gh secret set SSH_KNOWN_HOSTS --body "$knownHosts"

# Optional: Set restart command
gh secret set DEPLOY_RESTART_CMD --body "sudo systemctl restart php-fpm && sudo systemctl restart nginx"

# Verify
gh secret list
```

✓ Secrets sudah tersimpan di GitHub.

---

## STEP 4: Test SSH Connection (dari Local Machine)

Pastikan SSH key berfungsi:

```powershell
# Test koneksi
ssh -i "$env:USERPROFILE\.ssh\tautan_deploy_key" deploy@your-server-ip "echo 'Connected!' && id"

# Jika berhasil, Anda akan melihat output dari server:
# Connected!
# uid=1000(deploy) gid=1000(deploy) groups=1000(deploy)
```

✓ SSH connection berhasil.

---

## STEP 5: Trigger First Deployment

### A. Make a change dan push ke main branch

PowerShell:
```powershell
# Go to your repo folder
cd c:\Users\LENOVO\OneDrive\Pictures\TAUTAN.2.9

# Check status
git status

# If no changes, create a marker file
echo "# Deployment test" > deployment-marker.txt

# Commit
git add .
git commit -m "Trigger automatic deployment"

# Push ke main
git push origin main
```

### B. Monitor GitHub Actions

1. Buka: https://github.com/YOUR_USERNAME/TAUTAN.2.9/actions
2. Cari workflow "Build & Deploy to Laravel Server"
3. Klik workflow yang berjalan
4. Lihat step-step:
   - ✓ Build frontend
   - ✓ Archive build
   - ✓ Rsync to Laravel
   - ✓ Verify index.html exists (NEW!)
   - ✓ Check file permissions (NEW!)
   - ✓ Done

✓ Deployment selesai.

---

## STEP 6: Verify Deployment Works

### A. SSH ke server dan check files

```bash
# Connect ke server
ssh deploy@your-server-ip

# Check files exist
ls -la /var/www/laravel/public/tautan/
head -n 30 /var/www/laravel/public/tautan/index.html

# Lihat permissions
stat /var/www/laravel/public/tautan/
```

### B. Test dari browser atau curl

```powershell
# Test URL
curl -I https://your-domain.com/tautan/

# Should return:
# HTTP/1.1 200 OK
# Content-Type: text/html

# Test specific file
curl -I https://your-domain.com/tautan/index.html
```

✓ Deployment berhasil!

---

## TROUBLESHOOTING

### Error: Host key verification failed

**Solusi:** Set `SSH_KNOWN_HOSTS` secret dengan output dari:
```powershell
ssh-keyscan -t ed25519 your-server-ip 2>$null
```

### Error: Permission denied (publickey)

**Solusi:** Public key tidak ada di server. SSH ke server dan:
```bash
# Check authorized_keys
cat ~/.ssh/authorized_keys

# Harus ada 1 line yang dimulai dengan "ssh-ed25519"
# Jika tidak ada, tambahkan:
echo "ssh-ed25519 AAAA..." >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Error: 404 Page Not Found setelah deploy

**Solusi:**

1. Check file ada di server:
```bash
ssh deploy@your-server-ip "ls -la /var/www/laravel/public/tautan/index.html"
```

2. Jika file tidak ada, rsync gagal. Check GitHub Actions logs untuk error detail.

3. Jika file ada tapi 404, webserver misconfigured. Add nginx rewrite rule:
```nginx
location /tautan/ {
    alias /var/www/laravel/public/tautan/;
    try_files $uri $uri/ /tautan/index.html;
}
```

Reload nginx: `sudo systemctl reload nginx`

---

## ✓ All Done!

Setiap kali Anda push ke `main` branch, workflow otomatis:
1. Build frontend
2. Archive files
3. Upload ke GitHub
4. SSH ke server
5. Rsync files ke `/var/www/laravel/public/tautan`
6. Verify files ada
7. Check permissions
8. Restart services (optional)

---

## Next Steps (Optional)

- [ ] Setup HTTPS SSL certificate
- [ ] Setup CDN (Cloudflare, AWS CloudFront)
- [ ] Add monitoring (Sentry, Datadog)
- [ ] Setup backend deployment (jika perlu)
- [ ] Setup staging environment

Lihat `GITHUB_SECRETS_SETUP.md` untuk detail lebih lanjut.
