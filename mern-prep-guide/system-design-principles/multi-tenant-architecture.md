# Multi-Tenant Architecture Guide

A **multi-tenant architecture** is a software architecture where a **single instance of the application serves multiple customers (tenants)**. Each tenant is logically isolated but physically integrated — meaning they share the same infrastructure, codebase, and often the same database.

## 🔍 What is a Tenant?

A **tenant** is a group of users who share common access with specific privileges to the software instance. For example:
* A company using your SaaS product
* A school on an education platform
* A vendor on an e-commerce platform

## 🏗️ Types of Multi-Tenant Architectures

### 1. Shared Everything (Single DB, Shared Schema)

* All tenants' data resides in the **same database and tables**.
* Differentiated using a `tenant_id` column.

**✅ Pros:**
* Easy to maintain and scale
* Lower infrastructure cost

**❌ Cons:**
* Data isolation is logical, not physical → harder to secure
* Complex queries for tenant-level access

**✅ Example:**

```
Users Table:
| id | name  | tenant_id |
|----|-------|-----------|
| 1  | Alice | T1        |
| 2  | Bob   | T2        |
```

```sql
SELECT * FROM users WHERE tenant_id = 'T1';
```

### 2. Shared DB, Separate Schemas (hybrid multi-tenant architecture)

* One database, but each tenant has their own **schema**.

**✅ Pros:**
* Better isolation than shared schema
* Can apply schema-specific changes

**❌ Cons:**
* Managing many schemas can get complicated
* Still resource-shared at the DB level

**✅ Example:**
* `tenant_1.users`, `tenant_2.users`, etc.

### 3. Separate Databases (One per Tenant)

* Each tenant has their own **dedicated database**.

**✅ Pros:**
* Best isolation and security
* Easier to comply with data regulations (GDPR, HIPAA)

**❌ Cons:**
* High infrastructure cost
* Complex to scale/upgrade

**✅ Example:**
* `tenant1-db`, `tenant2-db` (each with `users`, `orders`, etc.)

## 🧠 When to Use What?

| Use Case | Recommended Architecture |
|----------|-------------------------|
| Small startups, MVPs | Shared DB, Shared Schema |
| Medium-size SaaS with growth | Shared DB, Separate Schemas |
| Enterprise clients with strict security | Separate Databases |

## 💻 Real-World Example: SaaS CRM

You are building a CRM (Customer Relationship Management) SaaS app. Your tenants are companies like:
* 🏢 Company A (100 users)
* 🏢 Company B (50 users)

**Shared Schema Model:**

**Tables:**
* `companies (id, name)`
* `users (id, name, company_id)`
* `leads (id, name, company_id)`

To fetch all leads for Company A:

```sql
SELECT * FROM leads WHERE company_id = 'A';
```

Every table has a `company_id` or `tenant_id`.

## 🔐 Key Considerations

### 1. Data Isolation
* Ensure tenant A can't access tenant B's data.
* Enforce strict `tenant_id` checks at the app or ORM layer.

### 2. Authentication & Authorization
* User logins must be mapped to the correct tenant.
* JWT tokens can include tenant_id in payload.

### 3. Billing & Usage
* Track per-tenant usage for billing
* Quotas, rate limiting, features per tenant

### 4. Deployment & Scaling
* Shared architecture allows easy auto-scaling
* Use container orchestration (like Kubernetes) for services

## 🚀 Example in Node.js

```javascript
app.get('/customers', authMiddleware, async (req, res) => {
  const tenantId = req.user.tenantId;
  const customers = await db('customers').where({ tenant_id: tenantId });
  res.json(customers);
});
```

## 🧱 Tools That Help

| Concern | Tool |
|---------|------|
| ORM | Prisma, Sequelize |
| Multi-DB Management | Knex, MikroORM |
| Auth | Auth0, Firebase, Keycloak |
| DB Scaling | PostgreSQL Citus, CockroachDB |

## 🔄 Bonus: Hybrid Approach

Some systems start with **shared schema**, and when a tenant grows, they **migrate them to a dedicated DB**. This gives flexibility and cost efficiency.

## ✅ Summary

| Feature | Shared Schema | Separate Schema | Separate DB |
|---------|---------------|-----------------|-------------|
| Isolation | Low | Medium | High |
| Maintenance Cost | Low | Medium | High |
| Customization Ease | Low | Medium | High |
| Performance | High | Medium | Depends |



# Hybrid Multi-Tenant Architecture Guide

You're referring to the **hybrid multi-tenant architecture**, where tenants **initially share a database** (often via **separate schemas**), and **later migrate to dedicated databases** when they grow.

This approach gives **both cost-efficiency and flexibility** by **adapting to tenant size and needs over time**.

## 🔍 Why Start with Shared DB + Separate Schemas?

When you're launching a SaaS platform:
* Most tenants are **small** and don't need dedicated resources.
* **Single DB with multiple schemas** is:
   * Easy to manage
   * Cheap to host
   * Still gives some **logical isolation**
* Operational costs are **low**:
   * Fewer DB connections
   * Easier backups and monitoring
   * Shared caching, shared indexing

## 🔄 Why Migrate Heavy Tenants to Dedicated DBs?

As some tenants grow, they start to:
* **Store more data**
* **Generate higher load**
* **Require custom configurations** (indexing, performance tuning, retention policies, backups)

These large tenants can:
* **Slow down the shared DB** (causing "noisy neighbor" problems)
* Complicate backup/restore operations
* Require isolation for compliance (e.g., financial institutions or healthcare)

So you **move** them to **a dedicated DB**:
* You isolate performance
* You isolate risks
* You unlock custom scaling for them

## 💡 How It Gives Flexibility + Cost Efficiency

| Phase | Architecture | Benefit |
|-------|--------------|---------|
| Startup / Early | Shared DB + Multiple Schemas | ✅ Low cost, easier management |
| Growing tenants | Move to Dedicated DB per tenant | ✅ Isolation, performance tuning |
| Mixed phase | Hybrid (some shared, some separate) | ✅ Optimized balance of cost and scale |

You only **pay** for dedicated resources **when necessary**, not upfront. This gives you:
* **Efficiency** for small tenants
* **Scalability & SLA compliance** for big tenants

## 🧠 Real-World Analogy

Imagine a **co-working space**:
* Early on, all startups share desks (shared DB + schemas)
* As a startup grows and hires 50 people, they get a **private office** (dedicated DB)

This way:
* You utilize space (DB resources) efficiently
* You upgrade selectively when tenants justify the cost

## 📦 How Migration Works (at a high level)

1. **Export tenant's schema** from shared DB
2. **Create a new DB** for the tenant
3. **Import** data and schema into new DB
4. Update routing logic:

```javascript
if (tenant === 'bigCorp') {
  connectTo('bigCorp-db');
} else {
  connectToSharedDBSchema(tenant);
}
```

5. Optionally, **set read replicas**, backups, and custom indexes for the new DB