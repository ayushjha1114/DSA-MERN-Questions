# Handling Multiple Requests

Here’s a breakdown of how it can handle it, and what you should be careful about:

🧠 By Default: Node.js Server Behavior
Node.js can handle many concurrent requests thanks to its non-blocking I/O.

But CPU-heavy or memory-heavy tasks, like parsing a 100MB CSV, can block the event loop, delaying other requests.

😬 What Can Go Wrong?
If you directly read and parse a 100MB CSV file synchronously or in one big chunk:

🛑 You’ll block the event loop.

🐌 Other incoming requests get delayed or even time out.

💥 If memory use spikes, the server might crash under high load.

✅ Best Practices to Handle It
Stream the CSV file

Use fs.createReadStream() instead of fs.readFile().

Combine with a CSV parser like csv-parser or fast-csv.

js
Copy
Edit
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
Offload heavy processing to a Worker Thread

Node.js worker_threads module lets you run CPU-bound code in separate threads.

Use a Job Queue (e.g., Bull, RabbitMQ)

Offload the request into a job queue.

Return a response like “Your file is being processed,” and notify the client later (e.g., via WebSocket or polling).

Limit concurrency

Add rate-limiting or queue requests server-side to avoid overload.

Scale horizontally

Use a load balancer and spawn multiple Node.js instances if you're expecting high concurrency.

🔁 Scenario: What if 50 users upload 100MB at once?
You must not read all 100MB files into memory at once.

Use streams to keep memory usage low.

Add a processing queue or throttle the requests if necessary.



## 📂 Handling File Uploads with Middleware like Multer

### ✅ What is Multer?
Multer is a middleware for handling `multipart/form-data`, primarily used for file uploads in Node.js (especially with Express).

### 🔧 How It Works (Under the Hood)
1. Form submission (e.g., from an HTML form) sends a `multipart/form-data` request.
2. Multer parses this stream using a parser like `busboy` or its own implementation.
3. It buffers the file into memory or stores it directly to disk (depending on configuration).
4. Populates the `req.file` or `req.files` object for you to access in your route.

### 🧪 Basic Setup Example
```javascript
const express = require('express');
const multer = require('multer');
const app = express();

// Store uploaded file in the 'uploads/' folder
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
  console.log(req.file); // file info
  res.send('File uploaded!');
});
```

### 🧠 Key Concepts

| **Concept**                     | **Explanation**                          |
|----------------------------------|------------------------------------------|
| `upload.single('fieldName')`     | Handles single file upload               |
| `upload.array('photos', 5)`      | Handles multiple files                   |
| `upload.fields([{ name: 'doc' }, { name: 'photo' }])` | Handles multiple fields |
| **Memory storage**               | `multer.memoryStorage()` buffers the file into RAM |
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
- Alternatively, use a signed URL and upload directly from the frontend (avoids Node server load).



🔹 What happens if an event handler throws an error?
Answer:

If an event handler throws an error inside an EventEmitter, and the error is not caught, it can crash the Node.js process. Here's a breakdown:

By default, EventEmitter does not handle exceptions in event listeners.

If an exception is thrown and not caught inside a listener, it propagates and can cause the application to crash (uncaught exception).

Special case: if the error occurs in a listener of the error event and there's no listener for error, Node will throw and terminate the process.

js
Copy
Edit
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('data', () => {
  throw new Error('Something went wrong!');
});

emitter.emit('data'); // This will crash if not caught
Best Practice: Always wrap listener logic in try/catch if there's a risk of throwing:

js
Copy
Edit
emitter.on('data', () => {
  try {
    // risky logic
  } catch (err) {
    console.error('Handled error:', err);
  }
});
🔹 Can you build a Pub/Sub system using EventEmitter?
Answer:

Yes, Node.js's built-in EventEmitter is a simple way to build a basic Publish/Subscribe (Pub/Sub) system.

Publisher emits events (messages).

Subscribers register callbacks for those events.

Example:

js
Copy
Edit
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
Limitations:

It's in-process only — not distributed across multiple machines.

No support for message persistence or delivery guarantees.

For more robust Pub/Sub, use tools like Redis Pub/Sub, Kafka, RabbitMQ, or NATS.