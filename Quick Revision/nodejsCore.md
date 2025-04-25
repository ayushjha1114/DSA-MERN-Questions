# Node.js Core Concepts: EventEmitter and Worker Threads

## 🔹 What happens if an event handler throws an error?

### Answer:
If an event handler throws an error inside an `EventEmitter`, and the error is not caught, it can crash the Node.js process. Here's a breakdown:

- By default, `EventEmitter` does not handle exceptions in event listeners.
- If an exception is thrown and not caught inside a listener, it propagates and can cause the application to crash (uncaught exception).
- **Special case**: If the error occurs in a listener of the `error` event and there's no listener for `error`, Node.js will throw and terminate the process.

### Example:
```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('data', () => {
  throw new Error('Something went wrong!');
});

emitter.emit('data'); // This will crash if not caught
```

### Best Practice:
Always wrap listener logic in `try/catch` if there's a risk of throwing:
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

## 🔹 Can you build a Pub/Sub system using EventEmitter?

### Answer:
Yes, Node.js's built-in `EventEmitter` is a simple way to build a basic Publish/Subscribe (Pub/Sub) system.

- **Publisher** emits events (messages).
- **Subscribers** register callbacks for those events.

### Example:
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

### Limitations:
- It's in-process only — not distributed across multiple machines.
- No support for message persistence or delivery guarantees.

For more robust Pub/Sub systems, consider tools like Redis Pub/Sub, Kafka, RabbitMQ, or NATS.

---

## 🔹 Understanding EventEmitter in Node.js

### What is EventEmitter?
`EventEmitter` is a core module in Node.js that allows different parts of your application to communicate asynchronously using events.

### Real-Life Analogy:
- **The band** is the event emitter.
- **The audience** are listeners.
- When the band plays a song (emits an event), the audience responds (listens and reacts).

### Practical Example:
Let’s say you're building a file upload system. When a file is uploaded, you might want to:
- Log the upload
- Send an email
- Resize the image

Instead of calling all those actions directly, you could emit an event called `fileUploaded`, and let other parts of your app handle the response:
```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Listener 1: log upload
emitter.on('fileUploaded', (file) => {
  console.log(`File uploaded: ${file.name}`);
});

// Listener 2: send email
emitter.on('fileUploaded', (file) => {
  console.log(`Sending email about: ${file.name}`);
});

// Emitting the event
const file = { name: 'profile.jpg' };
emitter.emit('fileUploaded', file);
```

---

## 🔹 Building a Mini Express-like Framework with EventEmitter

### Final Output Example:
```javascript
const app = createApp();

app.get('/hello', (req, res) => {
  res.end('Hello World!');
});

app.post('/submit', (req, res) => {
  res.end('Submitted!');
});

app.listen(3000);
```

### Implementation:
```javascript
const http = require('http');
const EventEmitter = require('events');

function createApp() {
  const emitter = new EventEmitter();

  const app = http.createServer((req, res) => {
    const routeKey = `${req.method} ${req.url}`;
    
    if (emitter.listenerCount(routeKey) > 0) {
      emitter.emit(routeKey, req, res);
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  // Define route methods like get, post, etc.
  app.get = (path, handler) => {
    emitter.on(`GET ${path}`, handler);
  };

  app.post = (path, handler) => {
    emitter.on(`POST ${path}`, handler);
  };

  return app;
}
```

### Try It Out:
```javascript
const app = createApp();

app.get('/hello', (req, res) => {
  res.end('Hi from GET!');
});

app.post('/submit', (req, res) => {
  res.end('Received POST!');
});

app.listen(3000, () => {
  console.log('Mini server running at http://localhost:3000');
});
```

---

## 🔹 Understanding Worker Threads in Node.js

### What Are Worker Threads?
Node.js is single-threaded by design. For CPU-intensive tasks like image processing or encryption, `worker_threads` allows you to run JavaScript in parallel on multiple threads.

### When to Use Worker Threads:
- Heavy computations (e.g., crypto, ML, parsing large files)
- Image or video processing
- Avoid blocking the event loop during synchronous tasks

---

## 🔹 Mini Project: Password Hasher with Worker Threads

### Project Structure:
```
password-hasher/
├── main.js            # Express server
├── hasher-worker.js   # Worker thread for hashing
├── package.json
```

### Step 1: Install Dependencies
```bash
npm init -y
npm install express bcrypt
```

### Step 2: Create `hasher-worker.js`
```javascript
const { parentPort, workerData } = require('worker_threads');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const hashed = await bcrypt.hash(workerData.password, 10);
    parentPort.postMessage({ success: true, hashed });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
})();
```

### Step 3: Create `main.js`
```javascript
const express = require('express');
const { Worker } = require('worker_threads');

const app = express();
app.use(express.json());

function runHashWorker(password) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./hasher-worker.js', {
      workerData: { password }
    });

    worker.on('message', (msg) => {
      if (msg.success) resolve(msg.hashed);
      else reject(new Error(msg.error));
    });

    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

app.post('/hash', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).send('Password required');

  try {
    const hashed = await runHashWorker(password);
    res.send({ hashed });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

### Step 4: Test It
Use Postman or curl:
```bash
curl -X POST http://localhost:3000/hash -H "Content-Type: application/json" -d '{"password": "secret123"}'
```
You should get a bcrypt hash back, generated in a worker thread ✅




## 🤝 Difference Between Promise and Promise.all

Both are used to handle asynchronous operations, but they differ in how they behave when dealing with multiple promises.

### ✅ Promise
A `Promise` represents a single asynchronous operation.

```javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done'), 1000);
});

p.then(console.log); // logs "Done" after 1 sec
```

### ✅ Promise.all
`Promise.all` takes an array of promises and:
- Resolves when **all promises are fulfilled**.
- Rejects immediately if **any one fails**.

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3]).then(values => {
  console.log(values); // [1, 2, 3]
});
```

### ❌ If One Fails
If any promise in the array rejects, `Promise.all` fails fast.

```javascript
const p1 = Promise.resolve('A');
const p2 = Promise.reject('Broke');
const p3 = Promise.resolve('C');

Promise.all([p1, p2, p3])
  .then(console.log)
  .catch(err => console.error(err)); // logs "Broke"
```

---

### ⚖️ Promise.all vs Other Promise Aggregators

| **Method**              | **Behavior**                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| `Promise.all()`          | Waits for all to resolve. Fails fast on first rejection.                   |
| `Promise.allSettled()`   | Waits for all. Returns status/result of all (even failed).                 |
| `Promise.race()`         | Returns first resolved/rejected result. Doesn’t wait for all.              |
| `Promise.any()`          | Resolves with first successful one. Only rejects if all fail.             |

---

### 💡 When to Use What?

| **Use Case**                     | **Method**               |
|-----------------------------------|--------------------------|
| All must succeed                  | `Promise.all()`          |
| Need all results, even if some failed | `Promise.allSettled()`   |
| Proceed as soon as one completes  | `Promise.race()`         |
| Only care about the first success | `Promise.any()`          |

---

### 🔹 Real-world Scenario: Calling Multiple APIs in Parallel

Imagine a dashboard that shows:
- Weather info (`weatherAPI`)
- News headlines (`newsAPI`)
- Stock prices (`stocksAPI`)

You want to fetch all three simultaneously to improve performance:

```javascript
const [weather, news, stocks] = await Promise.all([
  fetchWeather(),
  fetchNews(),
  fetchStocks()
]);
```

✅ **Why it’s good**: It speeds up loading — no unnecessary waiting.  
❌ **But**: If any one fails, `Promise.all` fails fast, which leads to the next point...

---

### 🔹 Fail-fast Behavior of Promise.all

`Promise.all()` will reject immediately if any promise fails. It doesn’t wait for the others to complete.

```javascript
try {
  const [a, b, c] = await Promise.all([apiA(), apiB(), apiC()]);
} catch (err) {
  console.error('One failed, all failed:', err);
}
```

💡 **Good** when all results are required, but risky if partial success is acceptable.

---

### 🔹 Handling Individual Errors: Promise.allSettled

If you want all results, even if some fail:

```javascript
const results = await Promise.allSettled([
  fetchWeather(),
  fetchNews(),
  fetchStocks()
]);

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('Success:', result.value);
  } else {
    console.error('Failed:', result.reason);
  }
});
```

✅ **Use `allSettled` for**:
- User dashboards
- Background syncing
- Analytics jobs
- Aggregating 3rd-party API data


