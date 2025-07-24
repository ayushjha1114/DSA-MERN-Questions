# How to Sort 1TB of Data in Node.js

Sorting 1TB of data in Node.js is not feasible in memory — even on high-end machines — because of RAM limitations (e.g., 1TB data >> 16-64GB RAM). Instead, you need to use an **external sorting algorithm**, like **External Merge Sort**, which is specifically designed for this use case.

## ✅ Solution: External Merge Sort in Node.js

### 🚀 Steps to Sort 1TB Data in Node.js

## 1. Chunk & Sort (Split Phase)

Break the 1TB data into smaller chunks (e.g., 100MB–1GB) that can fit into memory, sort them, and write each sorted chunk to disk.

```javascript
const fs = require('fs');
const readline = require('readline');

// Example for text-based number data
async function sortAndSaveChunk(chunkNumber, lines) {
  lines.sort((a, b) => Number(a) - Number(b)); // sort in-memory
  await fs.promises.writeFile(`chunk_${chunkNumber}.txt`, lines.join('\n'));
}

async function splitAndSortLargeFile(inputPath, chunkSize = 100_000) {
  const fileStream = fs.createReadStream(inputPath);
  const rl = readline.createInterface({ input: fileStream });

  let lines = [];
  let chunkNum = 0;

  for await (const line of rl) {
    lines.push(line);
    if (lines.length >= chunkSize) {
      await sortAndSaveChunk(chunkNum++, lines);
      lines = [];
    }
  }

  if (lines.length) await sortAndSaveChunk(chunkNum++, lines);
}
```

## 2. Merge Phase (K-way Merge)

After sorting all chunks, merge them into a single sorted output using a priority queue (min-heap).

```javascript
const Heap = require('heap'); // `npm install heap`
const { createReadStream } = require('fs');
const readline = require('readline');

async function* readSortedFile(filePath) {
  const rl = readline.createInterface({ input: createReadStream(filePath) });
  for await (const line of rl) yield Number(line);
}

async function externalMergeSortedFiles(chunkPaths, outputPath) {
  const output = fs.createWriteStream(outputPath);
  const iterators = chunkPaths.map(readSortedFile);
  const heap = new Heap((a, b) => a.value - b.value);

  // Initialize heap
  for (let i = 0; i < iterators.length; i++) {
    const iter = iterators[i];
    const { value, done } = await iter.next();
    if (!done) heap.push({ value, source: iter });
  }

  while (!heap.empty()) {
    const { value, source } = heap.pop();
    output.write(value + '\n');

    const { value: nextVal, done } = await source.next();
    if (!done) heap.push({ value: nextVal, source });
  }

  output.end();
}
```

## 🔄 Full Pipeline

```javascript
(async () => {
  await splitAndSortLargeFile('1tb_input.txt'); // Step 1
  const chunkPaths = fs.readdirSync('.').filter(f => f.startsWith('chunk_'));
  await externalMergeSortedFiles(chunkPaths, 'final_sorted_output.txt'); // Step 2
})();
```

## ⚙️ Tools / Notes

- **Memory-efficient**: processes data in chunks and streams
- You can parallelize chunk sorting using worker threads or child processes
- Can use temporary storage (SSD preferred) for chunk files
- Optionally compress sorted chunks to save disk I/O

## 🧠 Interview Insight

This question tests your understanding of:
- Algorithm scalability
- I/O-bound operations
- Node.js stream management
- Not just sorting logic

## Key Concepts

### External Merge Sort Algorithm
1. **Split Phase**: Divide large data into manageable chunks
2. **Sort Phase**: Sort each chunk in memory
3. **Merge Phase**: Combine sorted chunks using k-way merge
4. **Stream Processing**: Use streams to handle large files efficiently

### Performance Considerations
- **Chunk Size**: Balance between memory usage and number of files
- **Disk I/O**: Use SSDs for better performance
- **Parallelization**: Use worker threads for concurrent chunk processing
- **Compression**: Reduce disk space and I/O overhead

### Node.js Specific Optimizations
- Use `readline` interface for line-by-line processing
- Implement async generators for memory-efficient file reading
- Use streams for writing large output files
- Consider using `worker_threads` for CPU-intensive sorting operations


# Pre-signed URL Upload Flow Guide

## Overview

Here's a step-by-step flow of how a pre-signed URL upload flow works in a production-grade app, where:

- Media files are uploaded directly from the client (React, mobile, etc.) to S3 (or any cloud object store)
- Backend (Node.js) generates the pre-signed URL and only stores metadata (e.g., media URL, type) in the database

## ✅ Flow: Presigned URL Upload + Metadata Storage

📌 **Use Case:** A user wants to upload a photo to a post (like Instagram)

## 🧩 Step-by-Step Flow

### 🔹 1. Client initiates the upload (React)

Client sends a request to backend saying:

> "I want to upload a file of type image/jpeg with name post123.jpg."

```typescript
// Example: React frontend
await fetch("/api/media/upload-url", {
  method: "POST",
  body: JSON.stringify({
    fileName: "post123.jpg",
    fileType: "image/jpeg",
  }),
});
```

### 🔹 2. Backend generates a pre-signed URL (Node.js + S3)

The backend uses AWS SDK to generate a secure, short-lived URL to allow direct file upload to S3.

```typescript
// In Node.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "ap-south-1" });

app.post("/api/media/upload-url", async (req, res) => {
  const { fileName, fileType } = req.body;
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: "your-bucket",
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  // Also return the final file URL that will be stored
  const fileUrl = `https://your-bucket.s3.amazonaws.com/${key}`;

  res.json({ uploadUrl, fileUrl });
});
```

### 🔹 3. Client uploads file directly to S3

Client now uploads file directly to S3 using the uploadUrl.

```typescript
await fetch(uploadUrl, {
  method: "PUT",
  headers: { "Content-Type": "image/jpeg" },
  body: file, // Actual File object from input
});
```

### 🔹 4. Client notifies backend with metadata

Once upload is successful, client informs backend:

> "I uploaded the file; here's the final fileUrl, please link it to my post."

```typescript
await fetch("/api/posts/123/media", {
  method: "POST",
  body: JSON.stringify({
    fileUrl: "https://your-bucket.s3.amazonaws.com/uploads/post123.jpg",
    type: "image",
  }),
});
```

### 🔹 5. Backend stores metadata in DB

Backend inserts a record in DB (e.g., PostgreSQL):

```json
{
  "postId": 123,
  "mediaUrl": "https://your-bucket.s3.amazonaws.com/uploads/post123.jpg",
  "type": "image",
  "uploadedAt": "2025-07-21T12:30:00Z"
}
```

## ✅ Summary of Components

| Step | Component | Role |
|------|-----------|------|
| 1 | React (Client) | Request presigned URL |
| 2 | Node.js (Server) | Generate signed URL |
| 3 | Client → S3 | Upload media file directly |
| 4 | Client → Server | Send metadata (URL, type) |
| 5 | Server → DB | Store metadata only (not file) |

## Key Benefits

- **Direct Upload**: Files go directly to S3, reducing server load
- **Security**: Pre-signed URLs are time-limited and secure
- **Scalability**: Backend only handles metadata, not large files
- **Performance**: Faster uploads as they bypass the application server



# URL Shortener System Design

Designing a URL Shortener (like Bit.ly or TinyURL) is a classic system design problem, often asked in interviews. Here's a production-grade design covering architecture, database schema, encoding strategy, scaling, and optional features.

## ✅ Problem Statement

Build a service that takes a long URL and returns a short alias.
When a user visits the short URL, it should redirect to the original URL.

## 🔹 Requirements

### ✅ Functional

- Create short URL for a given long URL
- Redirect short URL to the original URL
- Analytics: track how many times a short URL is clicked
- Expiry support (optional)
- Custom alias (optional)

### ❌ Non-Functional

- High availability
- Low latency for redirects
- Scalable to billions of URLs
- Rate-limiting to avoid abuse

## ✅ High-Level Architecture

```
             ┌────────────┐
             │   Client   │
             └────┬───────┘
                  │
         ┌────────▼────────┐
         │  Load Balancer  │
         └────────┬────────┘
                  │
        ┌─────────▼────────┐
        │   Application    │ ← API: create, resolve
        │   Server (Node)  │
        └─────────┬────────┘
                  │
       ┌──────────▼──────────┐
       │   Cache (Redis)     │ ← for fast lookups
       └──────────┬──────────┘
                  │
        ┌─────────▼──────────┐
        │   DB (PostgreSQL / │
        │       DynamoDB)    │ ← stores long ↔ short mapping
        └────────────────────┘
```

## ✅ API Design

### 1. Create short URL

```http
POST /api/shorten
{
  "longUrl": "https://www.google.com"
}
```

**Response:**

```json
{
  "shortUrl": "https://sho.rt/abc123"
}
```

### 2. Redirect (when user clicks)

```http
GET /abc123 → 302 redirect to original URL
```

## ✅ Encoding Strategy (Short Code)

We need a way to generate short, unique codes for URLs:

### Method 1: Base62 encoding of an auto-increment ID

- **Characters:** a-zA-Z0-9 (62 chars)
- **Example:** ID 100000 → base62: abc123
- Easy to implement, fast

### Method 2: Hashing (e.g., MD5/CRC32 + substring)

- Take hash of long URL
- Use 6–8 characters of hash
- Risk of collision → needs checking

✅ **For production, Base62 + ID is preferred for uniqueness & simplicity.**

## ✅ Database Schema (Relational)

```sql
CREATE TABLE url_mapping (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  clicks INT DEFAULT 0
);
```

## ✅ Caching Layer (Redis)

Use Redis to cache popular short codes:

```redis
GET shortCode → longUrl
```

On cache miss, fetch from DB, and set cache.

## ✅ Redirect Logic (in Node.js)

```typescript
// Express.js
app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  // 1. Check cache
  let longUrl = await redis.get(shortCode);
  if (!longUrl) {
    // 2. Fallback to DB
    const record = await db.query("SELECT long_url FROM url_mapping WHERE short_code = $1", [shortCode]);
    if (!record) return res.status(404).send("Not found");

    longUrl = record.long_url;
    await redis.set(shortCode, longUrl, { EX: 60 * 60 }); // Cache for 1 hour
  }

  // 3. Redirect
  return res.redirect(longUrl);
});
```

## ✅ Rate Limiting (optional)

Use Redis to throttle API usage:

```
IP → counter with expiry
```

## ✅ Expiry Feature

Allow `expires_at` in DB. When resolving the short code, check if `expires_at < now`.

## ✅ Analytics (optional)

Track clicks by incrementing a counter:

```sql
UPDATE url_mapping SET clicks = clicks + 1 WHERE short_code = ?
```

Or store in a separate `click_logs` table for richer analytics.

## ✅ Scalability

| Component   | Strategy                        |
|-------------|--------------------------------|
| DB          | Shard by short_code hash       |
| App Server  | Horizontal scaling behind LB   |
| Caching     | Use Redis Cluster              |
| CDN         | Cache redirects globally       |
| Analytics   | Offload to Kafka + workers     |

## ✅ Optional Features

- Custom aliases: `sho.rt/myalias`
- QR code generation
- Admin dashboard
- Link previews (OpenGraph scraping)
- Branded domains (per user/org)


# URL Shortener - Low-Level Design (LLD)

A production-grade URL Shortener built using Node.js and PostgreSQL, with modular architecture, validations, Redis caching, Base62 encoding, and TTL/expiry support.

## ✅ Overview

- **Backend:** Node.js (Express)
- **Database:** PostgreSQL
- **Cache:** Redis (optional but recommended)
- **Encoding:** Base62

### Features:
- Shorten long URL
- Redirect short URL
- Optional expiry date
- Auto-increment ID + Base62 encoding
- Redis cache for fast lookup

## ✅ Key Components

```
src/
├── controllers/
│   └── urlController.js
├── services/
│   └── urlService.js
├── utils/
│   └── base62.js
├── routes/
│   └── urlRoutes.js
├── models/
│   └── urlModel.js
├── db/
│   ├── postgres.js
│   └── redis.js
├── app.js
└── server.js
```

## ✅ Database Schema (PostgreSQL)

```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  long_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  clicks INT DEFAULT 0
);
```

## ✅ Implementation Files

### base62.js – Encode/Decode

```javascript
const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

exports.encode = (num) => {
  let str = "";
  while (num > 0) {
    str = chars[num % 62] + str;
    num = Math.floor(num / 62);
  }
  return str || "0";
};
```

### urlModel.js – DB Access Layer

```javascript
const db = require("../db/postgres");

exports.insertUrl = async (longUrl, expiresAt) => {
  const { rows } = await db.query(
    "INSERT INTO urls (long_url, expires_at) VALUES ($1, $2) RETURNING id",
    [longUrl, expiresAt]
  );
  return rows[0].id;
};

exports.updateShortCode = async (id, shortCode) => {
  await db.query("UPDATE urls SET short_code = $1 WHERE id = $2", [shortCode, id]);
};

exports.getUrlByCode = async (code) => {
  const { rows } = await db.query(
    "SELECT long_url, expires_at FROM urls WHERE short_code = $1",
    [code]
  );
  return rows[0];
};
```

### urlService.js – Core Logic

```javascript
const model = require("../models/urlModel");
const base62 = require("../utils/base62");
const redis = require("../db/redis");

exports.createShortUrl = async (longUrl, expiresAt) => {
  const id = await model.insertUrl(longUrl, expiresAt);
  const shortCode = base62.encode(id);
  await model.updateShortCode(id, shortCode);
  await redis.set(shortCode, longUrl, "EX", 60 * 60); // 1h cache
  return shortCode;
};

exports.resolveUrl = async (shortCode) => {
  let longUrl = await redis.get(shortCode);
  if (longUrl) return longUrl;

  const record = await model.getUrlByCode(shortCode);
  if (!record) throw new Error("Not found");
  if (record.expires_at && new Date(record.expires_at) < new Date()) {
    throw new Error("Expired");
  }

  await redis.set(shortCode, record.long_url, "EX", 60 * 60);
  return record.long_url;
};
```

### urlController.js

```javascript
const service = require("../services/urlService");

exports.shorten = async (req, res) => {
  const { longUrl, expiresAt } = req.body;
  try {
    const code = await service.createShortUrl(longUrl, expiresAt);
    res.json({ shortUrl: `${req.protocol}://${req.get("host")}/${code}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.redirect = async (req, res) => {
  try {
    const longUrl = await service.resolveUrl(req.params.code);
    res.redirect(longUrl);
  } catch (err) {
    res.status(404).send("URL not found or expired.");
  }
};
```

### urlRoutes.js

```javascript
const express = require("express");
const router = express.Router();
const controller = require("../controllers/urlController");

router.post("/shorten", controller.shorten);
router.get("/:code", controller.redirect);

module.exports = router;
```

### postgres.js

```javascript
const { Pool } = require("pg");
module.exports = new Pool({
  user: "postgres",
  host: "localhost",
  database: "shortener",
  password: "yourpassword",
  port: 5432,
});
```

### redis.js

```javascript
const Redis = require("ioredis");
module.exports = new Redis();
```

### app.js + server.js

```javascript
// app.js
const express = require("express");
const app = express();
app.use(express.json());
app.use("/", require("./routes/urlRoutes"));
module.exports = app;

// server.js
const app = require("./app");
app.listen(3000, () => console.log("Server running on port 3000"));
```

## ✅ Sample Request (cURL)

```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://github.com", "expiresAt": "2025-12-31T00:00:00Z"}'
```

## Architecture Benefits

- **Modular Design:** Clear separation of concerns with controllers, services, models, and utilities
- **Caching Strategy:** Redis for fast lookups and reduced database load
- **Scalability:** Base62 encoding provides compact URLs and handles high volume
- **Data Integrity:** PostgreSQL ensures ACID compliance and data consistency
- **Performance:** Two-tier caching (Redis + Database) for optimal response times
- **Maintainability:** Clean code structure makes it easy to extend and modify

## Additional Features to Consider

- Rate limiting for API endpoints
- Analytics tracking for URL usage
- Custom short codes
- Bulk URL shortening
- User authentication and management
- URL validation and security checks




# CDN (Content Delivery Network) Guide

## ✅ What is a CDN (Content Delivery Network)?

A **CDN** is a **network of geographically distributed servers** that **cache and deliver content (like images, JS, CSS, videos, etc.)** from the closest edge server to the user, to **improve performance, reduce latency**, and offload traffic from your origin server.

## 🔥 Why Use a CDN?

* **Faster load times** for users around the globe
* **Reduced bandwidth usage** on your origin servers
* **High availability and redundancy**
* **Protection from DDoS attacks**
* **Scalable delivery** during traffic spikes (e.g., big sale on e-commerce)

## 📦 What Does a CDN Cache?

* Static assets: images, JS, CSS, fonts, videos
* Sometimes API responses (if safe and cacheable)
* Rendered HTML (in SSR/SSG setups like Next.js, Nuxt)

## 🛍️ E-Commerce Use Case with Global CDN

Imagine you're building **a global e-commerce platform** and using a CDN (e.g., Cloudflare, Akamai, AWS CloudFront) to serve:
* Product images
* Static JS/CSS/HTML
* Product pages (SSG or SSR rendered)
* APIs (optional)

### 🔁 The Problem:
*"If a seller adds a new product, how does the CDN get the updated data?"*

Here's the detailed flow and solution:

## 🧠 What Actually Happens

1. A **seller adds a product** via a dashboard (admin or seller portal).
2. This data gets stored in your **database**.
3. Your backend may also:
   * Generate **dynamic product page**
   * Save product image to cloud storage (e.g., S3)
   * Update internal cache
4. **BUT**:
   * The **CDN has already cached** older product list/page.
   * CDN **won't automatically know** the content has changed.

## 🧯 So how do we handle this?

✅ You need to **invalidate or purge** the cache.

### 💡 Option 1: Manual or Automated Cache Invalidation

When product is added:

```typescript
await CDN.purgeCache('/products');
await CDN.purgeCache(`/products/${newProductId}`);
```

* **Invalidate specific paths** in the CDN cache (e.g., `/products`, `/products/123`)
* Most CDN providers offer APIs for purging/invalidation (Cloudflare, Fastly, AWS CloudFront)

### 💡 Option 2: Use Short TTL (Time-to-Live)

Set `Cache-Control` headers with short expiry:

```http
Cache-Control: public, max-age=60
```

This means CDN will **revalidate the content every 60s**.

✅ Good for frequent updates  
❌ Still introduces up to 60s delay

### 💡 Option 3: Use Stale-While-Revalidate

Modern CDNs support **stale-while-revalidate**:

```http
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

* Users get fast response (even stale)
* In background, CDN fetches updated data and refreshes cache

### 💡 Option 4: Don't cache dynamic data

* If product pages are fully dynamic (`/product/:id`), you can skip CDN caching
* Use server-rendering with CDN passthrough or API-level caching

## ✅ Recommended Architecture for Global E-commerce

| Component | Strategy |
|-----------|----------|
| Product images | Stored in S3 / cloud + CDN cached |
| Product page | SSR or SSG + CDN cached |
| Product API | Cached per tenant/category (TTL + purge) |
| Admin/product edit | No caching (direct to backend/db) |
| Invalidation | Trigger via CDN API on product change |

## 🔁 Flow Summary

1. Seller adds product → backend saves to DB/storage
2. Backend triggers:
   * **Purge CDN** for affected pages
   * Or waits for TTL expiry
3. Users then hit the CDN:
   * If cache updated → fast new data
   * If not → backend fetched & cached

## 📌 Final Notes

* CDNs **never know data has changed** until:
   * You **tell** them (purge/invalidate)
   * TTL expires
* Invalidation can be **path-based**, **tag-based**, or **wildcard-based**
* Many frameworks (e.g., Next.js, Nuxt) have built-in hooks for CDN revalidation


# Two-Phase Commit (2PC) Complete Guide

## 🧠 What is Two-Phase Commit (2PC)?

**Two-Phase Commit (2PC)** is a protocol used in **distributed systems** to ensure that a **transaction across multiple services or databases** either **commits completely** or **rolls back entirely**—to maintain consistency.

In simple words: All participants must agree to commit, or **no one commits**.

## 🔄 Real-World Analogy

Imagine you're organizing a group trip and you say:
"We'll only book tickets if **everyone agrees** to go."

1. **Ask Phase**: You ask everyone: *"Can you go on the trip?"*
2. **Confirm Phase**:
   * If **everyone says YES**, you book the tickets.
   * If **anyone says NO**, the whole trip is canceled.

That's 2PC.

## 🏗️ Real Example in Distributed Systems

### Scenario: E-commerce Order System

You have a system with **3 services**:
1. **Order Service** – saves the order
2. **Payment Service** – processes the payment
3. **Inventory Service** – reserves items

You want all 3 to **succeed or fail together** in a single transaction.

## ✍️ Step-by-Step: Two-Phase Commit Protocol

### ✅ **Phase 1: Prepare (Voting)**

* A **coordinator** (e.g. Order Service) sends a `PREPARE` request to all participants (Payment, Inventory).
* Each participant:
   * Executes the operation (e.g. reserve funds, reserve stock).
   * **But does not commit yet.**
   * Replies with `YES` (ready to commit) or `NO` (cannot commit).

### ✅ **Phase 2: Commit/Rollback**

* If **all** participants reply `YES`:
   * Coordinator sends `COMMIT` to all.
   * All participants commit their operations.
* If **any** reply `NO`:
   * Coordinator sends `ROLLBACK` to all.
   * All participants undo any temporary changes.

## 🔁 Sequence Diagram

```
Coordinator    Inventory    Payment
    |              |            |
    |----PREPARE--->|            |
    |               |            |
    |--PREPARE------|----------->|
    |               |            |
    |<---YES--------|            |
    |<----YES-------|------------|
    |               |            |
    |----COMMIT---->|            |
    |               |            |
    |----COMMIT-----|----------->|
```

## 💥 What Happens on Failure?

* If a participant crashes after voting YES but before committing?
   * The coordinator **remembers** decisions via logs (called a **transaction log**).
   * When the node comes back, it **replays** the log to ensure consistency.

## ❌ Drawbacks of 2PC

1. **Blocking**: If the coordinator crashes during commit, all participants **wait indefinitely**.
2. **No Auto Recovery**: Participants need human or custom logic to fix stuck transactions.
3. **Slow**: More network hops + logs make it slower than local transactions.

## ✅ When is 2PC Used?

* **Banking systems** where consistency is critical.
* **Distributed databases** like PostgreSQL with foreign data wrappers.
* **Microservices** when each service uses its own database.

## 🚫 Alternatives in Modern Systems

Due to its **blocking nature**, modern distributed systems often use:

* **Sagas** (choreography/orchestration-based long-running transactions)
* **Eventual consistency** via event sourcing or message queues