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

