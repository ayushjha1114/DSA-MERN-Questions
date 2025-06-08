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




# Common Authentication Protocols and Mechanisms

Modern applications use a variety of authentication protocols and mechanisms, each suited to different use cases, complexity levels, and integration needs. Below are the most common ones:

---

### 1. OAuth 2.0 (Authorization Framework) 🔐
- **Purpose:** Delegated authorization (not authentication, though often confused).
- **Use Case:** Allowing users to authorize third-party apps to access their data (e.g., "Login with Google").
- **Common With:** Often paired with OIDC for authentication.
- **Examples:** GitHub, Google APIs, Facebook Graph API.

---

### 2. SAML 2.0 (Security Assertion Markup Language) 🛂
- **Purpose:** Federated authentication and single sign-on (SSO), mainly for enterprises.
- **Use Case:** Authenticating with corporate identity providers (e.g., Okta, Azure AD).
- **Examples:** Salesforce, Microsoft Office 365, AWS SSO.

---

### 3. LDAP (Lightweight Directory Access Protocol) 🔑
- **Purpose:** Authentication and user lookup against a directory service.
- **Use Case:** Internal systems (e.g., corporate intranet), legacy enterprise apps.
- **Often Used With:** Active Directory, OpenLDAP.
- **Note:** Not token-based; usually password-based verification.

---

### 4. Basic Authentication 🧾
- **Purpose:** Username and password in HTTP headers (Base64 encoded).
- **Use Case:** Simple or internal API testing.
- **Warning:** Not secure unless used over HTTPS. Not recommended for production.

---

### 5. JWT (JSON Web Token) 📄
- **Purpose:** Token format, not a protocol; commonly used with OAuth2/OIDC.
- **Use Case:** Stateless authentication for APIs.
- **Note:** Often used in custom or semi-standard implementations.

---

### 6. Custom Token-Based Authentication 🧩
- **Purpose:** Application-specific authentication using signed tokens (not necessarily JWT).
- **Use Case:** Internal microservices, bespoke authentication flows.
- **Risk:** Hard to implement securely—prefer standardized protocols.

---

### 7. API Key Authentication 📶
- **Purpose:** Simple token-based mechanism using a static key.
- **Use Case:** Machine-to-machine communication or public APIs.
- **Downside:** No user context; not easily revocable or expirable unless managed.

---

### 8. Client Certificates (Mutual TLS / mTLS) 👁️
- **Purpose:** Authenticate clients via SSL/TLS certificates.
- **Use Case:** High-security B2B integrations, banking, defense.
- **Implementation:** Requires CA, certificate provisioning, and strict infrastructure controls.

---

### 9. Biometrics / Device-Based Authentication 🧬
- **Purpose:** Authentication using fingerprint, face ID, or secure device tokens.
- **Use Case:** Mobile apps (e.g., banking), WebAuthn.
- **Standard:** Often integrated with FIDO2 and WebAuthn protocols.

---

### 10. WebAuthn / FIDO2 🌐
- **Purpose:** Passwordless authentication using device biometrics or hardware keys.
- **Use Case:** High-security login without passwords.
- **Examples:** Google, GitHub, Microsoft.

---

## Summary Table

| Protocol            | Type             | User-Based | Token-Based | Common Use Case               |
|---------------------|------------------|:----------:|:-----------:|------------------------------|
| OAuth2              | Authorization    | No (needs OIDC) | ✅        | 3rd-party app access         |
| OpenID Connect      | Authentication   | ✅         | ✅          | Login via Google, Microsoft  |
| SAML                | Authentication   | ✅         | SAML assertions | Enterprise SSO           |
| LDAP                | Authentication   | ✅         | ❌          | Intranet logins, legacy      |
| Basic Auth          | Authentication   | ✅         | ❌          | Dev-only, quick testing      |
| JWT                 | Token Format     | ✅ (via context) | ✅      | Stateless API auth           |
| API Key             | Access Control   | ❌         | ✅          | M2M, public APIs             |
| Client Cert (mTLS)  | Authentication   | ❌         | ✅ (via cert) | Secure B2B                 |
| WebAuthn / FIDO2    | Authentication   | ✅         | ✅ (signed)  | Passwordless login           |




## 🧠 Why Was OAuth 1.0 Developed?

### ✅ Core Problem
> How can an app access my account data (like Gmail or Twitter) without me giving it my password?

### 💥 Real-World Issue (Pre-OAuth)
- Apps asked for your username and password for another service (like Twitter).
- They stored your credentials and acted on your behalf.

**Total security nightmare:**
- No granular permissions.
- Could read/write/delete anything.
- Couldn’t revoke just that app — had to change your password.

### 🎯 OAuth 1.0 Solution (2007)
- Created a delegated authorization protocol.
- Apps could get access tokens instead of passwords.
- Users could authorize access without sharing credentials.

---

## 🧠 Why Was OAuth 2.0 Developed?

### ✅ Core Problem
> OAuth 1.0 was too complex, hard to implement, and inflexible.

### 🛠 Issues with OAuth 1.0
- Required cryptographic signing (HMAC-SHA1).
- Lots of boilerplate and transport-layer complexity.
- No native support for web, mobile, or single-page apps.

### 🎯 OAuth 2.0 (2012) Goals
- Simpler and more flexible.
- Support for:
    - Web apps
    - Native mobile apps
    - Single-page applications (SPAs)
    - Machine-to-machine communication
- Introduced:
    - Access token types (opaque, JWT)
    - Scopes for granular permission control
    - Multiple grant types (authorization code, client credentials, etc.)

---

## 🧠 Why Was OpenID Connect Developed?

### ✅ Core Problem
> OAuth 2.0 tells you what a user can do — but not who they are.

### 🔥 Real-World Issue
- Apps wanted users to log in via Google/Facebook.
- Developers misused OAuth 2.0 to identify users.
- OAuth 2.0 is for authorization, not authentication.

### 🎯 OpenID Connect Solution (2014)
- Layered on top of OAuth 2.0.
- Standardized a secure way to:
    - Authenticate users
    - Get user identity and profile
    - Use ID tokens (JWTs) to prove identity
- Includes:
    - `/userinfo` endpoint
    - Standard scopes like `openid`, `email`, `profile`







# Node.js Implementations for OAuth 2.0, OpenID Connect, and SAML

This guide covers practical Node.js implementations for:

- **OAuth 2.0** (Authorization)
- **OpenID Connect** (Authentication)
- **SAML** (Enterprise SSO Authentication)

Each section includes a use case, recommended libraries, flow overview, and sample code.

---

## ✅ 1. OAuth 2.0 (Delegated Access)

**Use Case:**  
A Node.js app accesses a user's Google Drive files.

**Libraries:**
- `passport`
- `passport-google-oauth20`
- `express`

**Flow:**
1. User logs in via Google.
2. Your app receives an access token.
3. Your app uses the token to call the Google Drive API.

**Sample Code:**
```js
// app.js
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => {
    // Save token and user profile
    return cb(null, { profile, accessToken });
}));

const app = express();
app.use(passport.initialize());

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.readonly']
}));

app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    res.json(req.user); // Contains accessToken
});
```

---

## ✅ 2. OpenID Connect (Login with Identity)

**Use Case:**  
"Login with Google/Microsoft" in a Node.js web app.

**Libraries:**
- `openid-client` (official OpenID certified library)
- `express`

**Flow:**
1. Use `openid-client` to discover provider config.
2. Redirect user to login.
3. Receive an ID token (JWT) with identity info.

**Sample Code:**
```js
const { Issuer, Strategy } = require('openid-client');
const express = require('express');
const passport = require('passport');

(async () => {
    const googleIssuer = await Issuer.discover('https://accounts.google.com');
    const client = new googleIssuer.Client({
        client_id: 'GOOGLE_CLIENT_ID',
        client_secret: 'GOOGLE_CLIENT_SECRET',
        redirect_uris: ['http://localhost:3000/auth/cb'],
        response_types: ['code']
    });

    passport.use('oidc', new Strategy({ client }, (tokenSet, userinfo, done) => {
        return done(null, { id_token: tokenSet.id_token, userinfo });
    }));

    const app = express();
    app.use(passport.initialize());

    app.get('/login', passport.authenticate('oidc'));
    app.get('/auth/cb', passport.authenticate('oidc', { session: false }), (req, res) => {
        res.json(req.user); // Contains ID token and user info
    });

    app.listen(3000);
})();
```

### Step-by-Step: Verify User Identity with OpenID Connect

**Libraries:**  
- `openid-client` (official certified OpenID Connect client)

#### 1. Install dependencies
```bash
npm install openid-client express
```

#### 2. Set up your OIDC client (e.g., with Google)
```js
// auth.js
const { Issuer } = require('openid-client');

async function setupClient() {
    const issuer = await Issuer.discover('https://accounts.google.com');
    const client = new issuer.Client({
        client_id: 'GOOGLE_CLIENT_ID',
        client_secret: 'GOOGLE_CLIENT_SECRET',
        redirect_uris: ['http://localhost:3000/callback'],
        response_types: ['code'],
    });
    return client;
}

module.exports = setupClient;
```

#### 3. Create the auth flow
```js
// server.js
const express = require('express');
const setupClient = require('./auth');
const session = require('express-session');
const { generators } = require('openid-client');

const app = express();
app.use(session({ secret: 'some-secret', resave: false, saveUninitialized: true }));

(async () => {
    const client = await setupClient();

    app.get('/login', (req, res) => {
        const code_verifier = generators.codeVerifier();
        const code_challenge = generators.codeChallenge(code_verifier);
        req.session.code_verifier = code_verifier;

        const authUrl = client.authorizationUrl({
            scope: 'openid email profile',
            code_challenge,
            code_challenge_method: 'S256',
        });

        res.redirect(authUrl);
    });

    app.get('/callback', async (req, res) => {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback('http://localhost:3000/callback', params, {
            code_verifier: req.session.code_verifier,
        });

        const userinfo = await client.userinfo(tokenSet.access_token);

        // ID token has already been verified internally
        console.log('ID Token Claims:', tokenSet.claims());
        console.log('User Info:', userinfo);

        res.send(`Hello ${userinfo.name}, your email is ${userinfo.email}`);
    });

    app.listen(3000, () => console.log('Listening on http://localhost:3000'));
})();
```

#### What’s Verified by `openid-client`?
- Fetches OIDC discovery config
- Retrieves and caches provider’s public keys (JWKs)
- Verifies ID token signature
- Validates claims: `iss`, `aud`, `exp`, `nonce` (if used)

**ID Token Sample Payload:**
```json
{
    "sub": "1234567890",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "iss": "https://accounts.google.com",
    "aud": "GOOGLE_CLIENT_ID",
    "exp": 1712345678
}
```

**Summary:**  
OIDC is an identity layer built on OAuth 2.0.  
You verify identity by:
- Redirecting the user to log in
- Getting an ID token (JWT)
- Verifying it using a secure client (`openid-client`)
- Extracting user info (`sub`, `email`, `name`) from the token

---

## ✅ 3. SAML (Enterprise SSO)

**Use Case:**  
Corporate SSO login to your app via Okta or Azure AD.

**Libraries:**
- `passport-saml`
- `express`

**Flow:**
1. User is redirected to Identity Provider (IdP) (e.g., Okta).
2. IdP authenticates and POSTs a SAML Assertion (XML) to your ACS (callback endpoint).

**Sample Code:**
```js
const express = require('express');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

passport.use(new SamlStrategy({
    path: '/login/callback',
    entryPoint: 'https://idp.example.com/sso',
    issuer: 'your-app-entity-id',
    cert: 'YOUR_IDP_CERT_HERE'
}, (profile, done) => {
    return done(null, profile);
}));

const app = express();
app.use(passport.initialize());

app.get('/login', passport.authenticate('saml', { session: false }));
app.post('/login/callback', passport.authenticate('saml', { failureRedirect: '/', session: false }), (req, res) => {
    res.json(req.user); // SAML profile data
});
```


# ✅ OpenID Connect Authentication Flow (Authorization Code Flow)

## 🎭 Roles

- **User:** The person logging in.
- **Relying Party (RP):** Your app (Node.js backend).
- **Identity Provider (IdP):** Google, Auth0, Okta, Azure AD, etc.

---

## 🧭 Step-by-Step OIDC Flow

### 1. User clicks "Login with Google"

Your app redirects the user to the IdP’s authorization endpoint.

**Example redirect URL:**

```
https://accounts.google.com/o/oauth2/v2/auth?
    client_id=YOUR_CLIENT_ID
    &redirect_uri=https://yourapp.com/callback
    &response_type=code
    &scope=openid email profile
    &state=xyz
    &code_challenge=abc
    &code_challenge_method=S256
```

---

### 2. User authenticates at IdP

- User enters credentials (username/password, SSO, biometrics, etc.).
- May approve app access if it’s the first time.

**If successful, the IdP redirects to your app’s callback URL:**

```
https://yourapp.com/callback?code=AUTH_CODE&state=xyz
```

---

### 3. Your server exchanges code for tokens

Your backend (Node.js) sends a POST request to the token endpoint with:

- `code`
- `code_verifier`
- `client_id`, `client_secret`
- `redirect_uri`

**Token response includes:**

- **ID Token (JWT):** Proves user's identity
- **Access Token:** (optional) To call APIs
- **Refresh Token:** (if requested)

---

### 4. Verify the ID Token

Your app verifies the ID token:

- **Signature:** Using the IdP's public key (via JWKS)
- **Claims:**
    - `iss` = identity provider's URL
    - `aud` = your `client_id`
    - `exp` = not expired

**If valid, the user is authenticated.**

---

### 5. Extract user identity

From the ID Token claims or the `/userinfo` endpoint:

```json
{
    "sub": "1234567890",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "picture": "https://..."
}
```

---

### 6. Create session or JWT for your app

Store the user’s identity (usually `sub`) in your local session or issue your own app-specific JWT.

**Now the user is logged in!**

---

## 🧠 Visual Summary

```
[User] ───(click login)──▶ [Your App (RP)]
                 └──redirects──▶ [Identity Provider (IdP)]
                                                └──user logs in─┐
                                                                            ▼
                                        IdP redirects with ?code
                                                    ▼
         [Your App] ──(exchanges code)──▶ [IdP Token Endpoint]
                                                ◀── ID Token (JWT) + Access Token
                                                    ▼
                         [Your App verifies ID Token]
                                                    ▼
                                     ✅ User is authenticated
```

