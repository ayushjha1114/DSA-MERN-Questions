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
