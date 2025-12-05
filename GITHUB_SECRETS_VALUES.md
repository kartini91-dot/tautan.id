# SECTION 4: GitHub Secrets - Copy Paste These Values

Go to: https://github.com/kartini91-dot/tautan.id/settings/secrets/actions

Click "New repository secret" and add these 4 secrets:

---

## Secret 1: SSH_PRIVATE_KEY

**Name:** `SSH_PRIVATE_KEY`

**Value:** (Copy entire block below, including BEGIN and END lines)

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtz
c2gtZWQyNTUxOQAAACDy6kei7qWV4uL8dH41x3xZMEAZevRc1Ose8PKA0YWQqwAAAJAhoJ
QCIaCUAgAAAAtzc2gtZWQyNTUxOQAAACDy6kei7qWV4uL8dH41x3xZMEAZevRc1Ose8PKA
0YWQqwAAAAA+jYjnF8Kvqt+5Av+bPDUqu/HmD4O3hY4tAN+76rPz6PLqR6LupZXi4vx0fj
XHfFkwQBl69FzU6x7w8oDRhZCrAAAADWRlcGxveUB0YXV0YW4=
-----END OPENSSH PRIVATE KEY-----
```

---

## Secret 2: SSH_HOST

**Name:** `SSH_HOST`

**Value:** 
```
example.com
```
*(Replace `example.com` with your actual server IP or domain when you have a server)*

---

## Secret 3: SSH_USER

**Name:** `SSH_USER`

**Value:**
```
deploy
```
*(Change if your SSH username is different)*

---

## Secret 4: TARGET_PATH

**Name:** `TARGET_PATH`

**Value:**
```
/var/www/laravel/public/tautan
```

---

## How to Add Secrets to GitHub:

1. Open: https://github.com/kartini91-dot/tautan.id/settings/secrets/actions
2. Click "New repository secret"
3. Enter Name (e.g., `SSH_PRIVATE_KEY`)
4. Paste Value from above
5. Click "Add secret"
6. Repeat for all 4 secrets

---

## What Each Secret Does:

- **SSH_PRIVATE_KEY** → Authentication key to connect to your server
- **SSH_HOST** → Your server's IP address or domain name
- **SSH_USER** → Username to login via SSH
- **TARGET_PATH** → Folder where files will be deployed on server

---

## Status:
- ✅ SSH Key Generated
- ⏳ GitHub Secrets (You need to add these manually in GitHub UI)
- ⏳ Deployment Ready (Once secrets are added)
