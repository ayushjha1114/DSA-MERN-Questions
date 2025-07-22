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


# Caching Strategies Cheat Sheet

## ✅ Why Use Caching?
- Reduce latency
- Decrease load on databases/services
- Improve scalability

---

## 🔹 Common Caching Types

### 1. **In-Memory Cache**
- **Tools:** Node.js memory, `lru-cache`, `node-cache`
- **Use When:** Ultra-fast, per-instance caching (e.g., config values, small datasets)
- **Drawback:** Not persistent across app restarts or distributed instances

### 2. **Distributed Cache**
- **Tools:** Redis, Memcached
- **Use When:** Shared cache across multiple app instances/services
- **Supports:** Expiration, pub/sub, persistence (Redis AOF/RDB), eviction policies (LRU, LFU)

---

## 🔹 Caching Strategies by Behavior

### 3. **Read-Through Cache**
- **Flow:** App reads from cache → If miss, loads from DB → Stores in cache → Returns result
- **Best For:** Frequently-read data (user profiles, config, product details)
- **Pro:** Automatic population
- **Con:** Initial cache miss may delay response

### 4. **Write-Through Cache**
- **Flow:** App writes to both DB and cache on every update
- **Best For:** When consistency between DB and cache is critical
- **Con:** Slower writes

### 5. **Write-Behind (Write-Back) Cache**
- **Flow:** App writes only to cache → Cache asynchronously writes to DB
- **Best For:** High-write systems where write latency matters
- **Con:** Risk of data loss if cache fails before DB write

### 6. **Cache-Aside (Lazy Caching)**
- **Flow:** App tries cache → If miss, fetches from DB → Stores in cache manually
- **Notes:** Most commonly used strategy; good balance of simplicity and control; often combined with Redis + Node.js

### 7. **Time-Based Expiry / TTL**
- **Description:** Cached items expire after a fixed time
- **Useful For:** News, pricing, or stock info that updates periodically
- **Example:** `Redis.set(key, value, 'EX', 60)`

### 8. **Eviction Policies**
- **When:** Cache exceeds memory limit
- **Types:**
    - **LRU (Least Recently Used):** Default in most libraries
    - **LFU (Least Frequently Used):** More precise for hotspot data
    - **FIFO (First In First Out):** Simple, but not always optimal

---

## 🔹 Advanced Strategies

### 9. **Cache Invalidation**
- **Goal:** Remove outdated/stale data from cache correctly
- **Triggers:** Manual (on update/delete), TTL, or version tags
- **Challenge:** Consistency in distributed systems

### 10. **Content Delivery Network (CDN) Caching**
- **Use For:** Static assets (images, CSS, JS, HTML/SSR)
- **Tools:** Cloudflare, AWS CloudFront, Vercel edge cache
- **Benefit:** Cache at edge servers near the user

### 11. **Local Cache + Remote Fallback**
- **Flow:** Use in-process cache first, fallback to Redis or DB if miss
- **Benefit:** Reduces latency and avoids frequent Redis lookups
- **Popular In:** GraphQL resolvers, middleware caching

---

## 🔷 Read-Heavy Use Case

### ✅ Scenario
**Product catalog service for an e-commerce website:**
- 10,000 users browsing products
- Only 500 users making purchases at any time

### 🧠 Characteristics
- High read-to-write ratio
- Product info changes infrequently
- Need fast response times for UI

### ✅ Caching Strategy
- **Cache-aside (lazy caching) with Redis**
- **TTL:** e.g., 10 minutes
- **Eviction policy:** LRU (evict least accessed)

```ts
// Node.js pseudo-example
const cachedProduct = await redis.get(`product:${productId}`);
if (cachedProduct) return JSON.parse(cachedProduct);

const product = await db.getProduct(productId);
await redis.set(`product:${productId}`, JSON.stringify(product), 'EX', 600); // 10 min TTL
return product;
```

### ✅ Why it works
- Minimizes DB reads
- Redis serves fast responses (low latency)
- TTL ensures eventual consistency
- Stale reads are tolerable (acceptable for product display)

---

## 🔷 Write-Heavy Use Case

### ✅ Scenario
**Real-time analytics event collector:**
- Thousands of events/second being written
- Users rarely read individual events — reads happen in batches or aggregated form

### 🧠 Characteristics
- High write volume
- Low read volume
- Data freshness is critical

### ✅ Caching Strategy
- **Write-back (write-behind) cache or batch buffer**
- Writes go to Redis (or Kafka/queue), then async to DB
- Use TTL carefully or not at all for raw data
- Add deduplication or compression if needed

```ts
// Write to Redis first
await redis.lpush('events', JSON.stringify(eventData));

// Background worker flushes to DB every 5 seconds
```

### ✅ Why it works
- Offloads DB pressure by buffering writes
- Helps absorb spikes without dropping events
- May use Redis Streams, Kafka, or queue + DB batch write

---

## 🔁 Hybrid Example

### ✅ Scenario
**User session service**
- Reads are frequent (check if user is logged in)
- Writes are occasional (login/logout, token refresh)

### Strategy
- Use write-through cache for consistency
- Store session in Redis with expiry
- Read from Redis in every request

---

## 🔚 Summary

| Use Case   | Read-Heavy                | Write-Heavy                  |
|------------|---------------------------|------------------------------|
| Example    | Product catalog           | Event ingestion / analytics  |
| Strategy   | Cache-aside + TTL         | Write-back / queue-buffer    |
| Cache Type | Redis (GET-first)         | Redis/Kafka (write-first, async DB) |
| Priority   | Low latency for frequent reads | High throughput, DB write protection |
| Eviction   | LRU / TTL                 | Rarely evict (until batch flush)     |



# Caching Interview Guide for Tech Lead/Senior Backend Roles

## "Tell me about your experience with caching"

### ✅ Structured Answer:
"I've extensively used caching across various layers — from in-memory caches like Redis and Node.js memory stores to HTTP-level and DB-level caching — to improve performance, reduce latency, and manage load in high-traffic systems."

### 💡 Key Points to Cover:

## 🛒 Example: E-commerce Platform (Amazon-like)

### Context:
We're building a Node.js-based backend with React frontend. The system handles millions of product views, personalized recommendations, and flash sale pricing. Performance and scalability are critical.

---

## ✅ 1. In-memory Caching (Redis, LRU)

### 🔸 Use Case:
Caching user sessions, category product lists, and site-wide settings (banners, shipping zones, feature flags).

### 🧩 Example:

```typescript
// Node.js backend (Express + Redis)
const redis = require('redis');
const client = redis.createClient();
const CACHE_TTL = 300; // 5 mins

app.get('/api/categories/:id/products', async (req, res) => {
  const cacheKey = `category_products:${req.params.id}`;
  const cachedData = await client.get(cacheKey);
  
  if (cachedData) return res.json(JSON.parse(cachedData));

  const products = await db.getProductsByCategory(req.params.id); // expensive query
  await client.setEx(cacheKey, CACHE_TTL, JSON.stringify(products));

  return res.json(products);
});
```

### ✅ Result:
- Reduced DB load by ~80% during peak traffic
- TTL ensured freshness, especially during flash sales or category changes

---

## ✅ 2. HTTP Caching (CDN + Headers)

### 🔸 Use Case:
Caching product images, category pages, and product detail pages on edge/CDN (Cloudflare, Akamai).

### 🧩 Example:
Set HTTP response headers in Nginx or Express:

```http
Cache-Control: public, max-age=86400
ETag: "abc123"
```

### ✅ Result:
- 90% of static assets (images, JS bundles) were served directly from CDN
- Reduced origin traffic and latency by 500ms+ for global users

---

## ✅ 3. Database Query Caching (Redis Query Cache)

### 🔸 Use Case:
Heavy dashboard queries like "Top-selling products last 7 days" or "Revenue by region" for admin dashboards.

### 🧩 Example:

```typescript
const cacheKey = 'top-products:7d';

const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const topProducts = await db.query(`
  SELECT product_id, COUNT(*) AS total_sold
  FROM orders
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY product_id
  ORDER BY total_sold DESC
  LIMIT 10
`);

await redis.setEx(cacheKey, 300, JSON.stringify(topProducts)); // 5 min TTL
return topProducts;
```

### ✅ Result:
- Reduced expensive aggregations (scan over 10M rows)
- Ensured freshness via TTL + cache invalidation on new orders using Redis pub/sub

---

## ✅ 4. Application-Level Memoization (LRU Cache)

### 🔸 Use Case:
Memoizing dynamic pricing logic for users during high-load sale campaigns (100k+ concurrent users).

### 🧩 Example:

```typescript
// Node.js using lru-cache
const LRU = require('lru-cache');
const priceCache = new LRU({ max: 5000, ttl: 10 * 1000 }); // 10s

function getDynamicPrice(userId, productId) {
  const key = `${userId}:${productId}`;
  const cached = priceCache.get(key);
  if (cached) return cached;

  const price = calculatePrice(userId, productId); // CPU-heavy sync function
  priceCache.set(key, price);
  return price;
}
```

### ✅ Result:
- Cut pricing function calls by 80% under flash sale stress
- Preserved 60fps performance in React frontend by avoiding lag on pricing fetches