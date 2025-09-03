# 🟢 NPM vs Yarn — The Most Exhaustive Comparison

## 1. Introduction

**npm (Node Package Manager):**
- Official package manager for Node.js.
- Comes bundled with Node.js installation.
- First released in 2010 by Isaac Z. Schlueter.
- The largest software registry in the world, with millions of packages.

**Yarn:**
- Stands for Yet Another Resource Negotiator (inspired by Apache Hadoop, but different here).
- Created by Facebook, released in 2016, with help from Exponent (now Expo), Google, and Tilde.
- Built to solve problems in npm v3 (like inconsistent installs, speed, and security).

---

## 2. Core Differences at a High Level

| Feature                | npm                                   | Yarn                                              |
|------------------------|---------------------------------------|---------------------------------------------------|
| Creator                | npm, Inc.                             | Facebook + contributors                           |
| Year                   | 2010                                  | 2016                                              |
| Default with Node.js   | Yes                                   | No                                                |
| Registry               | Official npm registry                 | npm registry (default) but can use others         |
| Lockfile               | `package-lock.json` (from npm v5)     | `yarn.lock`                                       |
| Parallel installs      | Sequential (older), parallel from v5+ | Always parallel                                   |
| Deterministic installs | From v5 onwards                       | From the start                                    |
| Workspaces             | Supported in npm v7+                  | Supported earlier (native in Yarn)                |
| Plug’n’Play (PnP)      | ❌                                    | ✅ (unique feature)                               |
| Speed                  | Improved over time                    | Generally faster, especially Yarn Berry (v2+)     |
| Offline cache          | Supported with `npm ci` and caching   | Native offline cache                              |
| Security               | `npm audit`                           | `yarn audit` (uses npm advisory DB)               |
| Monorepo support       | Basic (workspaces)                    | Strong (workspaces + zero-install + constraints)  |

---

## 3. Architectural and Internal Working

**npm**
- Centralized around the npm registry (`registry.npmjs.org`).
- Uses `package.json` + `package-lock.json` to define dependencies.
- Installs dependencies into `node_modules` (nested, flattened in npm v3+).
- **Dependency resolution:**
    - Scans `package.json`.
    - Resolves semantic versioning (semver) rules.
    - Fetches packages from registry.
    - Caches them locally (`~/.npm`).
    - Creates `node_modules` folder.

**Yarn**
- Introduced deterministic installs via `yarn.lock` before npm had it.
- Uses parallel downloads, making installs much faster.
- Maintains a global cache (`~/.yarn-cache`).
- **Innovations:**
    - **Plug’n’Play (PnP):** No `node_modules`, uses `.pnp.cjs` file to map dependencies.
    - **Zero-install:** Commit `.yarn/cache` into Git to avoid re-downloading dependencies in CI/CD.
- **Dependency resolution:**
    - Checks `yarn.lock`.
    - Uses cache aggressively.
    - Falls back to npm registry if not cached.

---

## 4. Performance

- **npm (before v5):** Slow, lots of repeated downloads.
- **npm (v6+):** Caching, `npm ci` for clean installs → faster.
- **npm (v7+):** Native workspaces, parallel installs → much improved.
- **Yarn Classic (v1):** Much faster than npm (parallel + caching).
- **Yarn Berry (v2+):**
    - Uses PnP → no `node_modules`.
    - Significantly reduces disk usage and install time.
    - Still controversial due to ecosystem incompatibility (some packages assume `node_modules`).

**⚡ Benchmark results (real-world tests):**
- Yarn v1/v2 usually 2x faster than npm v6.
- npm v7/8 has narrowed the gap → ~10-20% slower than Yarn in many cases.

---

## 5. Lockfiles

**npm:**
- `package-lock.json` (introduced in npm v5, 2017).
- Ensures deterministic installs.
- Larger file, JSON format.

**Yarn:**
- `yarn.lock` (from the start).
- Deterministic.
- Human-readable, compact.

**Compatibility:**
- You should never commit both. Use one (depending on the tool).

---

## 6. Workspaces (Monorepos)

**npm (v7+):**
- Supports workspaces natively.
- Still catching up with advanced features.

**Yarn:**
- Introduced workspaces earlier.
- Better ecosystem support for monorepos.
- **Advanced features:**
    - Constraints
    - Zero-install
    - Better linking between packages.

> Popular monorepo tools prefer Yarn (e.g., Babel, Jest, Expo).

---

## 7. Unique Features

**npm:**
- Comes pre-installed with Node.js.
- Largest registry.
- Widely adopted across all projects.

**Yarn:**
- **Plug’n’Play (PnP):** Revolutionary alternative to `node_modules`.
- **Zero-Install:** Cache committed to repo.
- **Constraints:** Enforce rules across workspace dependencies.
- **Better scripting:** `yarn run` aliases.

---

## 8. Security

**npm:**
- Introduced `npm audit` (2018).
- Integrates with GitHub’s security advisories.
- Frequent security incidents (e.g., event-stream backdoor in 2018).

**Yarn:**
- `yarn audit` introduced later (reuses npm’s advisories).
- More secure installs (checksum verification).
- Workspaces reduce attack surface.

---

## 9. Community & Ecosystem

**npm:**
- Default for Node.js → largest user base.
- Official support and documentation.
- Backed by GitHub (Microsoft).

**Yarn:**
- Loved in enterprise setups.
- Strong in monorepo projects.
- Popular in React, React Native, Expo, Babel, etc.
- Yarn v2 (“Berry”) is controversial because of PnP → some developers prefer sticking to v1.

---

## 10. Command Comparison

| Action                        | npm command                        | Yarn command                  |
|-------------------------------|------------------------------------|-------------------------------|
| Install dependencies          | `npm install`                      | `yarn install`                |
| Add a dependency              | `npm install package`              | `yarn add package`            |
| Add dev dependency            | `npm install package --save-dev`   | `yarn add package --dev`      |
| Remove dependency             | `npm uninstall package`            | `yarn remove package`         |
| Update dependency             | `npm update package`               | `yarn upgrade package`        |
| Install exact version         | `npm install package@1.2.3`        | `yarn add package@1.2.3`      |
| Install from package.json only| `npm ci`                           | `yarn install --frozen-lockfile` |
| Run script                    | `npm run script`                   | `yarn script`                 |
| Audit packages                | `npm audit`                        | `yarn audit`                  |

---

## 11. Disk Space & Node_Modules Handling

**npm:**
- Always generates `node_modules`.
- Huge folder, lots of duplication.

**Yarn Classic:**
- Same as npm (`node_modules`).

**Yarn PnP (Berry):**
- No `node_modules` at all.
- Dependencies loaded via `.pnp.cjs`.
- Saves disk, avoids deep folder nesting issues (Windows path length limit).

---

## 12. Enterprise Usage

**npm:**
- Default in most companies.
- Easier for small to medium projects.

**Yarn:**
- Preferred in large-scale monorepos (Meta, Expo, Babel).
- Zero-install reduces CI/CD costs.

---

## 13. Future

**npm:**
- Backed by GitHub (Microsoft).
- Actively developed, closing gap with Yarn.
- v9 and v10 improved performance drastically.

**Yarn:**
- Moving fully towards Berry (v2+).
- PnP adoption growing, but slow due to ecosystem friction.
- Strong monorepo + enterprise tooling.

---

## 14. When to Choose What

**Use npm if:**
- You want simplicity, fewer tools.
- Small-to-medium projects.
- You prefer official ecosystem integration (GitHub, Node.js).

**Use Yarn if:**
- You work with monorepos.
- You need speed + offline support.
- You want advanced features (PnP, Zero-Install).
- You’re in a React/React Native ecosystem.

---

## 15. Fun Facts

- Yarn v1 was a game-changer because npm v3 was extremely slow.
- Many devs still call Yarn v1 “classic” and avoid Yarn Berry.
- Some big projects (like Next.js) migrated back to npm once npm performance improved.
- **pnpm** (a third competitor) is gaining popularity because it combines Yarn’s speed + disk efficiency with npm compatibility.

