# ⚡ Caching Strategies in System Design

Caching is a performance optimization technique to reduce latency, load, and cost by storing frequently accessed data in a fast-access layer (like memory).

---

## 🧠 Why Use Caching?

- Reduce database load
- Speed up API responses
- Handle high traffic spikes
- Improve user experience

---

## 📦 Where to Cache? (Cache Levels)

| Level          | Example                          | Use Case                          |
|----------------|----------------------------------|------------------------------------|
| Client-side    | Browser localStorage/sessionStorage | Static assets, user tokens        |
| CDN/Edge       | Cloudflare, Akamai              | Static files like images, JS, CSS |
| Application    | In-memory (e.g., Node.js cache) | Small data, per instance          |
| Distributed    | Redis, Memcached                | Shared, scalable caching layer    |
| Database       | Query cache, materialized views | Expensive queries                 |

---

## 🛠️ Common Caching Strategies

### 1. Read-Through Cache
App reads from cache → if miss, reads from DB, writes to cache.

```js
// Pseudocode
cache.get(key) || db.query().then(result => {
    cache.set(key, result);
    return result;
});
```

- ✅ Always fresh cache
- ❌ Extra latency on cache misses

### 2. Write-Through Cache
Every write goes through the cache, which updates the DB.

- ✅ Consistent data
- ❌ Slower writes

### 3. Write-Behind (Write-Back)
Write to cache → async update to DB later.

- ✅ Very fast writes
- ❌ Data loss risk if cache crashes

### 4. Cache Aside (Lazy Loading) 
**✅ Most common**  
App checks cache → if miss, loads from DB and writes to cache.

- ✅ Flexible
- ❌ Potential stale data

---

## 🧹 Cache Invalidation Strategies

| Strategy       | Description                          |
|----------------|--------------------------------------|
| Time-based     | Use TTL (e.g., 60 seconds)           |
| Manual         | Delete key when data is updated in DB|
| Versioning     | Use versioned keys like `user:123:v2`|
| Write-through  | Keep cache and DB always in sync     |

---

## 📍 Where to Use Caching in Real Systems?

- **Timeline feed (Twitter, Instagram)** → Redis
- **Product catalog (e-commerce)** → Memcached
- **Session data** → Redis
- **Autocomplete suggestions** → In-memory cache

---

## 🧨 What Happens When Your Cache Goes Down?

- Your app falls back to the database for reads.
- DB load spikes, potentially slowing down or crashing under pressure.
- Response time increases since cached data is no longer instantly available.

### ✅ Mitigations:
- Use circuit breakers or graceful fallbacks.
- Add rate limits or throttling to protect your DB.
- Use redundant caches or multi-layered caching.

---

## 🕒 How Do You Handle Stale Data?

| Strategy            | How it Works                          | Best For                          |
|---------------------|---------------------------------------|-----------------------------------|
| TTL (Time to Live)  | Set an expiration time on cache keys  | Regularly changing data (e.g., news) |
| Write-through       | Write to DB + cache at same time      | Strong consistency               |
| Cache Invalidation  | Remove/update cache on writes/updates| Manual control                   |
| Background Refresh  | Refresh data periodically in background | Analytics, dashboards          |

**🧠 TL;DR:** You balance freshness vs performance; choose based on read/write patterns.

---

## ⚔️ Redis vs Memcached — When to Use Which?

| Feature         | Redis                        | Memcached                     |
|-----------------|------------------------------|-------------------------------|
| Data Types      | Rich (lists, sets, sorted sets, etc.) | Simple key-value only         |
| Persistence     | ✅ Yes (AOF / RDB snapshots) | ❌ No (pure in-memory)         |
| Pub/Sub, Streams| ✅ Yes                       | ❌ No                          |
| Memory Usage    | Slightly more               | Slightly more efficient       |
| Use Case        | Counters, sessions, queues, leaderboards | Simple caching (HTML, API responses) |

**🧠 TL;DR:** Use Redis for power & features; Memcached for lightweight key-value caching.

---

## 📸 Where Would You Cache in a Blog/Instagram System?

### Blog System:
- Cache post content, homepage feed, most-read posts
- Cache at API response level or template fragments

### Instagram-like App:
- Cache user profiles, photo metadata, popular posts, feed results
- Use Redis for timeline caching or counting likes/views
- Use CDN for images and videos

**🧠 TL;DR:** Cache things that are:
- Read-heavy
- Expensive to compute
- Shared across users