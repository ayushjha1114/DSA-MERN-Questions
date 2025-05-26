# OWASP API Security Top 10

A practical guide to the OWASP API Security Top 10, including definitions, real-world examples, and mitigation strategies.

---

## Summary Table

| Risk ID | Name                              | Description & Example                                                                                                                                         | Mitigation                                                                                                                                                                                                                 |
| ------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API1    | Broken Object Level Authorization | **What:** Users access/modify others’ data by tampering with object IDs.<br>**Example:** GET `/api/users/1234/orders` → attacker changes `1234` to `5678`.    | - Enforce per-request authorization checks.<br>- Use indirect references or ACLs.<br>- Default to deny if checks are missing.                                                        |
| API2    | Broken Authentication             | **What:** Weak authentication lets attackers assume other identities.<br>**Example:** No rate-limit on login, attacker brute-forces admin password.           | - Strong credential policies, MFA, CAPTCHAs.<br>- Rate-limit login attempts.<br>- Use secure, expiring tokens.                                                                       |
| API3    | Excessive Data Exposure           | **What:** APIs return more data than needed.<br>**Example:** GET `/api/users/123` returns SSN, credit card, internal flags.                                   | - Whitelist response fields.<br>- Use DTOs/serializers.<br>- Filter responses by user role/scope.                                                                                    |
| API4    | Lack of Resources & Rate Limiting | **What:** No throttling/quotas, vulnerable to DoS.<br>**Example:** Attacker floods `/api/search` with millions of queries.                                    | - Rate limiting per IP/user.<br>- Enforce quotas via API Gateway.<br>- Set request size limits, timeouts, circuit breakers.                                                          |
| API5    | Broken Function Level Authorization | **What:** Users invoke privileged functions.<br>**Example:** Normal user calls `/api/admin/disableUser` due to missing role check.                            | - RBAC/ABAC checks on endpoints.<br>- Separate admin/user APIs.<br>- Use middleware/gateway policies.                                                                                |
| API6    | Mass Assignment                   | **What:** APIs bind client JSON to models without filtering.<br>**Example:** User sends `{ "isAdmin": true }` and gains admin rights.                         | - Whitelist accepted fields.<br>- Ignore unexpected payload fields.<br>- Use validation libraries to strip disallowed properties.                                                    |
| API7    | Security Misconfiguration         | **What:** Poorly configured controls (CORS, headers, SSL).<br>**Example:** CORS set to `*`, any site can make credentialed requests.                          | - Harden defaults, disable debug endpoints.<br>- Restrict CORS, enforce HTTPS, set security headers.                                                                                |
| API8    | Injection                         | **What:** Unvalidated input allows malicious commands.<br>**Example:** `/api/products?category='; DROP TABLE users; --` executes SQL.                         | - Use parameterized queries/ORM.<br>- Validate/sanitize input.<br>- Employ WAF/API gateway filters.                                                                                  |
| API9    | Improper Assets Management        | **What:** Exposed/forgotten endpoints.<br>**Example:** Deprecated `/api/v1/debug` enabled in production, reveals internals.                                   | - Maintain API inventory (OpenAPI spec).<br>- Remove unused endpoints.<br>- Automated scans in CI/CD.                                                                               |
| API10   | Insufficient Logging & Monitoring | **What:** Failure to log/monitor security events.<br>**Example:** No logs for failed logins, credential stuffing goes unnoticed.                              | - Log all auth/data access events.<br>- Centralize logs, set up alerts.<br>- Regularly review logs and audit.                                                                        |

---

## Practical Mitigations & Code Examples

### API1: Broken Object Level Authorization

**Mitigation:** Always verify the authenticated user owns or is allowed to access the resource.

```js
// middleware/authorizeOwner.js
module.exports = (model, idParam = 'id') => async (req, res, next) => {
    const resource = await model.findById(req.params[idParam]);
    if (!resource) return res.status(404).send('Not found');
    if (resource.owner.toString() !== req.user.sub)
        return res.status(403).send('Forbidden');
    req.resource = resource;
    next();
};

// Usage in route
const Post = require('./models/Post');
const authorizePostOwner = require('./middleware/authorizeOwner')(Post, 'postId');
app.get('/posts/:postId', authenticateJWT, authorizePostOwner, (req, res) => {
    res.json(req.resource);
});
```

---

### API2: Broken Authentication

**Mitigation:** Enforce strong passwords, MFA, and rate-limit login attempts.

```js
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later'
});
app.post('/login', loginLimiter, async (req, res) => {
    // validate credentials, issue JWT
});
```

---

### API3: Excessive Data Exposure

**Mitigation:** Only serialize and return fields you want to expose.

```js
// models/User.js
const userSchema = new mongoose.Schema({ email: String, passwordHash: String, ssn: String, name: String });
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.passwordHash;
    delete obj.ssn;
    return obj;
};
module.exports = mongoose.model('User', userSchema);

// Route
app.get('/users/:id', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user); // toJSON strips sensitive fields
});
```

---

### API4: Lack of Resources & Rate Limiting

**Mitigation:** Apply rate limiting per IP/user on expensive endpoints.

```js
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: 'Too many requests'
});
app.use('/api/', apiLimiter);
```

---

### API5: Broken Function Level Authorization

**Mitigation:** Enforce roles/scopes for privileged operations.

```js
// middleware/checkRole.js
module.exports = requiredRole => (req, res, next) => {
    if (!req.user.roles.includes(requiredRole))
        return res.status(403).send('Forbidden');
    next();
};

// Usage
app.post('/admin/disableUser', authenticateJWT, checkRole('admin'), (req, res) => {
    // disable logic
});
```

---

### API6: Mass Assignment

**Mitigation:** Whitelist allowed body properties before saving.

```js
// utils/sanitize.js
module.exports = (obj, allowedFields) => {
    return Object.keys(obj)
        .filter(key => allowedFields.includes(key))
        .reduce((acc, key) => { acc[key] = obj[key]; return acc }, {});
};

// Route
app.post('/users', authenticateJWT, (req, res) => {
    const data = sanitize(req.body, ['name', 'email', 'password']);
    const user = new User(data);
    await user.save();
    res.status(201).json(user);
});
```

---

### API7: Security Misconfiguration

**Mitigation:** Harden headers, disable debug in production, lock down CORS.

```js
const helmet = require('helmet');
app.use(helmet());

const cors = require('cors');
app.use(cors({ origin: 'https://yourtrusteddomain.com' }));

if (process.env.NODE_ENV === 'production') {
    app.disable('x-powered-by');
}
```

---

### API8: Injection

**Mitigation:** Always use parameterized queries or an ORM/ODM.

```js
const { Pool } = require('pg');
const pool = new Pool();

app.get('/products', authenticateJWT, async (req, res) => {
    const { category } = req.query;
    const result = await pool.query(
        'SELECT * FROM products WHERE category = $1',
        [category]
    );
    res.json(result.rows);
});
```

---

### API9: Improper Assets Management

**Mitigation:** Remove/protect unused endpoints; maintain an OpenAPI spec.

```yaml
# openapi.yaml excerpt
paths:
    /debug:
        x-hidden: true
```

```js
// At startup, disable hidden routes
const spec = require('./openapi.yaml');
for (const [path, config] of Object.entries(spec.paths)) {
    if (config['x-hidden']) {
        app._router.stack = app._router.stack.filter(r => r.route?.path !== path);
    }
}
```

---

### API10: Insufficient Logging & Monitoring

**Mitigation:** Log security events and failures, centralize logs.

```js
const winston = require('winston');
const logger = winston.createLogger({ transports: [ new winston.transports.Console() ] });

// In auth middleware
async function authenticateJWT(req, res, next) {
    try {
        // verify token
        next();
    } catch (err) {
        logger.warn(`Auth failed for IP ${req.ip}: ${err.message}`);
        return res.status(401).send('Unauthorized');
    }
}

// In routes
app.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.url} – ${err.stack}`);
    res.status(500).send('Internal Server Error');
});
```

---

## Key Takeaways

- **Middleware Layer:** Auth, rate limiting, CORS, error handling.
- **Model Layer:** Safe serialization, whitelisting.
- **DAL/ORM:** Parameterized queries.
- **Logging:** At every security checkpoint.

---

## Concise Summary

- **API1:** Unauthorized access via object ID manipulation.
- **API2:** Weak/missing authentication controls.
- **API3:** Overexposed data in API responses.
- **API4:** No throttling/quotas → DoS risk.
- **API5:** Privileged operations exposed to unauthorized users.
- **API6:** Blindly binding client payloads to models.
- **API7:** Insecure defaults/misconfigured headers/CORS/SSL.
- **API8:** Unvalidated input → code/command injection.
- **API9:** Forgotten/undocumented endpoints left exposed.
- **API10:** Lack of logging/monitoring delays breach detection.

