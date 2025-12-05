# Complete GitHub Setup - Step by Step

Repository: `https://github.com/kartini91-dot/tautan.id`

---

## STEP 1: Add GitHub Secrets (5 minutes)

### Go to Secrets Settings:
```
https://github.com/kartini91-dot/tautan.id/settings/secrets/actions
```

### Add 4 Secrets:

#### Secret #1 - SSH_PRIVATE_KEY
1. Click **"New repository secret"**
2. Name: `SSH_PRIVATE_KEY`
3. Value: (Paste this entire block including BEGIN/END lines)
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtz
c2gtZWQyNTUxOQAAACDy6kei7qWV4uL8dH41x3xZMEAZevRc1Ose8PKA0YWQqwAAAJAhoJ
QCIaCUAgAAAAtzc2gtZWQyNTUxOQAAACDy6kei7qWV4uL8dH41x3xZMEAZevRc1Ose8PKA
0YWQqwAAAAA+jYjnF8Kvqt+5Av+bPDUqu/HmD4O3hY4tAN+76rPz6PLqR6LupZXi4vx0fj
XHfFkwQBl69FzU6x7w8oDRhZCrAAAADWRlcGxveUB0YXV0YW4=
-----END OPENSSH PRIVATE KEY-----
```
4. Click **"Add secret"**

#### Secret #2 - SSH_HOST
1. Click **"New repository secret"**
2. Name: `SSH_HOST`
3. Value: `example.com` (or your server IP)
4. Click **"Add secret"**

#### Secret #3 - SSH_USER
1. Click **"New repository secret"**
2. Name: `SSH_USER`
3. Value: `deploy`
4. Click **"Add secret"**

#### Secret #4 - TARGET_PATH
1. Click **"New repository secret"**
2. Name: `TARGET_PATH`
3. Value: `/var/www/laravel/public/tautan`
4. Click **"Add secret"**

---

## STEP 2: Verify Secrets Added

After adding all 4 secrets, you should see this list:
- ✅ SSH_PRIVATE_KEY
- ✅ SSH_HOST
- ✅ SSH_USER
- ✅ TARGET_PATH

All should show "Updated recently"

---

## STEP 3: Trigger First Deployment

### Option A: Push to main (Recommended)
```bash
cd c:\Users\LENOVO\OneDrive\Pictures\TAUTAN.2.9
git add .
git commit -m "Setup automatic deployment with GitHub Actions"
git push origin main
```

### Option B: Manual trigger in GitHub UI
1. Go to: https://github.com/kartini91-dot/tautan.id/actions
2. Click: **"Deploy to Laravel"** workflow
3. Click: **"Run workflow"** button
4. Select **"main"** branch
5. Click **"Run workflow"**

---

## STEP 4: Watch Deployment

1. Go to: https://github.com/kartini91-dot/tautan.id/actions
2. Watch for "Deploy to Laravel" workflow
3. Yellow circle = In progress
4. Green checkmark = Success
5. Red X = Failed (check logs)

**Takes about 2-3 minutes**

---

## STEP 5: After First Deployment

Once deployment succeeds:

### Check files on server:
```bash
ssh -i ~/.ssh/tautan_deploy_key deploy@example.com "ls -la /var/www/laravel/public/tautan/"
```

Should show: `index.html`, `assets/`, `css/`, `js/`

### Test in browser:
```
http://example.com/tautan/
```

Should display your website (not 404)

---

## What Happens Now?

Every time you push to `main` branch:
1. ✅ Code checked out
2. ✅ Frontend built
3. ✅ Files uploaded via SSH
4. ✅ Verification checks run
5. ✅ Website updates live (2-3 minutes)

**No manual steps needed!** Just `git push` and done.

---

## Troubleshooting

**Red X in GitHub Actions?**
- Click the failed workflow
- Scroll down to see error logs
- Common: `Permission denied` = SSH key issue
- Common: `rsync: command not found` = server needs rsync

**Website still shows 404?**
- Check that index.html exists: `ssh deploy@example.com "cat /var/www/laravel/public/tautan/index.html"`
- Check permissions: `ssh deploy@example.com "stat /var/www/laravel/public/tautan/"`
- Check webserver config points to `/var/www/laravel/public/`

---

## Next: Deploy to Real Server

When you have a real server:
1. Update GitHub secrets:
   - `SSH_HOST` → Your server IP
   - `SSH_USER` → Your server username
   - `SSH_PRIVATE_KEY` → Generate new key on server
   - `TARGET_PATH` → Adjust if needed

2. Setup server SSH (see `FINAL_DEPLOYMENT_CHECKLIST.md` Section 3)

3. Push to main and done!

---

**Status Update:**
- ✅ SSH Key: Generated
- ✅ GitHub Secrets: Ready to add (values provided)
- ⏳ Deployment: Ready once you add secrets
