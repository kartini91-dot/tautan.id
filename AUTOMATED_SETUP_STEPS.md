# Automated Deployment Setup - Step by Step

> **Status:** Ready to execute. Follow these steps in order.

## Prerequisites Check

Before starting, ensure you have:
- [ ] Git for Windows installed (includes Git Bash)
- [ ] SSH installed (comes with Git Bash)
- [ ] GitHub account with repository access
- [ ] Linux/Laravel server access (IP, username, password)
- [ ] npm installed locally

## Step 1: Generate SSH Key (5 minutes)

**Option A: Using Git Bash (Recommended)**
```bash
ssh-keygen -t ed25519 -C "deploy@tautan" -f ~/.ssh/tautan_deploy_key -N ""
```

**Option B: Using PowerShell (Windows)**
```powershell
# First, install Windows OpenSSH
# Then use this:
& "C:\Program Files\Git\usr\bin\ssh-keygen.exe" -t ed25519 -C "deploy@tautan" -f "$env:USERPROFILE\.ssh\tautan_deploy_key" -N ""
```

**Verify:** Check that files exist:
```bash
ls -la ~/.ssh/tautan_deploy_key*
```

---

## Step 2: Setup Server SSH (10 minutes)

### On Your Linux/Laravel Server:

```bash
# 1. Create .ssh directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 2. Add your public key (copy from Step 1 output)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1OTE5... deploy@tautan" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 3. Create deployment target folder
sudo mkdir -p /var/www/laravel/public/tautan
sudo chown www-data:www-data /var/www/laravel/public/tautan
sudo chmod 755 /var/www/laravel/public/tautan

# 4. Test SSH key works (from your local machine)
ssh -i ~/.ssh/tautan_deploy_key deploy@YOUR_SERVER_IP "echo 'SSH works!'"
```

**Replace `YOUR_SERVER_IP`** with your actual server IP or domain.

---

## Step 3: Copy Private Key Content

From Git Bash on your Windows machine:

```bash
cat ~/.ssh/tautan_deploy_key
```

Copy the entire output (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

---

## Step 4: Add GitHub Secrets (5 minutes)

Go to: `GitHub.com` → Your Repository → **Settings** → **Secrets and variables** → **Actions**

### Add these 4 required secrets:

| Secret Name | Value |
|---|---|
| `SSH_PRIVATE_KEY` | Paste content from Step 3 |
| `SSH_HOST` | Your server IP or domain (e.g., `203.0.113.50`) |
| `SSH_USER` | SSH username (e.g., `deploy`) |
| `TARGET_PATH` | `/var/www/laravel/public/tautan` |

### Optional (for debugging):
| Secret Name | Value |
|---|---|
| `SSH_KNOWN_HOSTS` | Get via: `ssh-keyscan YOUR_SERVER_IP` |
| `DEPLOY_RESTART_CMD` | `sudo systemctl restart nginx` |

**How to add secrets:**
1. Click **New repository secret**
2. Enter name (e.g., `SSH_HOST`)
3. Enter value
4. Click **Add secret**
5. Repeat for all 4 secrets

---

## Step 5: Trigger First Deployment (2 minutes)

### Option A: Git Push (Automatic)
```bash
cd c:\Users\LENOVO\OneDrive\Pictures\TAUTAN.2.9
git add .
git commit -m "Setup automatic deployment"
git push origin main
```

### Option B: Manual Trigger
1. Go to GitHub repository
2. Click **Actions** tab
3. Select **Deploy to Laravel** workflow
4. Click **Run workflow** → **Run workflow**

### Watch the deployment:
- GitHub repo → **Actions** tab
- Click the running workflow
- Check logs in real-time
- Should complete in 2-3 minutes

---

## Step 6: Verify Deployment (2 minutes)

### Check files on server:
```bash
# SSH into server
ssh deploy@YOUR_SERVER_IP

# Verify files deployed
ls -la /var/www/laravel/public/tautan/
# Should show: index.html, assets/, js/, css/

# Check file permissions
stat /var/www/laravel/public/tautan/index.html
# Should show: 644 or 755
```

### Test in browser:
- Open: `http://YOUR_SERVER_IP/tautan/`
- Should see your website
- Not a 404 error ✓

---

## Step 7: Troubleshooting

### If deployment fails:

**Check 1: GitHub Actions logs**
- Go to Actions tab → failed workflow
- Look for red error messages
- Most common: SSH connection refused, wrong credentials

**Check 2: SSH key issues**
```bash
# Test SSH connection manually (from your machine)
ssh -i ~/.ssh/tautan_deploy_key -v deploy@YOUR_SERVER_IP "echo test"
# Should show: "echo test" output, not connection refused
```

**Check 3: Server permissions**
```bash
# On server, check if www-data can write
sudo -u www-data touch /var/www/laravel/public/tautan/test.txt
# Should succeed without errors
```

**Check 4: Firewall/Security Groups**
- Ensure server allows inbound SSH (port 22)
- Check AWS/Digital Ocean firewall rules

---

## Summary of Time Required

| Step | Time |
|---|---|
| 1. Generate SSH Key | 5 min |
| 2. Setup Server SSH | 10 min |
| 3. Copy Private Key | 1 min |
| 4. Add GitHub Secrets | 5 min |
| 5. Trigger Deployment | 2 min |
| 6. Verify | 2 min |
| **TOTAL** | **~25 minutes** |

---

## What Happens on Each Deploy

From this point forward, every time you push to `main` branch:

1. ✓ Code checked out
2. ✓ npm dependencies installed
3. ✓ Frontend built (webpack/build process)
4. ✓ Files uploaded via SSH + rsync
5. ✓ Verification: checks index.html exists
6. ✓ Verification: checks file permissions
7. ✓ Done - site live in ~2 minutes

**You don't need to do anything** - it's fully automatic!

---

## Getting Help

- **Workflow file:** `.github/workflows/deploy_to_laravel.yml` (106 lines)
- **Documentation:** `START_HERE_DEPLOYMENT.md`, `DEPLOYMENT_QUICKSTART.md`
- **Scripts:** `scripts/generate-ssh-key.sh`, `scripts/quick-setup.ps1`

**Good luck! 🚀**
