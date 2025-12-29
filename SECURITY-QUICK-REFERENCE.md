# Security Quick Reference

## 🚀 Quick Setup (Production)

```bash
# 1. Generate secure password hash
cd project
node scripts/generate-password-hash.js YourSecurePassword123!

# 2. Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Update .env file
nano .env  # or use your editor

# Add these lines:
ADMIN_PASSWORD_HASH=<paste-from-step-1>
JWT_SECRET=<paste-from-step-2>

# 4. Test login
npm run dev
# Visit http://localhost:3000/admin/login
```

## 🛡️ Security Features Implemented

| Feature | Status | Description |
|---------|--------|-------------|
| **Brute Force Protection** | ✅ | Rate limiting + account lockout |
| **Password Hashing** | ✅ | Bcrypt with 12 salt rounds |
| **Timing Attack Prevention** | ✅ | Constant-time comparison |
| **Session Hijacking Prevention** | ✅ | IP + User-Agent validation |
| **XSS Protection** | ✅ | HTTP-only cookies + CSP headers |
| **CSRF Protection** | ✅ | SameSite=strict cookies |
| **SQL/NoSQL Injection** | ✅ | Input sanitization |
| **Bot Protection** | ✅ | Honeypot fields |
| **Clickjacking Protection** | ✅ | X-Frame-Options: DENY |
| **HTTPS Enforcement** | ✅ | Auto-redirect + HSTS |
| **Audit Logging** | ✅ | All auth events logged |
| **Rate Limiting** | ✅ | IP-based limits |
| **Input Validation** | ✅ | Zod schemas + sanitization |
| **Security Headers** | ✅ | 10+ security headers |
| **User Enumeration Prevention** | ✅ | Generic error messages |

## 📊 Security Metrics

- **Failed Login Lockout**: 5 attempts = 30 min block
- **Rate Limit**: 10 attempts per IP / 15 min
- **Session Duration**: 7 days
- **Password Complexity**: 12+ chars, mixed case, numbers, symbols
- **Minimum Login Time**: 1 second (timing attack prevention)
- **Audit Log Retention**: Last 1000 events

## 🔐 Attack Vectors Covered

### ✅ Fully Protected
- Brute force attacks
- Credential stuffing
- Timing attacks
- Session hijacking
- Session fixation
- CSRF (Cross-Site Request Forgery)
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME type confusion
- SQL/NoSQL injection
- Command injection
- Path traversal attacks
- User enumeration
- Bot attacks
- Man-in-the-middle attacks
- Replay attacks
- Basic DDoS

### 🟡 Partially Protected
- Advanced DDoS (CDN recommended)
- Zero-day exploits (keep dependencies updated)

### ⏺ Not Yet Implemented (Optional)
- 2FA/MFA
- Hardware key support
- Geolocation blocking
- Advanced device fingerprinting
- CAPTCHA (simple honeypot used instead)

## 🔍 Monitoring

### View Audit Logs
```bash
# In browser (after logging in):
curl http://localhost:3000/api/admin/audit-logs \
  -H "Cookie: admin_token=<your-token>"

# Or check server console logs
```

### Events Logged
- `LOGIN_SUCCESS` - Successful login
- `LOGIN_FAILED` - Failed login attempt
- `LOGIN_ATTEMPT_BLOCKED` - Blocked by rate limit
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `BOT_DETECTED` - Honeypot triggered
- `LOGIN_ERROR` - Internal error
- `SESSION_HIJACK_ATTEMPT` - Suspicious session

## 🚨 Incident Response

If you detect a security breach:

```bash
# 1. Immediately rotate credentials
node scripts/generate-password-hash.js NewPassword456!

# 2. Invalidate all sessions
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Update JWT_SECRET in .env

# 3. Check audit logs
# Review /api/admin/audit-logs for suspicious activity

# 4. Review content changes
git log --all -- content/

# 5. Update all API keys
# Regenerate GitHub token, Formspree endpoint, etc.
```

## 📝 Daily Operations

### Update Admin Password
```bash
# 1. Generate new hash
node scripts/generate-password-hash.js NewPassword789!

# 2. Update .env
ADMIN_PASSWORD_HASH=<new-hash>

# 3. Restart server
npm run dev
```

### Check for Vulnerabilities
```bash
npm audit
npm update
```

### Backup Content
```bash
# Content is in /content directory
# Set up GitHub integration for automatic backups
```

## 🎯 Penetration Testing

Test these scenarios:

1. **Brute Force Test**
   - Make 10 rapid login attempts
   - Verify lockout after 5 failures
   - Verify 30-minute block duration

2. **Session Test**
   - Log in from one IP
   - Try using token from different IP (should fail if STRICT_IP_VALIDATION=true)
   - Change User-Agent (should fail if STRICT_UA_VALIDATION=true)

3. **XSS Test**
   - Try injecting `<script>alert('xss')</script>` in content
   - Verify it's escaped/sanitized

4. **CSRF Test**
   - Try making requests from different origin
   - Verify SameSite cookie blocks it

5. **Timing Attack Test**
   - Measure response times for valid/invalid passwords
   - Verify consistent ~1 second response

## 📚 References

- Full security documentation: [SECURITY.md](./SECURITY.md)
- Configuration guide: [README.md](./README.md)
- Content management: [CONTENT_GUIDE.md](./CONTENT_GUIDE.md)

---

**Security Level**: Enterprise-Grade
**Last Updated**: December 2024
**Compliance**: OWASP Top 10
