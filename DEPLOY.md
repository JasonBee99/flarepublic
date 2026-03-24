# FlaRepublic — Production Deployment Runbook
# DreamHost VPS · Node v20 · PM2 · Nginx · MongoDB

## Prerequisites (one-time)

### 1. VPS access
SSH into your DreamHost VPS:
```
ssh user@your-vps-ip
```

### 2. Install Node v20 (if not already)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # should print v20.x.x
```

### 3. Install PM2 globally
```bash
sudo npm install -g pm2
```

### 4. Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

### 5. Activate MongoDB on DreamHost panel
Log in to panel.dreamhost.com → Managed MongoDB → Create database → copy connection string.

---

## First-time deploy

### Step 1: Clone the repo
```bash
cd /home
git clone https://github.com/JasonBee99/flarepublic.git flarepublic
cd flarepublic
```

### Step 2: Create production .env
```bash
cp .env.example .env
nano .env
```

Set these values:
```
DATABASE_URL=mongodb+srv://USER:PASS@HOST/flarepublic?retryWrites=true&w=majority
PAYLOAD_SECRET=your-long-random-secret-32-chars-min
NEXT_PUBLIC_SERVER_URL=https://flarepublic.us
CRON_SECRET=another-random-secret
PREVIEW_SECRET=another-random-secret
```

### Step 3: Install dependencies and build
```bash
npm install
npm run build
```
Build takes 2–5 minutes. Watch for TypeScript errors — fix before deploying.

### Step 4: Create logs directory
```bash
mkdir -p /home/flarepublic/logs
```

### Step 5: Start with PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # follow the printed command to register with systemd
```

Verify it's running:
```bash
pm2 status
curl http://localhost:3000   # should return HTML
```

### Step 6: Configure Nginx
```bash
sudo cp flarepublic.nginx.conf /etc/nginx/sites-available/flarepublic.us
sudo ln -s /etc/nginx/sites-available/flarepublic.us /etc/nginx/sites-enabled/
sudo nginx -t          # must print "test is successful"
sudo systemctl reload nginx
```

### Step 7: Add SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d flarepublic.us -d www.flarepublic.us
```
Certbot will edit the Nginx config and set up auto-renewal.

### Step 8: Seed the database
```bash
npm run seed:phase5
```
This creates Counties, Roles, DocumentCategories, FileTypes, and Contacts.

### Step 9: DNS cutover
In your domain registrar (or DreamHost DNS panel):
- Point `flarepublic.us` A record → your VPS IP
- Point `www.flarepublic.us` A record → your VPS IP (or CNAME → flarepublic.us)

DNS propagation takes up to 48 hours but is usually under 30 minutes.

---

## Smoke test checklist
Run these after DNS has propagated:

- [ ] https://flarepublic.us loads (no certificate warning)
- [ ] https://www.flarepublic.us redirects to non-www
- [ ] Nav renders and all dropdown links work
- [ ] /register — form submits without error
- [ ] /login — logs in, redirects to /member
- [ ] /admin — Payload admin loads, can log in
- [ ] /resources/documents — shows seeded categories
- [ ] /contacts — shows seeded contacts
- [ ] /forum — redirects non-approved users to /member
- [ ] PDF download link from a document works
- [ ] https://flarepublic.us/api/globals/main-nav — returns JSON (not 404)

---

## Updating the site (subsequent deploys)

```bash
cd /home/flarepublic
git pull
npm install          # only if package.json changed
npm run build
pm2 reload flarepublic   # zero-downtime reload
```

If you change .env variables:
```bash
pm2 restart flarepublic --update-env
```

---

## Useful commands

| Command | What it does |
|---|---|
| `pm2 status` | See if app is running, CPU/memory |
| `pm2 logs flarepublic` | Tail live app logs |
| `pm2 logs flarepublic --lines 200` | Last 200 log lines |
| `pm2 reload flarepublic` | Zero-downtime reload |
| `pm2 restart flarepublic --update-env` | Restart with updated .env |
| `sudo nginx -t` | Validate Nginx config |
| `sudo systemctl reload nginx` | Reload Nginx config |
| `sudo certbot renew --dry-run` | Test SSL auto-renewal |
| `pm2 monit` | Live dashboard (CPU, memory, logs) |

---

## Troubleshooting

**App not starting:**
```bash
pm2 logs flarepublic --lines 50
```
Look for DATABASE_URL errors (MongoDB not reachable) or build errors.

**Nginx 502 Bad Gateway:**
The Node app isn't running on port 3000. Check `pm2 status` and restart if needed.

**Nginx config test fails:**
```bash
sudo nginx -t 2>&1
```
Fix the reported error, then reload.

**Database connection errors:**
- Confirm MongoDB is running on DreamHost panel
- Check DATABASE_URL in .env — should use the full connection string
- Ensure the VPS IP is whitelisted in MongoDB network access settings

**SSL certificate issues:**
```bash
sudo certbot certificates          # list certs and expiry
sudo certbot renew                 # manually renew
sudo systemctl status certbot.timer  # check auto-renewal timer
```
