# Handling Multiple Requests

## 🏗️ How Node.js Handles Multiple Large Requests (e.g., 100MB CSV Uploads)

Node.js uses non-blocking I/O for high concurrency, but large files or CPU-heavy tasks require special handling.

### 🚦 Default Node.js Behavior

- Node.js can handle many requests concurrently, but **CPU- or memory-intensive operations** (like parsing a 100MB CSV) can block the event loop.
- Blocking the event loop delays or times out other requests.
- High memory usage can crash the server.

### ⚠️ What Can Go Wrong?

- **Blocking the event loop:** Synchronous or bulk file operations block all requests.
- **Slow responses:** Other users experience delays.
- **Crashes:** Memory spikes can bring down your server.

### ✅ Best Practices

#### 1. **Stream Large Files**

Process files in chunks to keep memory usage low.

```javascript
const fs = require('fs');
const csv = require('csv-parser');

app.post('/process-csv', (req, res) => {
  const results = [];
  fs.createReadStream('file.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json({ message: 'File processed', rows: results.length });
    });
});
```

#### 2. **Offload Heavy Work to Worker Threads**

Use the `worker_threads` module for CPU-bound code.

#### 3. **Use a Job Queue**

Queue heavy jobs (e.g., Bull, RabbitMQ). Respond immediately, notify the client when done (WebSocket, polling, etc.).

#### 4. **Limit Concurrency**

Rate limit or queue incoming requests to avoid overload.

#### 5. **Scale Horizontally**

Run multiple Node.js instances behind a load balancer.

---

### 🔁 Example: 50 Users Uploading 100MB Files Simultaneously

- **Never load all files into memory at once.**
- **Always use streams** for uploads.
- **Throttle or queue** requests to prevent overload.

Following these practices keeps your Node.js server responsive and stable under heavy load.

---

## 📂 Handling File Uploads with Middleware like Multer

### ✅ What is Multer?

Multer is middleware for handling `multipart/form-data`, mainly for file uploads in Node.js (especially with Express).

### 🔧 How It Works

1. Form submission sends a `multipart/form-data` request.
2. Multer parses the stream using a parser (like `busboy`).
3. It buffers the file into memory or stores it on disk (configurable).
4. Populates `req.file` or `req.files` for your route.

### 🧪 Basic Setup Example

```javascript
const express = require('express');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('profilePic'), (req, res) => {
  console.log(req.file);
  res.send('File uploaded!');
});
```

### 🧠 Key Concepts

| **Concept**                     | **Explanation**                          |
|----------------------------------|------------------------------------------|
| `upload.single('fieldName')`     | Handles single file upload               |
| `upload.array('photos', 5)`      | Handles multiple files                   |
| `upload.fields([{ name: 'doc' }, { name: 'photo' }])` | Handles multiple fields |
| **Memory storage**               | `multer.memoryStorage()` buffers file in RAM |
| **Disk storage**                 | Saves file directly to disk              |

### 🛡️ Common Interview Follow-up Questions

#### 🔹 How do you handle file size limits?

```javascript
multer({ limits: { fileSize: 1 * 1024 * 1024 } }) // 1MB
```

#### 🔹 How do you validate file types?

Use the `fileFilter` option:

```javascript
const upload = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG allowed'), false);
    }
  }
});
```

#### 🔹 Where would you store large files?

- Use cloud storage like **S3** or **GCS** (upload via Multer → pipe to cloud storage).
- Or use a signed URL and upload directly from the frontend.

---

### 🔹 What happens if an event handler throws an error?

If an event handler throws an error inside an EventEmitter and it's not caught, it can crash the Node.js process.

- By default, EventEmitter does not handle exceptions in listeners.
- If an exception is thrown and not caught, it can crash the app (uncaught exception).
- If the error occurs in a listener for the `error` event and there's no `error` listener, Node will terminate the process.

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('data', () => {
  throw new Error('Something went wrong!');
});

emitter.emit('data'); // This will crash if not caught
```

**Best Practice:** Wrap listener logic in try/catch if there's a risk of throwing:

```javascript
emitter.on('data', () => {
  try {
    // risky logic
  } catch (err) {
    console.error('Handled error:', err);
  }
});
```

---

### 🔹 Can you build a Pub/Sub system using EventEmitter?

Yes, Node.js's EventEmitter can be used for a basic Pub/Sub system.

- Publisher emits events (messages).
- Subscribers register callbacks for those events.

**Example:**

```javascript
const EventEmitter = require('events');
const pubsub = new EventEmitter();

// Subscriber 1
pubsub.on('message', (data) => {
  console.log('Subscriber 1 received:', data);
});

// Subscriber 2
pubsub.on('message', (data) => {
  console.log('Subscriber 2 received:', data);
});

// Publisher
pubsub.emit('message', 'Hello, world!');
```

**Limitations:**

- In-process only — not distributed.
- No message persistence or delivery guarantees.

For robust Pub/Sub, use Redis Pub/Sub, Kafka, RabbitMQ, or NATS.

---

### ▶️ Q3: Express Performance

Let’s say your API endpoint is slow.  
What are 3 possible reasons for a slow Express route, and how would you troubleshoot?

#### ✅ Stronger Answer

If an Express API is slow, I check for:

**Database Query Bottlenecks**
- Unindexed fields in MongoDB
- Unnecessary or repeated queries (N+1 problem)
- Large data sets returned without pagination

**Inefficient Business Logic**
- Nested loops, blocking code, or complex filtering in-memory
- Not using async operations correctly (e.g., missing await, long sync code)

**Middleware or Network Delays**
- Heavy middlewares like body parsing of large payloads
- CORS misconfiguration, logging overhead, or throttling
- Slow downstream services (e.g., 3rd-party APIs)

**How I troubleshoot:**
- Use tools like `console.time`, Postman response time, or Node.js debug logging
- Add profiling logs before and after DB calls
- Use MongoDB Compass or explain plans to analyze query performance


---

## 🔒 Refresh Token Security Best Practices

- **Storage:** Use **HTTP-only cookies** for refresh tokens to prevent XSS attacks. Avoid `localStorage` as it is accessible via JavaScript and vulnerable to XSS.
- **Replay Protection:** Implement **refresh token rotation**—invalidate the old token each time a new one is issued.
- **Logout/Revocation:** Maintain a **server-side token blacklist** or use **short-lived access tokens** with frequently rotated refresh tokens.

---

## 🔁 Kafka Consumer Retry Strategies

- **No Automatic Retries:** Kafka does **not** retry message consumption automatically if a consumer crashes or throws an error. You must handle retries in your consumer logic.
- **Retry Approaches:**
  - **Try-Catch + Retry Logic:** Implement manual retry logic in your consumer code.
  - **Dead Letter Topic (DLT):** After a configurable number of failed attempts, send the message to a DLT for later inspection or reprocessing.
  - **Exponential Backoff:** Use exponential backoff for retries to avoid overwhelming downstream services (e.g., SES, WebSocket servers).

  ### 🔧 Internal Architecture (Suggested)

  ```mermaid
  flowchart TD
    A[Kafka Topic<br/>(form-events)] --> B[Notification Microservice<br/>Kafka Consumer]
    B --> C[Notification Router]
    C --> D[EmailHandler<br/>AWS SES]
    C --> E[WebSocketHandler]
    C --> F[Retry Manager / DLT]
  ```

  **Flow Explanation:**

  - **Kafka Topic (form-events):** Receives events to be processed.
  - **Notification Microservice (Kafka Consumer):** Consumes events from the topic.
  - **Notification Router:** Directs events to appropriate handlers.
    - **EmailHandler → AWS SES:** Sends emails via AWS SES.
    - **WebSocketHandler:** Sends real-time notifications via WebSockets.
    - **Retry Manager / DLT:** Handles failed notifications and retries or moves them to a Dead Letter Topic.


-----------------------------------------------------------------------------------------


### 📌 Bonus: Using Presigned URLs for File Uploads

For large files or improved scalability, use **presigned S3 URLs**:

1. **Generate a presigned S3 URL** on your backend.
2. **Let the client upload directly to S3** using that URL.
3. **Avoids sending large file data through your Node.js server.**
4. **Store file metadata in your database** after upload (triggered by a client callback or AWS Lambda).

---

### 🔐 Bonus: Secure File Access with Signed URLs

When a user requests to download a file:

1. **Validate user permissions** (e.g., check if `userId` matches).
2. **Generate a temporary signed URL** (e.g., valid for 10 minutes) using `getSignedUrl` from the AWS SDK.
3. **Send the signed URL to the client** for secure, time-limited access.

This approach ensures files remain private and are never publicly exposed.


------------------------------------------------------------------------------------------------------

## 🚦 How to Implement Rate Limiting in Node.js

Rate limiting helps prevent abuse and ensures fair usage of your API. In Node.js, you can use middleware packages like:

- **[express-rate-limit](https://www.npmjs.com/package/express-rate-limit):** Simple, memory-based.
- **[rate-limiter-flexible](https://www.npmjs.com/package/rate-limiter-flexible):** Advanced, supports Redis for distributed rate limiting.

### 🧩 How It Works

You can throttle requests based on:

- IP address
- User ID
- API Key

**Note:** Memory-based solutions work for a single server. If you scale horizontally (multiple Node.js instances), each instance tracks limits separately—users could bypass limits by switching servers.

### 🌐 Distributed Rate Limiting

To enforce limits across all servers, use a central store like **Redis** to share counters.

**Example Redis key:**

```
key: "rate-limit:user-123"
value: {
  count: 5,
  expiresAt: timestamp
}
```

Now, all instances share the same user/IP limits.

---

### 🛠️ Implementation Example: Express + rate-limiter-flexible + Redis

#### 1. **Install Dependencies**

```bash
npm install express rate-limiter-flexible ioredis
```

#### 2. **server.js Example**

```javascript
const express = require('express');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('ioredis');

const app = express();
const redisClient = new Redis({
  host: 'localhost',  // your Redis host
  port: 6379,         // default Redis port
  enableOfflineQueue: false
});

// Create rate limiter instance
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rlflx',     // prefix for keys in Redis
  points: 10,             // Number of requests allowed
  duration: 60,           // Per 60 seconds
  blockDuration: 60       // Block for 1 minute if limit exceeded
});

// Middleware to rate limit based on IP
const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip); // Or use req.user.id for logged-in users
    next();
  } catch (err) {
    res.status(429).json({
      message: 'Too Many Requests. Please try again later.'
    });
  }
};

app.use(rateLimitMiddleware);

app.get('/api/data', (req, res) => {
  res.send('Data retrieved successfully.');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

### ✅ Benefits

- **Works across multiple Node.js instances**
- **Centralized usage counts in Redis**
- **Easy to customize** (API key, per-user plans, cooldowns)

---

**Summary:**  
For scalable rate limiting, use `rate-limiter-flexible` with Redis. This ensures consistent limits across all your Node.js servers.


-----------------------------------------------------------------------------------------------------------------------------


## 🧠 Caching Strategies in Node.js Microservices

Caching can dramatically improve performance and reduce load on your backend. Here’s a structured overview:

---

### 1. Where Can You Use Caching?

- **🔍 API responses:** e.g., product lists, user profiles
- **🧮 Expensive computations:** e.g., analytics, aggregations
- **🌍 External API results:** e.g., geolocation, currency rates
- **🧾 Database query results:** frequently accessed data

---

### 2. Types of Caching

| **Type**        | **Location**         | **TTL**             | **Use Case**                                 |
|-----------------|---------------------|---------------------|----------------------------------------------|
| In-memory       | Node.js process     | Seconds–minutes     | Fastest, but not shared across servers       |
| Distributed     | Redis, Memcached    | Configurable        | Shared, scalable, survives restarts          |
| CDN/Edge        | Cloudflare, Fastly  | Minutes–hours       | Static assets, public content                |

---

### 3. Common Node.js Caching Tools

- **🔴 Redis:** Most popular for distributed caching
- **📦 node-cache:** Simple in-memory cache
- **💡 axios-cache-interceptor:** Caches HTTP requests
- **🧠 Custom middleware:** For route-level or custom caching logic

---

### 4. Real-World Example: Caching a DB Query in Redis

```javascript
const express = require('express');
const Redis = require('ioredis');
const redis = new Redis();
const app = express();

const getUserFromDb = async (userId) => {
  // Simulate slow DB call
  return { id: userId, name: 'Ayush Jha', email: 'ayush@example.com' };
};

app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `user:${id}`;

  // 1. Try fetching from cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json({ source: 'cache', data: JSON.parse(cached) });
  }

  // 2. If not in cache, fetch from DB
  const user = await getUserFromDb(id);

  // 3. Store in cache with TTL (e.g., 60 seconds)
  await redis.set(cacheKey, JSON.stringify(user), 'EX', 60);

  res.json({ source: 'db', data: user });
});

app.listen(3000, () => {
  console.log('Caching server on http://localhost:3000');
});
```

---

### 5. Best Practices

- ✅ **Cache Invalidation:** Clear or update cache after data changes.
- ✅ **Set Appropriate TTL:** Too long = stale data; too short = less effective.
- ✅ **Namespaced Keys:** e.g., `user:123`, `product:456`.
- ✅ **Include Query Parameters:** For paginated/filterable data, include filters in the cache key.

---

### 🕓 What is TTL in Caching?

**TTL (Time-To-Live)** defines how long a cached item remains before expiring.

- In Redis:  
  ```js
  redis.set(cacheKey, JSON.stringify(data), 'EX', 60);
  ```
  This keeps `cacheKey` for 60 seconds, after which Redis deletes it automatically.

**Benefits:**  
- Prevents stale data  
- Controls memory usage  
- No need for manual deletion

---

### 🧪 Caching Challenge Question

**Scenario:**  
You’re building a microservice that fetches products from PostgreSQL with:

- Category filters: `/products?category=electronics`
- Pagination: `page=1&pageSize=10`

You want to cache each response in Redis for 30 seconds.

**Question:**  
How would you design the Redis cache key to ensure:

- Unique cache entries per filter and pagination
- No cache collisions across users

---

#### ✅ Ideal Redis Key Format

A good cache key format:

```
products:category=electronics:page=1:limit=10
```
or simplified:
```
products:electronics:1:10
```

**How to construct:**
```js
const cacheKey = `products:${category}:${page}:${limit}`;
```

- Unique for each combination of category, page, and limit
- Prevents collisions between different queries

**Bonus:**  
If results are user-specific, prefix with user ID:
```
user:123:products:electronics:1:10
```
But for shared product listings, global keys (not tied to user) are best.


---

## 🔐 SSO Login Using AWS Cognito and Azure AD (with Lambda & S3 Data Sync)

### Overview

This section covers how to set up Single Sign-On (SSO) using AWS Cognito and Azure Active Directory (AD), and how to handle secure token management and data synchronization with Lambda and S3.

---

### **Authentication Flow & SSO Architecture**

#### **How SSO Works with AWS Cognito and Azure AD**

1. **AWS Cognito Basics**
  - **User Pools:** Manage user sign-up/sign-in.
  - **Identity Pools:** Enable federated identities (sign in via Google, Facebook, or enterprise providers like Azure AD).

2. **Configuring SSO with Azure AD via AWS Cognito**
  - **Azure AD Setup:**
    - Register your app in Azure AD (Enterprise App).
    - Define redirect URIs (e.g., Cognito callback URL).
    - Set up claims mapping (email, name, etc.).
  - **Cognito Setup:**
    - Create a User Pool or use Federation through Identity Pools.
    - Add Azure AD as a SAML or OIDC Identity Provider.
    - Provide Azure metadata (client_id, client_secret, endpoints).
  - **Authentication Flow:**
    1. User initiates login.
    2. Redirected to Azure AD login page.
    3. After login, Azure AD redirects back to Cognito with tokens/assertions.
    4. Cognito processes and issues JWT tokens (`id_token`, `access_token`, `refresh_token`) for your app.

---

### **Token Security & Management**

- **Storage:** Store tokens in secure, HttpOnly cookies or in-memory (avoid localStorage for refresh tokens).
- **Access Tokens:** Short-lived (e.g., 1 hour).
- **Refresh Tokens:** Used for silent re-authentication.
- **Validation:** Always verify JWT signature and expiration on every request.

---

### **Common Challenges & Solutions**

| **Problem**                   | **Solution**                                                      |
|-------------------------------|-------------------------------------------------------------------|
| Token expiration              | Implement refresh token flow.                                     |
| Multiple IdPs (Azure + Cognito)| Use Cognito Identity Pools and federation rules.                  |
| Claims mismatch/missing info  | Configure custom attribute mapping in Azure or Cognito.           |
| Logout propagation            | Use Cognito's `globalSignOut` API or Azure logout endpoints.      |

---

## 📡 Real-Time Notification System (Kafka + WebSocket)

### **Step-by-Step Flow**

1. **Client Places an Order**
  - Frontend (React/mobile) calls: `POST /api/orders`
  - Node.js service processes order and produces a Kafka message:
    ```json
    { "userId": "...", "orderId": "...", "event": "ORDER_PLACED", "timestamp": "..." }
    ```

2. **Kafka Handles the Event**
  - Retains events (e.g., 14 days).
  - Replicates across brokers for durability.
  - Scales via topic partitions (parallel consumption).

3. **Notification Service Consumes the Event**
  - Microservice subscribes to `order-events` topic.
  - Saves notification to DB (MongoDB/PostgreSQL).
  - Emits message via WebSocket (or Socket.IO) to clients.

4. **Client Receives Real-Time Notification**
  - Client maintains WebSocket connection (e.g., `ws://notifications.yoursite.com`).
  - Receives:
    ```json
    { "type": "ORDER_PLACED", "message": "Your order has been placed!", "orderId": "1234" }
    ```
  - Displays toast or updates Redux store.

5. **Handling Offline Users**
  - WebSocket won’t deliver if offline.
  - Event is stored in Kafka and DB.
  - On next login, fetch missed notifications via REST:
    ```
    GET /api/notifications?since=lastLoginTime
    ```

---

### **Enhancements & Best Practices**

| **Feature**                | **Tool/Tech**                        |
|----------------------------|--------------------------------------|
| Push Notifications (mobile)| AWS SNS, Firebase Cloud Messaging    |
| Retry logic                | Kafka retry topics, Dead Letter Queues|
| Read/Unread status         | Store flags in DB per user/message   |
| High load                  | Kafka partitions + horizontal scaling|
| Fault tolerance            | Kafka replication + consumer retries |

---



### 1. What is Node.js and why use it?

**Answer:**  
Node.js is a JavaScript runtime built on Chrome’s V8 engine that lets you run JS on the server. It’s popular because it’s:

- **Event-driven, non-blocking I/O:** Handles many concurrent connections efficiently.
- **Single-language stack:** JS everywhere (browser + server).
- **Rich ecosystem:** npm with hundreds of thousands of modules.

---

### 2. Explain the Event Loop

**Answer:**  
The event loop is Node’s heart—it processes callbacks, I/O events, timers, and “next ticks.” Internally it has phases (timers, pending callbacks, poll, check, etc.).

```javascript
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
// Output:
// start
// end
// promise
// timeout
```

- Promise callback runs in the microtask queue (before timers).
- setTimeout callback runs in the timers phase.

---

### 🔄 Event Loop Phases (Simplified)

- **Timers Phase:** Handles `setTimeout` and `setInterval` callbacks.
- **Pending Callbacks:** Executes I/O callbacks deferred to the next loop.
- **Idle / Prepare:** Internal use, rarely relevant for app code.
- **Poll:** Retrieves new I/O events; executes I/O-related callbacks.
- **Check:** Executes `setImmediate()` callbacks.
- **Close Callbacks:** Handles closed connections, e.g., `socket.on('close')`.
- **Microtasks Queue:** Runs `process.nextTick()` and Promise callbacks.

> **Note:**  
> - `process.nextTick()` and Promises (microtasks) run **after the current operation, before any I/O or timer callbacks**.

---

#### 🧪 Example: Execution Order

```javascript
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
```

**Output:**
```
nextTick
promise
timeout
immediate
```

---

### 🧰 Use Cases

#### ✅ `process.nextTick()` — Microtasks

- For critical code that must run **before any I/O or timers**.
- Used internally for cleanup or error propagation.
- **Caution:** Overusing can starve the event loop!

```javascript
function criticalUpdate() {
  process.nextTick(() => {
    // Runs after current function completes, before anything else
    console.log('Critical follow-up');
  });
  console.log('Main function done');
}
```

#### ✅ `setImmediate()` — Post-I/O Tasks

- Runs code **after I/O operations complete**.
- Useful for scheduling heavy tasks without blocking microtasks.

```javascript
const fs = require('fs');
fs.readFile('file.txt', () => {
  setImmediate(() => {
    console.log('After I/O — safe to run heavy logic');
  });
});
```

---

#### ❗ Warning: Overusing `nextTick`

```javascript
function infiniteLoop() {
  process.nextTick(infiniteLoop);
}
infiniteLoop(); // ❌ Starves the event loop; timers and I/O never run
```
> `setImmediate` would not block the event loop this way.

### 3. How do you handle asynchronous operations?

**Answer:**

- **Callbacks:**  
  ```javascript
  fs.readFile(path, (err, data) => { ... });
  ```
- **Promises:**  
  ```javascript
  fs.promises.readFile(path)
    .then(data => ...)
    .catch(err => ...);
  ```
- **async/await:**  
  ```javascript
  async function read() {
    try {
      const data = await fs.promises.readFile(path);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }
  ```

---

### 4. What is require vs. import?

**Answer:**

- **CJS (require):** Node’s original module system. Synchronous, can be called conditionally.
- **ESM (import):** Standard JS modules. Asynchronous, static (cannot be called inside functions unless dynamically with import()).

```javascript
// CJS
const express = require('express');
// ESM (in package.json: "type":"module")
import express from 'express';
```

---

### 5. How do you read and write files?

```javascript
const fs = require('fs');

// Callback
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promise / async-await
const fsPromises = fs.promises;
async function writeAndRead() {
  await fsPromises.writeFile('out.txt', 'Hello');
  const content = await fsPromises.readFile('out.txt', 'utf8');
  console.log(content);
}
writeAndRead();
```

---

## 🔵 Mid-Level

### 1. Explain Streams and give an example

**Answer:**  
Streams let you process data piece-by-piece (e.g., file I/O, HTTP requests) without loading it all into memory. There are four types: Readable, Writable, Duplex, Transform.

```javascript
const fs = require('fs');
const readStream = fs.createReadStream('large-file.txt', { encoding: 'utf8' });
const writeStream = fs.createWriteStream('out.txt');

readStream
  .pipe(writeStream)
  .on('finish', () => console.log('Done'));
```

---

### 2. How do you handle errors in async code?

```javascript
// With Express
app.get('/user/:id', async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err); // passes to Express error-handler
  }
});

// Global handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});
```

---

### 3. What are Worker Threads and when to use them?

**Answer:**  
Node is single-threaded for JS, but CPU-bound work can block the event loop. Worker Threads let you run JS in separate threads.

```javascript
// main.js
const { Worker } = require('worker_threads');
const worker = new Worker('./worker.js');
worker.on('message', msg => console.log('From worker:', msg));

// worker.js
const { parentPort } = require('worker_threads');
let count = 0;
for (let i = 0; i < 1e9; i++) count++;
parentPort.postMessage(count);
```

---

### 4. Clustering to scale on multi-core CPUs

```javascript
// cluster.js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  http.createServer((req, res) => {
    res.end('handled by PID ' + process.pid);
  }).listen(8000);
}
```

---

### 5. Using a framework: Express vs. Koa vs. NestJS

- **Express:** Minimal, middleware-based.
- **Koa:** Modern, uses async functions and contexts.
- **NestJS:** Full-featured, uses decorators and dependency injection (like Angular).

```typescript
// NestJS example (TypeScript)
import { Controller, Get } from '@nestjs/common';
@Controller('cats')
export class CatController {
  @Get() findAll() { return ['meow', 'purr']; }
}
// bootstrapped in main.ts with NestFactory.create(AppModule)
```

---

## 🔴 Senior Level

### 1. Microservices architecture in Node.js

- Split by business domain, each service with its own database.
- Communicate via HTTP/REST, gRPC, or a message broker (RabbitMQ, Kafka).
- Deploy independently (Docker, Kubernetes).

```javascript
// example: simple service using Express + Axios for service-to-service call
app.get('/order/:id', async (req, res) => {
  const order = await getOrder(req.params.id);
  const user = await axios.get(`http://user-svc/user/${order.userId}`);
  res.json({ order, user: user.data });
});
```

---

### 2. Implementing a rate-limiter (sliding window)

```javascript
// simple in-memory sliding window
const requests = new Map(); // key: IP, value: [timestamps]

function rateLimiter(req, res, next) {
  const now = Date.now();
  const windowSize = 60_000; // 60s
  const maxReq = 100;
  const ip = req.ip;
  const times = requests.get(ip) || [];
  const filtered = times.filter(ts => now - ts < windowSize);
  filtered.push(now);
  requests.set(ip, filtered);
  if (filtered.length > maxReq) return res.status(429).send('Too many requests');
  next();
}
app.use(rateLimiter);
```

---

### 3. Database connection pooling

```javascript
// with mysql2
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost', user: 'root', database: 'test', waitForConnections: true, connectionLimit: 10
});
async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
```

---

### 4. Security best practices

- Use Helmet to set HTTP headers.
- Input validation/sanitization (Joi, express-validator).
- Avoid `eval`, use parameterized queries to prevent injection.
- Rate limiting, CORS configuration.

---

### 5. Observability: Logging & Metrics

- Winston or Pino for structured logs.
- Prometheus + express-prom-bundle for metrics.
- Distributed tracing (Jaeger, OpenTelemetry).

---

## ⚫ Lead Level

### 1. Designing a high-throughput API platform

- Use API gateway (Kong, AWS API Gateway).
- Load balancing across Node clusters or containers.
- Auto-scaling (Kubernetes HPA, AWS ECS/EKS).
- Circuit breakers (Opossum) to handle downstream failures.

---

### 2. CI/CD for Node.js services

- Linting & tests on every PR (ESLint, Jest/Mocha).
- Build & containerize (Docker).
- Deploy via pipelines (GitHub Actions, Jenkins, GitLab CI) to staging/production.
- Canary or blue/green deployment strategies.

---

### 3. Monorepo management

- Tools: Nx, Lerna, Turborepo.
- Shared code (utilities, types) in packages.
- Fine-grained builds and caching.

---

### 4. Migrating from monolith to microservices

- **Strangler pattern:** Incrementally extract functionality into services.
- Use Module Federation (for frontends) and API mesh (for backends).

---

### 5. Future trends & platform evolution

- Edge computing (Cloudflare Workers, Fastly Compute@Edge).
- Serverless (AWS Lambda, Azure Functions) for bursty workloads.
- TypeScript everywhere for safer code at scale.
- GraphQL federation for unified API across services.

---

## 🟠 Circuit Breaker Design Pattern

The **Circuit Breaker** is a resiliency pattern that helps your application avoid repeated failures when calling an unstable downstream service.

### 🎯 Problem It Solves

If a downstream service is down or slow, repeated calls can:

- Hang (waiting for a timeout), tying up resources.
- Fail, returning errors back to your users.
- Potentially retry, making the downstream even more overloaded.

### 🔄 How It Works

The circuit breaker tracks the health of calls and has three states:

| State      | Behavior                                                                                   |
|------------|-------------------------------------------------------------------------------------------|
| Closed     | Calls go through as usual. If failures exceed a threshold, trips to Open.                 |
| Open       | Calls are short-circuited—fail immediately without calling the downstream service.        |
| Half-Open  | Allows a limited number of test requests. If they succeed, closes again; else, re-opens.  |

```
    ┌─────────┐        success        ┌─────────┐
    │  Closed │────────────────────▶│  Open   │
    └─────────┘                      └─────────┘
        ▲  │                           │  │
fail │  │                           │  │ after timeout
        │  │fail                      │  ▼
    ┌──────────┐      test success   ┌───────────┐
    │Half-Open │────────────────────▶│  Closed   │
    └──────────┘                      └───────────┘
          │  │
 test fail│  │
          ▼  │
       ┌─────────┐
       │  Open   │
       └─────────┘
```

#### Key Parameters

- **Failure Threshold:** Number or percentage of failed calls before tripping open.
- **Reset Timeout:** How long the breaker stays open before transitioning to half-open.
- **Half-Open Probes:** Number of test calls allowed through when half-open.
- **Fallback Behavior:** What to do when the breaker is open (static response, cached value, etc.).

#### Example in Node.js (using Opossum)

```javascript
const CircuitBreaker = require('opossum');
const axios = require('axios');

// 1. Wrap the downstream call
async function fetchUser(id) {
  const res = await axios.get(`https://user-service/users/${id}`);
  return res.data;
}

// 2. Create a breaker around it
const breaker = new CircuitBreaker(fetchUser, {
  timeout: 5000,               // fail if no response in 5s
  errorThresholdPercentage: 50,// trip if ≥50% of calls fail
  resetTimeout: 30000          // try again after 30s
});

// 3. Optional event hooks
breaker.on('open',    () => console.warn('Circuit is OPEN'));
breaker.on('halfOpen',() => console.info('Circuit is HALF-OPEN'));
breaker.on('close',   () => console.info('Circuit is CLOSED'));

// 4. Use it in your code
async function getUserProfile(req, res) {
  try {
    const user = await breaker.fire(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(503).send({ error: 'Service unavailable. Please try again later.' });
  }
}
```

**Why Use It?**

- **Fast Failures:** Don’t wait on slow/time-out calls—fail immediately.
- **System Stability:** Prevent your service from being overwhelmed by repeated retries.
- **Graceful Recovery:** Automatically test and restore connectivity when downstream heals.

---

## 🟡 Strangler Pattern: Easing Out the Monolith

The **Strangler Pattern** lets you gradually migrate from a monolith to microservices.

### How it works

1. Identify a slice of functionality in your monolith (e.g., user profiles).
2. Build a new microservice that implements just that slice.
3. Redirect traffic for that feature from the monolith to your new service.
4. Remove the old code from the monolith once all traffic goes to the microservice.
5. Repeat for the next feature.

### Why it matters

- **Low risk:** Test and deploy small pieces independently.
- **Continuous delivery:** Deliver value incrementally.
- **Rollback safety:** If the new service misbehaves, you can route back to the monolith for that feature.





## ECMAScript 2020 (ES11) Key Features

ECMAScript 2020 (ES11) introduced several useful features to JavaScript. Here are some of the most important ones, with explanations and examples:

---

### ✅ 1. `Promise.allSettled()`

Waits for all promises to settle (either fulfilled or rejected) and returns their results. Useful for aggregating the status of parallel async tasks.

```javascript
const promises = [
  Promise.resolve('✅'),
  Promise.reject('❌'),
];

Promise.allSettled(promises).then(console.log);
/*
[
  { status: 'fulfilled', value: '✅' },
  { status: 'rejected', reason: '❌' }
]
*/
```

---

### ✅ 2. Optional Chaining (`?.`)

Safely access deeply nested properties without throwing errors if a reference is `undefined` or `null`.

```javascript
const user = { profile: { name: 'Alice' } };
console.log(user.profile?.name);      // 'Alice'
console.log(user.address?.street);    // undefined (no error)
```

---

### ✅ 3. Nullish Coalescing Operator (`??`)

Returns the right-hand side if the left is `null` or `undefined`. Unlike `||`, it does not treat `0`, `''`, or `false` as fallback cases.

```javascript
const value = null ?? 'default'; // 'default'
const value2 = 0 ?? 10;          // 0 (not replaced like with `||`)
```


## Express.js Root-Level Middleware

Express.js supports **root-level middleware**, which is middleware applied globally to all routes in your Express app.

---

### ✅ What is Root-Level Middleware?

Root-level middleware is registered on the top-level app instance and is invoked on every request, unless restricted by a path or condition.

---

### ✅ Example

```js
const express = require('express');
const app = express();

// Root-level middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Move to the next middleware or route handler
});

// Route
app.get('/hello', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

### 💡 Scoping Middleware to Specific Paths

You can also scope middleware to specific paths:

```js
app.use('/api', (req, res, next) => {
    console.log('API middleware');
    next();
});
```

---

### ✅ Built-in Middleware at Root

You can use built-in middleware like:

```js
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
```


