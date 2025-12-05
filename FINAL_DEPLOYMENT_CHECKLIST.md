# Complete Deployment Checklist - Copy & Paste Commands

> Execute these commands in order. Copy and paste each section.

---

## ✅ SECTION 1: Generate SSH Key

**Run in Git Bash:**
```bash
ssh-keygen -t ed25519 -C "deploy@tautan" -f ~/.ssh/tautan_deploy_key -N ""
```

**Verify success:**
```bash
cat ~/.ssh/tautan_deploy_key.pub
```
Should output: `ssh-ed25519 AAAAC3NzaC1lZDI1OTE5... deploy@tautan`

✅ **Mark Complete:** Yes, I see the public key

---

## ✅ SECTION 2: Get Private Key (for GitHub secrets)

**Run in Git Bash:**
```bash
cat ~/.ssh/tautan_deploy_key
```

**Copy output (entire block including BEGIN/END lines)**

Example output format:
```
-----BEGIN PRIVATE KEY-----
AAAAB3NzaC1lZDI1OTE5AAAAIJxXZ...
... many lines ...
-----END PRIVATE KEY-----
```

✅ **Mark Complete:** Copied (save this somewhere safe for Step 4)

---

## ✅ SECTION 3: Server Setup

**On your Linux/Laravel server, run these commands:**

```bash
# Create SSH directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add public key (PASTE YOUR PUBLIC KEY from Section 1 here)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1OTE5AAAAI... deploy@tautan" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Create deployment target
sudo mkdir -p /var/www/laravel/public/tautan
sudo chown www-data:www-data /var/www/laravel/public/tautan
sudo chmod 755 /var/www/laravel/public/tautan
```

**Test SSH works (from your Windows machine in Git Bash):**
```bash
ssh -i ~/.ssh/tautan_deploy_key deploy@YOUR_ACTUAL_SERVER_IP "id"
```

Should output: `uid=1000(deploy) gid=1000(deploy) groups=1000(deploy)`

✅ **Mark Complete:** SSH key login works

---

## ✅ SECTION 4: GitHub Secrets Setup

**Go to:** `https://github.com/YOUR-USERNAME/YOUR-REPO/settings/secrets/actions`

**Click "New repository secret" and add these 4:**

### Secret 1: SSH_PRIVATE_KEY
- **Name:** `SSH_PRIVATE_KEY`
- **Value:** Paste entire output from Section 2 (BEGIN to END lines)
- Click "Add secret"

### Secret 2: SSH_HOST
- **Name:** `SSH_HOST`
- **Value:** `YOUR_ACTUAL_SERVER_IP` (or domain)
- Click "Add secret"

### Secret 3: SSH_USER
- **Name:** `SSH_USER`
- **Value:** `deploy` (or whatever username you use)
- Click "Add secret"

### Secret 4: TARGET_PATH
- **Name:** `TARGET_PATH`
- **Value:** `/var/www/laravel/public/tautan`
- Click "Add secret"

✅ **Mark Complete:** All 4 secrets added to GitHub

---

## ✅ SECTION 5: Trigger Deployment

**Option A - Push to main (Auto-deploys):**
```bash
cd c:\Users\LENOVO\OneDrive\Pictures\TAUTAN.2.9
git add .
git commit -m "Setup automatic deployment to Laravel"
git push origin main
```

**Option B - Manual trigger in GitHub:**
1. Go to: `https://github.com/YOUR-USERNAME/YOUR-REPO/actions`
2. Click: "Deploy to Laravel" workflow
3. Click: "Run workflow" dropdown
4. Click: "Run workflow" button

✅ **Mark Complete:** Deployment started

---

## ✅ SECTION 6: Watch Deployment

**Go to:** `https://github.com/YOUR-USERNAME/YOUR-REPO/actions`

**Monitor the workflow:**
- Should show "Deploy to Laravel" in progress (yellow circle)
- Wait for it to complete (green checkmark = success)
- Takes about 2-3 minutes

**If red X appears:**
- Click the workflow
- Scroll down and read the error logs
- Most common: SSH secrets wrong or server unreachable

✅ **Mark Complete:** Deployment finished (green checkmark)

---

## ✅ SECTION 7: Verify on Server

**SSH into server and check:**
```bash
ssh deploy@YOUR_ACTUAL_SERVER_IP

# List deployed files
ls -la /var/www/laravel/public/tautan/

# Should show:
# -rw-r--r-- ... index.html
# drwxr-xr-x ... assets/
# drwxr-xr-x ... css/
# drwxr-xr-x ... js/
```

**Test in browser:**
```
http://YOUR_ACTUAL_SERVER_IP/tautan/
```

Should display your website, NOT a 404 error.

✅ **Mark Complete:** Website is live!

---

## 🎉 DEPLOYMENT COMPLETE

From now on, to deploy changes:

```bash
git add .
git commit -m "Your message"
git push origin main
```

That's it! Website updates automatically in 2-3 minutes.

---

## ⚠️ If Something Breaks

**Check SSH connection first:**
```bash
ssh -v -i ~/.ssh/tautan_deploy_key deploy@YOUR_ACTUAL_SERVER_IP
# Look for: "Authentication succeeded"
# If "Permission denied", SSH key not authorized
```

**Check server folder permissions:**
```bash
ssh deploy@YOUR_ACTUAL_SERVER_IP "stat /var/www/laravel/public/tautan/"
# Should show: Access: 0755
```

**Check GitHub Actions logs:**
```
https://github.com/YOUR-USERNAME/YOUR-REPO/actions
→ Click failed workflow
→ Scroll to see error
```

**Most common errors:**
- `Permission denied (publickey)` → SSH key not on server or wrong path
- `rsync: command not found` → Server doesn't have rsync (install: `sudo apt install rsync`)
- `mkdir: permission denied` → User doesn't have sudo access to create /var/www folder

---

**Questions?** See: `START_HERE_DEPLOYMENT.md`, `DEPLOYMENT_QUICKSTART.md`
