# ✅ Tautan ID - Pre-Deployment Checklist

Panduan lengkap untuk verifikasi sebelum deploy ke production. Checklist harus 100% complete sebelum launch.

## 🚀 Pre-Deployment Phase (1-2 hari sebelum launch)

### Security Audit

- [ ] **Secrets Review**
  - [ ] Tidak ada API keys di source code
  - [ ] `.env` file tidak di-commit
  - [ ] `.gitignore` includes `.env`
  - [ ] All secrets in environment variables
  - [ ] Database password tidak di logs

- [ ] **HTTPS Configuration**
  - [ ] SSL certificate valid
  - [ ] Certificate renewal automated (Let's Encrypt)
  - [ ] All HTTP redirects to HTTPS
  - [ ] HSTS header enabled

- [ ] **Authentication Security**
  - [ ] JWT_SECRET changed from default
  - [ ] JWT_SECRET minimum 32 characters
  - [ ] ENCRYPTION_KEY set correctly
  - [ ] 2FA working end-to-end
  - [ ] Account lockout mechanism tested
  - [ ] Password reset token works

- [ ] **CORS Configuration**
  - [ ] CORS origins whitelisted (not *)
  - [ ] Credentials handling correct
  - [ ] Preflight requests working

- [ ] **Rate Limiting**
  - [ ] General API: 100 req/IP/15min ✓
  - [ ] Auth endpoints: 5 req/IP/15min ✓
  - [ ] Payment: 20 req/IP/15min ✓
  - [ ] Testing: Rate limit triggers correctly

- [ ] **Input Validation**
  - [ ] All endpoints validate input
  - [ ] XSS prevention implemented
  - [ ] CSRF tokens on forms
  - [ ] File upload validation (if any)

- [ ] **Data Protection**
  - [ ] Sensitive data encrypted (AES-256)
  - [ ] No sensitive data in logs
  - [ ] Backup encryption configured
  - [ ] PII handled properly

---

### Code Quality

- [ ] **Linting & Formatting**
  - [ ] `npm run lint` passes (0 errors)
  - [ ] `npm run format` applied
  - [ ] No console.log in production code
  - [ ] No TODO comments (or tracked in issues)

- [ ] **Dependencies**
  - [ ] All dependencies up to date
  - [ ] No security vulnerabilities: `npm audit`
  - [ ] Tested with latest versions
  - [ ] Pinned versions (or ~versions)
  - [ ] No unused dependencies

- [ ] **Code Coverage**
  - [ ] Unit tests coverage > 70%
  - [ ] Critical paths tested
  - [ ] Auth tests passing
  - [ ] Error scenarios covered

- [ ] **Error Handling**
  - [ ] All try-catch blocks have handlers
  - [ ] Meaningful error messages
  - [ ] No stack traces in client responses
  - [ ] Global error handler implemented

---

### Database

- [ ] **MongoDB Setup**
  - [ ] Replica set configured (HA)
  - [ ] Backups automated daily
  - [ ] Backup retention: 30 days
  - [ ] Recovery tested
  - [ ] Indexes created and verified

- [ ] **Data Validation**
  - [ ] Mongoose schemas validated
  - [ ] Required fields enforced
  - [ ] Data types correct
  - [ ] Unique constraints working

- [ ] **Seed Data**
  - [ ] Production seed data ready
  - [ ] Sample users created
  - [ ] Sample products created
  - [ ] Test data clearly marked

- [ ] **Migration**
  - [ ] No breaking schema changes
  - [ ] Migration scripts tested
  - [ ] Rollback plan in place
  - [ ] Data backup before migration

---

### Performance

- [ ] **Load Testing**
  - [ ] Load test completed
  - [ ] Target: 500 concurrent users
  - [ ] Response time < 200ms
  - [ ] No errors under load
  - [ ] Database handles load

- [ ] **Database Optimization**
  - [ ] All indexes created
  - [ ] Query performance checked
  - [ ] No N+1 queries
  - [ ] Slow queries identified

- [ ] **CDN & Caching**
  - [ ] Static files cached (30 days+)
  - [ ] API responses cached (if applicable)
  - [ ] Cache headers set
  - [ ] Invalidation strategy ready

- [ ] **Image Optimization**
  - [ ] Images < 200KB (compressed)
  - [ ] WebP format available
  - [ ] Responsive images configured
  - [ ] Lazy loading implemented

---

### Testing

- [ ] **Unit Tests**
  - [ ] `npm test` passes
  - [ ] All test suites running
  - [ ] Coverage report generated
  - [ ] No failing tests

- [ ] **Integration Tests**
  - [ ] End-to-end workflows tested
  - [ ] Auth flow tested
  - [ ] Payment flow tested (mock)
  - [ ] Order creation tested

- [ ] **Manual Testing**
  - [ ] Register new user
  - [ ] Login/logout works
  - [ ] 2FA setup and verification
  - [ ] Create product (supplier)
  - [ ] Browse products (buyer)
  - [ ] Create order
  - [ ] Chat system works
  - [ ] Admin dashboard works

- [ ] **Cross-Browser Testing**
  - [ ] Chrome latest ✓
  - [ ] Firefox latest ✓
  - [ ] Safari latest ✓
  - [ ] Edge latest ✓
  - [ ] Mobile browsers (iOS Safari, Chrome Android)

- [ ] **Responsive Testing**
  - [ ] Desktop (1920x1080) ✓
  - [ ] Tablet (768px) ✓
  - [ ] Mobile (375px) ✓
  - [ ] No horizontal scroll
  - [ ] Touch-friendly buttons

---

### Monitoring & Logging

- [ ] **Error Tracking (Sentry)**
  - [ ] Sentry configured
  - [ ] DSN in environment
  - [ ] Test alert working
  - [ ] Team members have access
  - [ ] Alerts configured

- [ ] **Analytics (Google Analytics)**
  - [ ] GA4 configured
  - [ ] Tracking code installed
  - [ ] Test events firing
  - [ ] Dashboard created
  - [ ] Goals configured

- [ ] **Logging**
  - [ ] Winston/bunyan configured
  - [ ] Log rotation enabled
  - [ ] Sensitive data not logged
  - [ ] Log levels appropriate

- [ ] **Uptime Monitoring**
  - [ ] Ping monitoring active
  - [ ] Health check endpoint working
  - [ ] Alerts if down > 5min
  - [ ] Contact info in alerts

---

### Infrastructure

- [ ] **Environment Variables**
  - [ ] All 30+ variables set
  - [ ] No typos in variable names
  - [ ] Values appropriate for production
  - [ ] Secrets not in logs

- [ ] **Database Connection**
  - [ ] Connection string correct
  - [ ] Username/password correct
  - [ ] Database exists
  - [ ] Backups enabled

- [ ] **Email Configuration**
  - [ ] SMTP credentials correct
  - [ ] From address valid
  - [ ] Test email sends successfully
  - [ ] Reply-to configured

- [ ] **Payment Gateway** (if applicable)
  - [ ] Stripe/Midtrans live credentials
  - [ ] Webhooks configured
  - [ ] Test payment works
  - [ ] Error handling in place

---

### Documentation

- [ ] **README.md**
  - [ ] Installation instructions
  - [ ] Setup guide
  - [ ] API documentation
  - [ ] Deployment instructions

- [ ] **API Documentation**
  - [ ] All endpoints documented
  - [ ] Request/response examples
  - [ ] Error codes documented
  - [ ] Authentication explained

- [ ] **Runbooks**
  - [ ] How to deploy
  - [ ] How to rollback
  - [ ] How to scale
  - [ ] Emergency procedures

- [ ] **Architecture Documentation**
  - [ ] System design diagram
  - [ ] Data flow documented
  - [ ] Technology choices explained
  - [ ] Scaling strategy

---

## 📋 Deployment Phase (Day of launch)

### Pre-Deployment Verification (4 hours before)

- [ ] **Final Code Review**
  - [ ] Code reviewed by 2+ people
  - [ ] No red flags
  - [ ] Ready for production

- [ ] **Backup & Recovery Test**
  - [ ] Database backed up
  - [ ] Backup restoration tested
  - [ ] Recovery time acceptable
  - [ ] Disaster recovery plan ready

- [ ] **Load Testing Final**
  - [ ] Repeat load test
  - [ ] Consistent results
  - [ ] Database holds under load

- [ ] **Staging Deployment**
  - [ ] Deploy to staging first
  - [ ] Run full test suite
  - [ ] Manual testing on staging
  - [ ] Everything working

---

### Deployment Execution

**1. Pre-Deployment Notification**
- [ ] Notify stakeholders (2 hours before)
- [ ] Slack channel update
- [ ] Expected downtime: ~15-30 minutes
- [ ] Emergency contacts listed

**2. Database Backup**
```bash
# Backup production database
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/tautan-id" \
  --archive=backup-$(date +%Y%m%d-%H%M%S).gz --gzip

# Verify backup
ls -lh backup-*.gz
```

**3. Deploy Backend**
```bash
# Via Vercel
vercel --prod

# Or via manual deployment
git checkout main
git pull origin main
npm install --production
npm run build
pm2 restart tautan-id
```

**4. Deploy Frontend**
```bash
# Frontend deployment
vercel --prod

# Or manual
npm run build
# Upload to S3/CDN
```

**5. Run Migrations** (if any)
```bash
# Database migrations
npm run migrate

# Verify schema
mongo < verify-schema.js
```

**6. Verify Deployment**
- [ ] Health check: `/health` returns 200
- [ ] API endpoints responding
- [ ] Database queries working
- [ ] Authentication system working
- [ ] No error logs in Sentry

**7. Smoke Test**
```bash
# Test critical flows
curl -X GET https://api.tautan-id.com/health
curl -X POST https://api.tautan-id.com/api/auth/login \
  -d '{"email":"test@example.com","password":"..."}' \
  -H "Content-Type: application/json"
```

**8. Post-Deployment Notification**
- [ ] Notify stakeholders: Deployment complete ✓
- [ ] Update status page
- [ ] Slack channel: success message
- [ ] Monitor closely for 1 hour

---

## 🔍 Post-Deployment Verification

### First Hour (Critical)

- [ ] **Error Monitoring**
  - [ ] Check Sentry for new errors
  - [ ] No critical errors
  - [ ] Error rate normal

- [ ] **Performance Monitoring**
  - [ ] API response times < 200ms
  - [ ] Database query times normal
  - [ ] CPU usage < 70%
  - [ ] Memory usage normal

- [ ] **User Telemetry**
  - [ ] Users can register
  - [ ] Users can login
  - [ ] No 5xx errors
  - [ ] GA events tracking

- [ ] **Database Health**
  - [ ] Connection pool normal
  - [ ] Queries completing
  - [ ] No locks or timeouts
  - [ ] Backup running

---

### First Day Monitoring

**Every 30 minutes:**
- [ ] Check error logs
- [ ] Monitor CPU/Memory
- [ ] Watch API latency
- [ ] Monitor database

**Every 4 hours:**
- [ ] Review user feedback
- [ ] Check error trends
- [ ] Monitor revenue (if applicable)
- [ ] Customer support tickets

**At end of day:**
- [ ] Daily report generated
- [ ] Issues documented
- [ ] Hotfixes applied (if needed)
- [ ] Team debrief

---

### First Week Monitoring

**Daily:**
- [ ] Error rate stable
- [ ] Performance metrics stable
- [ ] User growth rate normal
- [ ] Database performance good

**End of week:**
- [ ] Week 1 report
- [ ] Identify issues
- [ ] Plan improvements
- [ ] Document learnings

---

## ⚠️ Rollback Procedure

If critical issues found:

**Immediate Actions (First 5 minutes):**
- [ ] Declare incident
- [ ] Create war room (Slack/Teams)
- [ ] Notify stakeholders
- [ ] Gather current state info

**Decision (5-15 minutes):**
- [ ] Severity assessment
- [ ] Can fix quickly? (try fix)
- [ ] Otherwise? (rollback)

**Rollback (15-30 minutes):**
```bash
# Option 1: Git rollback
git revert HEAD
git push origin main
vercel --prod

# Option 2: Database rollback
mongorestore --archive=backup-20240101-120000.gz --gzip

# Option 3: Manual rollback
# Revert to previous version
pm2 restart tautan-id --use-previous
```

**Verification:**
- [ ] Rollback complete
- [ ] Services responding
- [ ] No errors
- [ ] Users notified

**Post-Rollback:**
- [ ] Root cause analysis
- [ ] Fix tested in staging
- [ ] Deploy again (properly)
- [ ] Incident report

---

## 📊 Launch Day Metrics

**Target Metrics to Monitor:**

| Metric | Target | Action if exceeds |
|--------|--------|------------------|
| Error Rate | < 0.5% | Page down? Investigation |
| P95 Latency | < 500ms | Performance review |
| CPU Usage | < 80% | Scale or optimize |
| Memory Usage | < 85% | Restart or scale |
| Database Connections | < 80 max | Scale or optimize |
| Failed Registrations | < 1% | Check auth system |
| Failed Orders | < 0.1% | Check payment system |

---

## 🎯 Success Criteria

Deployment considered successful when:

✅ **Functionality**
- All features working
- No critical bugs
- Users can complete workflows

✅ **Performance**
- Response time < 200ms (p95)
- Error rate < 0.5%
- Uptime 100% (in first day)

✅ **User Experience**
- No customer complaints
- Analytics tracking working
- Mobile responsive

✅ **Security**
- No security incidents
- SSL working
- No data breaches

✅ **Monitoring**
- All alerts firing correctly
- Logs being collected
- Backup verified

---

## 📝 Deployment Log Template

```markdown
# Deployment Log - [Date]

## Pre-Deployment
- Time: [00:00 UTC]
- Deployed by: [Name]
- Version: [v2.9.0]
- Environments: [staging → production]

## Changes
- [Summary of changes]
- [Bug fixes]
- [New features]

## Deployment Status
| Component | Status | Time |
|-----------|--------|------|
| Backend | ✅ Success | [00:15] |
| Frontend | ✅ Success | [00:20] |
| Database | ✅ Success | [00:05] |
| Migrations | ✅ Success | [00:10] |

## Rollback: [Not needed / Executed]

## Metrics (Post-Deployment)
- Error Rate: [0.2%]
- Latency P95: [120ms]
- CPU: [45%]
- Memory: [62%]

## Issues Found
- [Issue 1]: Resolution
- [Issue 2]: Resolution

## Lessons Learned
- [Learning 1]
- [Learning 2]

## Sign-off
- DevOps: [Name] ✓
- Backend Lead: [Name] ✓
- Product: [Name] ✓
```

---

## ✅ Launch Checklist Summary

**Before Deploy:**
- [ ] Code reviewed and tested
- [ ] Security audit passed
- [ ] Performance tested
- [ ] Database backed up
- [ ] Staging verified

**During Deploy:**
- [ ] Deployment smooth
- [ ] Health checks passing
- [ ] Smoke tests successful
- [ ] Team monitoring

**After Deploy:**
- [ ] Error rate normal
- [ ] Users happy
- [ ] Metrics stable
- [ ] Incident-free

---

**Ready to Deploy? All items checked? GO! 🚀**

Last Updated: December 2024
Version: 2.9.0
