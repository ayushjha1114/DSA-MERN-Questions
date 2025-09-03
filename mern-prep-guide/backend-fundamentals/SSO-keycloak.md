# 🔐 SSO Flow with Keycloak – End-to-End Summary

## 1. User Authentication via Keycloak
- User logs in via Keycloak (OIDC flow).
- Keycloak redirects back with `access_token`, `id_token`, and optionally `refresh_token`.

## 2. Frontend: Token Handling
- **Access Token Storage:**
  - **Recommended:** HttpOnly, Secure cookie (prevents XSS access).
  - **Alternative:** In-memory (cleared on refresh). Avoid `localStorage`.
- **Axios Interceptor:** Adds token to every API request:

  ```ts
  axios.interceptors.request.use((config) => {
    const token = getAccessToken(); // from cookie or in-memory
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```

- **Token TTL:** 5–15 minutes (short-lived for safety).
- Use `refresh_token` (in-memory or HttpOnly) + silent renew for re-authentication.

## 3. Backend: Token Verification
- API receives the `Authorization: Bearer <access_token>` header.
- Uses:
  - `jsonwebtoken` to verify the JWT signature and decode claims.
  - `jwks-rsa` to fetch and cache Keycloak's public keys.
- **Public key is retrieved from:**
  ```
  https://<keycloak-domain>/realms/<realm-name>/.well-known/openid-configuration
    ↳ jwks_uri: .../protocol/openid-connect/certs
  ```
- Signature, expiry, issuer, and audience are all verified in middleware.

## 4. Access Control & Security
- Backend uses claims like:
  - `sub` (user ID)
  - `realm_access.roles` (RBAC)
  - `exp` (expiration time)
- Backend does **not** accept tokens without verifying signature and claims.
- Backend does **not** store refresh tokens.
- All traffic is over **HTTPS only**.

## 5. Logout Flow (Optional)
- Frontend calls Keycloak's `end_session_endpoint`.
- Clears cookie/session in frontend.
- Backend can revoke refresh tokens (if applicable).

---

## 🧠 Key Security Practices

| Area           | Practice                                               |
|----------------|--------------------------------------------------------|
| Token storage  | Use HttpOnly and Secure cookies or in-memory           |
| Token TTL      | Short-lived access tokens (5–15 min)                   |
| HTTPS          | Mandatory – never expose tokens over HTTP              |
| CORS           | Restrict backend to known frontend origins             |
| XSS            | Prevent XSS to protect in-memory/cookie tokens         |
| Token validation | Always verify signature + claims (issuer, exp, audience) |



## 🔹 What is `jwks-rsa`?

`jwks-rsa` is a Node.js library that helps your backend **automatically fetch and cache public keys** (RSA/EC) from an Identity Provider (IdP) such as **Keycloak, Auth0, Okta, or Azure AD**.

These public keys are published in **JWKS (JSON Web Key Set) format**, usually at:

```
https://<idp-domain>/realms/<realm-name>/protocol/openid-connect/certs
```

---

## 🔹 Why Do We Need It?

When JWTs are signed with `RS256` (or `ES256`):

- The IdP signs the token with a **private key**.
- Your API (resource server) must verify the token’s signature with the **corresponding public key**.

**Challenges:**

- **Key rotation:** IdPs periodically generate new key pairs.
- **Multiple keys:** Old & new keys may be active during transitions.
- **Hardcoding public keys:** Breaks when the IdP rotates keys.

**`jwks-rsa` solves this by:**

- Fetching the JWKS from Keycloak automatically.
- Selecting the right key (using the `kid` — key ID in JWT header).
- Caching the key to avoid network overhead on every request.

---

## 🔹 How it Works (Step by Step)

1. **Client sends request:**  
    `Authorization: Bearer <JWT>`

2. **API middleware extracts the token.**

3. **Decode JWT header → get the `kid` (Key ID).**

4. **Use `jwks-rsa` to:**
    - Fetch JWKS (list of public keys) from Keycloak’s `.well-known` endpoint.
    - Find the matching key by `kid`.
    - Convert it into a usable public key (PEM).

5. **Pass public key to `jsonwebtoken.verify()` to check:**
    - Signature is valid.
    - Token not expired (`exp`).
    - Issuer (`iss`) and Audience (`aud`) are trusted.

---

## 🔹 Example in Node.js

```js
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: "https://<keycloak-domain>/realms/<realm-name>/protocol/openid-connect/certs",
  cache: true,            // cache keys for performance
  cacheMaxEntries: 5,     // only store latest 5
  cacheMaxAge: 10 * 60 * 1000 // 10 minutes
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
     if (err) return callback(err);
     const signingKey = key.getPublicKey(); // PEM formatted key
     callback(null, signingKey);
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
     jwt.verify(
        token,
        getKey,
        {
          algorithms: ["RS256"],
          issuer: "https://<keycloak-domain>/realms/<realm-name>",
          audience: "your-client-id"
        },
        (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        }
     );
  });
}
```

---

## 🔹 Benefits of `jwks-rsa`

- ✅ **Automatic key rotation:** No manual update when IdP rotates keys.
- ✅ **Cache support:** Reduces latency and external calls.
- ✅ **Security:** Ensures correct key is chosen based on `kid`.
- ✅ **Standards-based:** Works with any IdP that supports JWKS (Keycloak, Auth0, Okta, Azure AD, etc.).

---

## 🔹 In Finance / Enterprise Context

Finance apps demand key rotation and strong verification, so `jwks-rsa` is widely used.

Without it, developers would need to hardcode and manually rotate public keys whenever Keycloak/Auth0 updates them — **high operational risk**.

---

**✅ In short:**  
`jwks-rsa` fetches and caches the correct public key from Keycloak’s JWKS endpoint (based on `kid` in JWT) so your API can safely verify JWT signatures even when keys rotate.