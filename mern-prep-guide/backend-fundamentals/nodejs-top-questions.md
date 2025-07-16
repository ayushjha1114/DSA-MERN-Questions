## Q2: What's the Difference Between `process.cwd()` vs `__dirname`

- `__dirname` gives the physical location of the current file.
- `process.cwd()` gives the execution context's root path.

**Usage:**
- In large codebases, prefer `__dirname` when loading config files relative to modules.
- Use `process.cwd()` in scripts or CLI tools that assume execution from project root.

---

## Q4: Name Some Built-in Globals in Node.js

Key globals:

- `process` – for environment control and graceful exits.
- `global` – rarely used, but useful for shared mocks in tests.
- `__dirname` and `__filename` – for cross-platform file path resolution.
- `Buffer` – for binary data manipulation (e.g., Kafka, file streams).

---

## Q6: What Are the Benefits of Using Node.js?

### 🚀 Benefits of Using Node.js

1. **Non-blocking I/O and Asynchronous Architecture**
    - Node.js uses an event-driven, non-blocking I/O model.
    - Handles thousands of concurrent connections efficiently.

    **Example:**
    ```javascript
    const http = require('http');
    http.createServer((req, res) => {
      res.end("Hello, World!");
    }).listen(3000);
    ```
    - Handles thousands of requests per second without blocking.

    **Real-World:**  
    In high-concurrency apps (chat, REST API, gaming backends), Node.js reduces infrastructure costs by needing fewer threads.

2. **Single Programming Language (JavaScript) for Full Stack**
    - JavaScript is used both on frontend and backend.
    - Speeds up development, simplifies hiring, enables code sharing.

    **Example:**
    ```javascript
    // Shared schema object
    const userSchema = {
      name: { required: true },
      email: { required: true, pattern: /@/ }
    };
    ```

3. **Extensive Ecosystem (npm)**
    - Access to libraries for almost everything: HTTP clients, OAuth, AWS SDKs, testing tools, real-time communication, etc.

    **Real-World:**  
    Scaffold a microservice in minutes using:
    - `express` for HTTP server
    - `mongoose` for MongoDB
    - `jsonwebtoken` for auth
    - `bull` for queues
    - `jest` or `mocha` for testing

4. **Scalability for I/O-Heavy Applications**
    - Ideal for APIs, real-time chat, file upload/download, proxies, BFFs.

    **Architecture Example:**
    - REST API
    - Message Queue consumers (Kafka/RabbitMQ)
    - Redis for caching
    - MongoDB/PostgreSQL as DB

5. **Fast Development Cycle**
    - JavaScript’s flexibility and npm’s richness.
    - Hot-reloading tools like `nodemon` and `ts-node-dev` improve DX.
    - Rapid prototyping for startups or MVPs.

6. **Built-In JSON Support**
    - JSON parsing and serialization are native.

    **Example:**
    ```javascript
    res.json({ userId: 123, status: "active" });
    ```

7. **Strong Real-Time Capabilities**
    - Native support for WebSockets and event-driven programming.
    - Libraries like Socket.IO make building chat apps, live dashboards, or games easier.

    **Real-World:**  
    In a live stock trading dashboard, Node.js fetches updates via Kafka and pushes to frontend via WebSocket instantly.

8. **Microservices & Serverless Friendly**
    - Small footprint, suitable for serverless functions and microservices.

    **Example:**
    ```javascript
    // AWS Lambda handler
    exports.handler = async (event) => {
      return { statusCode: 200, body: JSON.stringify({ msg: "OK" }) };
    };
    ```

9. **Thriving Community & Corporate Backing**
    - Supported by OpenJS Foundation, Netflix, PayPal, LinkedIn, Walmart.

10. **Cross-Platform Support for Tools**
     - Tools like Electron and NW.js enable building desktop apps (e.g., VS Code).
     - Tools like `pkg` can bundle Node.js apps for deployment as binaries.

---

### 🧠 When Node.js is a Great Choice

- Real-time apps (chat, games)
- REST/GraphQL APIs
- API Gateways / BFFs
- Streaming applications (media, logs)
- Serverless or microservices
- Lightweight CLI tools

---

### ⚠️ Caveats (Where Node.js May Not Be Ideal)

| Limitation                | Detail                                                                 |
|---------------------------|------------------------------------------------------------------------|
| CPU-heavy tasks           | Node.js is single-threaded. Use Worker Threads, `child_process`, or offload to services. |
| Strong typing by default  | JavaScript lacks type safety; mitigate with TypeScript.                |
| Callback Hell             | Solved with Promises, async/await, and structured concurrency.         |
| Deep multithreading       | Better handled by Java, Go, or Rust in compute-heavy domains.          |

---

### 📌 Summary

| Benefit                  | Description                                      |
|--------------------------|--------------------------------------------------|
| 🚦 Non-blocking I/O      | Efficient concurrency with low resource usage     |
| 🧠 Unified Language      | Full stack JS; simpler knowledge sharing         |
| 📦 npm Ecosystem         | Reusable components and rapid development        |
| 📡 Real-time Ready       | Built-in support for WebSockets                  |
| ☁️ Microservice/Serverless Fit | Lightweight and fast startup               |
| 🧰 Developer Friendly    | Hot reload, fast prototyping, JSON-native        |
| 🧱 Scalable              | Great for I/O-bound systems with 1M+ users       |

---

## Node.js Project Suitability Checklist

As a Lead/Expert Node.js Developer, your responsibility is not just to promote Node.js—but to objectively determine when it's the right tool for the job. Use this framework and checklist to guide your decision.

### ✅ Criteria to Choose Node.js for a Project

1. **Project Type & Domain Suitability**

    | Project Type                                 | Suitability for Node.js         |
    |----------------------------------------------|---------------------------------|
    | Real-time Apps (chat, games, collaboration)  | ✅ Excellent                    |
    | APIs/Microservices (REST/GraphQL, BFFs)      | ✅ Ideal                        |
    | Serverless & Cloud Functions                 | ✅ Great fit                    |
    | Streaming Platforms                          | ✅ Suited                       |
    | Command-Line Tools                           | ✅ Lightweight                  |
    | CPU-bound Systems (image processing, ML)     | ❌ Better alternatives (Rust, Go, Java) |
    | Enterprise-grade Transaction Systems         | ⚠️ Use with caution             |

2. **Concurrency & I/O Needs**
    - If your app is I/O bound (DB, cache, file, API), Node.js is a top choice.
    - For CPU-bound workloads (e.g., video encoding), Node.js is not ideal unless you offload work.

3. **Team Expertise & Tech Stack**
    - ✅ Choose Node.js if:
      - Your team is experienced in JavaScript/TypeScript.
      - You're building a full-stack app using React/Vue/Angular.
      - You want to share code between frontend and backend.
    - ❌ Avoid Node.js if:
      - Your team prefers strongly typed languages like Java or Go.
      - Unfamiliar with async patterns (Promises, async/await, streams, event-driven design).

4. **Time-to-Market & MVP**
    - Node.js is great for startups or MVPs due to fast development and npm ecosystem.

5. **Ecosystem and Community Maturity**

    | Need               | Node.js Ecosystem Examples                |
    |--------------------|-------------------------------------------|
    | API Gateway        | Kong, Express Gateway, Fastify            |
    | Auth/Security      | jsonwebtoken, passport, bcrypt, OWASP     |
    | Real-time          | socket.io, ws, WebRTC                     |
    | CI/CD              | GitHub Actions, Docker, Serverless Framework |
    | Logging/Monitoring | Winston, Pino, Elastic, Datadog SDKs      |

6. **Deployment & Infrastructure Fit**
    - Fits well in cloud-native, containerized environments (Docker + Kubernetes).
    - Perfect for serverless platforms: AWS Lambda, Vercel, Netlify, Azure Functions.

7. **Scalability Requirements**
    - Node.js scales well horizontally (clustering/load balancing).
    - Ideal for:
      - 💬 Real-time WebSocket connections
      - 🌐 High API request throughput
      - ⚙️ Worker-based async jobs (Redis, RabbitMQ, etc.)

---

### 💡 Real-World Use Case Comparison

| Use Case                | Why Choose Node.js                                               |
|-------------------------|------------------------------------------------------------------|
| Chat app (Slack-like)   | Persistent WebSocket connections, real-time message delivery     |
| E-commerce API          | Fast response, microservices-ready, shared validation            |
| Streaming app           | Handles thousands of concurrent streaming sessions efficiently   |
| Dev Tool CLI            | Cross-platform compatibility, fast boot                          |
| API Gateway             | Lightweight, fast proxy routing, custom auth/middleware          |
| Serverless Functions    | Fast cold starts, JSON-native, npm ecosystem                     |

---

### 🚫 When NOT to Choose Node.js

| Scenario                        | Better Alternative                        |
|----------------------------------|-------------------------------------------|
| Heavy Image/Video Processing     | Rust, C++, Go                             |
| Complex Multithreading          | Java (ForkJoinPool), Go                   |
| Math-heavy simulations or ML     | Python (TensorFlow, NumPy)                |
| Financial transaction systems   | Java/.NET with strong typing and transaction support |


## Q7: What is Callback Hell and what is the main cause of it?

### 🔥 What is Callback Hell?

**Definition:**  
Callback Hell refers to a situation where callbacks are nested within callbacks many levels deep, creating a "pyramid of doom" structure that is difficult to manage.

#### 💥 Callback Hell with `setTimeout` — The "Pyramid of Doom"

Imagine we want to print a series of messages with delays:

```js
setTimeout(() => {
    console.log("Task 1");
    setTimeout(() => {
        console.log("Task 2");
        setTimeout(() => {
            console.log("Task 3");
            setTimeout(() => {
                console.log("Task 4");
            }, 1000);
        }, 1000);
    }, 1000);
}, 1000);
```

**Problems:**
- Deep nesting.
- Hard to read and reason about.
- Difficult to maintain or scale (e.g., adding Task 5).

#### 🔥 Visually, this is "Callback Hell":

```
setTimeout
    └─ setTimeout
             └─ setTimeout
                        └─ setTimeout
```

---

### ✅ Solution 1: Using Named Functions

We can flatten the pyramid by naming each task:

```js
function task1() {
    console.log("Task 1");
    setTimeout(task2, 1000);
}

function task2() {
    console.log("Task 2");
    setTimeout(task3, 1000);
}

function task3() {
    console.log("Task 3");
    setTimeout(task4, 1000);
}

function task4() {
    console.log("Task 4");
}

setTimeout(task1, 1000);
```

> 💡 **Improvement:** Still uses callbacks, but now it's modular and readable.

---

### ✅ Solution 2: Using Promises

```js
function delayLog(msg, delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(msg);
            resolve();
        }, delay);
    });
}

delayLog("Task 1", 1000)
    .then(() => delayLog("Task 2", 1000))
    .then(() => delayLog("Task 3", 1000))
    .then(() => delayLog("Task 4", 1000));
```

- ✅ Flat, readable chain
- ✅ Easier error handling with `.catch()`
- ✅ Scalable

---

### ✅ Solution 3: Using async/await

```js
function delayLog(msg, delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(msg);
            resolve();
        }, delay);
    });
}

async function runTasks() {
    await delayLog("Task 1", 1000);
    await delayLog("Task 2", 1000);
    await delayLog("Task 3", 1000);
    await delayLog("Task 4", 1000);
}

runTasks();
```

- ✅ Cleanest syntax
- ✅ Looks synchronous, runs asynchronously
- ✅ Easy to add logic and error handling

---

## Q8: Why does Node.js prefer Error-First Callback?

Node.js uses the error-first callback pattern (also called "Node-style callback") as a convention for handling asynchronous operations. This design helps developers manage errors and results consistently across the entire Node.js ecosystem.

### 🧠 What is an Error-First Callback?

An error-first callback is a function where the first argument is always an error (if any), and the remaining arguments are the result(s) of the asynchronous operation.

#### 🔧 Syntax

```js
function callback(err, result) {
    if (err) {
        // Handle error
    } else {
        // Use result
    }
}
```

#### ✅ Example

```js
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Failed to read file:', err);
        return;
    }
    console.log('File content:', data);
});
```

- If file doesn't exist: `err` will be an Error object, and `data` will be undefined.
- If it succeeds: `err` is null, and `data` contains the file contents.

---

### 🔍 Why Node.js Prefers Error-First Callbacks

| Reason                     | Explanation                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| ✅ Consistency             | Standard across Node APIs and most npm packages. Easy to learn and apply.   |
| ⚠️ Safe Error Handling     | Prevents silent failures—forces the caller to always consider errors.       |
| 📦 Middleware Friendly     | Works well with async flow control libraries (like async.js, Express).      |
| 🤖 Automation Friendly     | Tools like `util.promisify` rely on this pattern to convert callbacks.      |
| 🧩 Backward Compatibility  | Older codebases and libraries all use this pattern; changing it would break many systems. |

---

## Q9: What does Promisifying technique mean in Node.js?

Promisifying in Node.js is the technique of converting a callback-based function (usually error-first style) into a function that returns a Promise.

### 🔧 Why Promisify?

Node.js and many legacy libraries use error-first callbacks:

```js
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        // Handle error
    } else {
        // Use data
    }
});
```

This makes the code harder to read and compose, especially in chains. Promises (or async/await) offer cleaner syntax and better error handling.

---

### ✅ Promisify Definition

Promisifying means wrapping a function that uses a callback so that it returns a Promise instead.

Node.js provides a built-in utility for this:

```js
const { promisify } = require('util');
```

---

#### 📘 Example: Promisifying `fs.readFile`

**Using Callback:**

```js
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) return console.error(err);
    console.log(data);
});
```

**Using Promisify:**

```js
const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

readFileAsync('file.txt', 'utf8')
    .then(data => console.log(data))
    .catch(err => console.error(err));
```

Or with async/await:

```js
(async () => {
    try {
        const data = await readFileAsync('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error('Error reading file:', err);
    }
})();
```

---

### ⚠️ Requirements for Promisify to Work

To use `util.promisify`, the function must follow the error-first callback style:

```js
function (arg1, arg2, ..., callback)
// where callback = function(err, result)
```

---

### 🔂 Custom Promisify Example

You can manually promisify like this:

```js
function delayCallback(ms, callback) {
    setTimeout(() => {
        callback(null, `Waited ${ms} ms`);
    }, ms);
}

function delayPromise(ms) {
    return new Promise((resolve, reject) => {
        delayCallback(ms, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

delayPromise(1000).then(console.log);
```

---

### 🧠 When to Promisify

| Scenario                              | Promisify?                                  |
|----------------------------------------|---------------------------------------------|
| 🌐 Legacy APIs (like fs, dns, crypto)  | ✅ Yes                                      |
| 🔁 Third-party callback libraries      | ✅ If they follow error-first                |
| 🧵 Your own callback-based utilities   | ✅ You should write promise-based functions instead today |
| ⚠️ Non-standard or event-based APIs    | ❌ Might require custom wrappers             |

---

### 🔥 Real-World Use: Promisify with `dns.lookup`

```js
const dns = require('dns');
const { promisify } = require('util');

const lookupAsync = promisify(dns.lookup);

async function getIP(domain) {
    try {
        const result = await lookupAsync(domain);
        console.log(result.address);
    } catch (err) {
        console.error('DNS error:', err);
    }
}
```

---

### 📦 Pro Tip: Use Native Promise APIs When Available

Node.js >= v10 offers `fs.promises`, `dns.promises`, etc.

```js
const fs = require('fs/promises');

const data = await fs.readFile('file.txt', 'utf8');
```

> 💡 Use `fs.promises` over `promisify` for new code.


## Q12: What are the Key Features of Node.js?

### 1. Asynchronous and Non-blocking I/O
**What it means:**  
Node.js handles I/O operations (like reading files, DB calls, network requests) asynchronously, allowing the system to serve more requests concurrently without blocking the main thread.

**Example:**
```js
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
    console.log(data);
});

console.log("Non-blocking: This runs first!");
```
**Use Case:**  
Ideal for I/O-heavy apps like APIs, file servers, or real-time dashboards.

---

### 2. Single-threaded Event Loop (with Worker Threads for CPU tasks)
**What it means:**  
Node.js runs on a single main thread using the event loop for concurrency. The libuv library delegates blocking I/O tasks to a thread pool.

- Memory-efficient and suitable for handling thousands of concurrent connections.
- For CPU-intensive tasks: Use Worker Threads or offload to microservices.

**Example:**
```js
const { Worker } = require('worker_threads');
```

---

### 3. Fast Execution with V8 Engine
**What it means:**  
Node.js uses Google's V8 JavaScript Engine, which is highly optimized using JIT (Just-In-Time) compilation to convert JavaScript into native machine code.

- Impressive performance for JSON-heavy, compute-light workloads like REST APIs or chat apps.

---

### 4. Built-in Package Manager (npm)
**What it means:**  
Node.js comes with npm (Node Package Manager), the largest open-source ecosystem with over 2M packages.

**Example:**
```bash
npm install express
```
- Enables rapid development and reduces boilerplate code through reusable modules.

---

### 5. Cross-platform
Node.js runs on:

- 🐧 Linux
- 🪟 Windows
- 🍏 macOS
- 🐳 Docker environments
- ☁️ Serverless platforms (e.g., AWS Lambda)

_Write once, run anywhere — from local machines to cloud-native containers._

---

### 6. Real-time Capabilities
**What it means:**  
Node.js excels at real-time applications using WebSockets or Socket.IO, thanks to its event-driven architecture.

**Example:**
```js
const io = require('socket.io')(server);
```
- Ideal for chat apps, multiplayer games, or live updates.

---

### 7. Rich Ecosystem of Modules and Libraries
Includes built-in modules like:

| Module  | Use                        |
|---------|----------------------------|
| fs      | File system operations     |
| http    | Creating web servers       |
| crypto  | Hashing, encryption        |
| cluster | Forking multiple processes |
| stream  | Working with streams       |

---

### 8. Microservices & Serverless Friendly
- Lightweight nature makes it ideal for microservices or deploying functions to platforms like AWS Lambda, Google Cloud Functions, Azure Functions.
- Scales well horizontally and integrates easily into modern cloud-native architectures.

---

### 9. JSON-native
- Node.js and most modern databases (like MongoDB, CouchDB, Firebase) use JSON, making data exchange seamless.

**Example:**
```js
res.json({ user: 'zeus', age: 30 });
```
- No need to serialize/deserialize between formats—boosts developer productivity.

---

### 10. Active Community & Corporate Backing
- Developed initially by Ryan Dahl
- Maintained by the OpenJS Foundation
- Used by companies like Netflix, PayPal, LinkedIn, Uber

_Ensures security updates, evolving standards, and vibrant community support._

---

## Q13: What is Callback?

A callback in Node.js (and JavaScript in general) is a function passed as an argument to another function, which is then invoked after some operation is complete.

- Fundamental for handling asynchronous operations in Node.js, especially before Promises and async/await.

**Simple Definition:**  
A callback is a function you pass into another function, so it can be called later, often after an async operation completes.

**Real-Life Analogy:**  
Ordering food at a restaurant:  
- You place the order and give your phone number (callback).  
- The kitchen prepares your food (asynchronous work).  
- When your food is ready, they call you back.

---

### Basic Example (Synchronous)
```js
function greet(name, callback) {
    console.log("Hello " + name);
    callback();
}

function done() {
    console.log("Greeting completed.");
}

greet("Zeus", done);
// Output:
// Hello Zeus
// Greeting completed.
```

---

### Asynchronous Example
```js
function fetchData(callback) {
    setTimeout(() => {
        callback("Data loaded");
    }, 1000);
}

fetchData((message) => {
    console.log(message); // Logs after 1 second
});
```
Here, the callback is executed after 1 second, when the "data" is ready.

---

### Why Callbacks Are Important in Node.js

Node.js is non-blocking and asynchronous, so callbacks are crucial for:

- File I/O
- Database queries
- HTTP requests
- Timers and intervals
- Events

**Example with fs.readFile:**
```js
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) return console.error('Error:', err);
    console.log('File content:', data);
});
```
- The third argument is a callback, called when file reading is complete.

---

## Q15: What is the Difference Between Returning a Callback and Just Calling a Callback?

This is a subtle but important distinction in Node.js, especially for asynchronous code and error handling.

| Concept                      | `callback()` | `return callback()` |
|------------------------------|:------------:|:-------------------:|
| Calls the function           |      ✅      |         ✅          |
| Returns control to caller    |      ❌      |         ✅          |
| Prevents further execution   |      ❌      |         ✅          |
| Improves flow control        |      ❌      |         ✅          |

---

### Example 1: Without `return`
```js
function doTask(callback) {
    if (!callback) {
        console.log('No callback provided');
    }
    callback(); // still runs this!
    console.log('Task finished');
}

doTask(); // ❌ will throw because callback is undefined
```
- Continues execution even after the error condition is found — can lead to unexpected behavior.

---

### Example 2: With `return callback()`
```js
function doTask(callback) {
    if (!callback) {
        console.log('No callback provided');
        return; // Early exit
    }
    return callback(); // Returns control
}
```
- Cleaner and prevents the rest of the function from executing once the callback is triggered.

---

### In Error-First Callback Style

Node.js callbacks often follow this convention:
```js
function (err, result) { ... }
```

**Example:**
```js
function readUser(id, callback) {
    if (!id) {
        return callback(new Error('ID is required')); // good
    }

    // async task
    setTimeout(() => {
        callback(null, { id, name: 'Zeus' });
    }, 100);
}
```
- Without `return`, the function might continue after an error — causing duplicate callback calls.

---

### Real-World Bug: Double Callback
```js
function doSomething(flag, callback) {
    if (flag) {
        callback('Error!');
    }
    // More logic...
    callback(null, 'Done'); // ← called again!
}
```
❌ **Bad:** Callback is invoked twice — can crash your app or result in unpredictable behavior.

**Fix:**
```js
if (flag) {
    return callback('Error!');
}
```


## Q17: How Do You Debug Node.js Applications?

### 1. Basic Debugging with `console.log()` / `console.error()`
- **Quick & simple** for small issues.
- Example:
    ```js
    console.log('value:', value);
    console.error('Error:', err);
    ```
- Use sparingly in development—**never** in production for sensitive data.

---

### 2. Built-in Debugger with Chrome DevTools
- Start Node.js in debug mode:
    ```bash
    node inspect app.js
    ```
- For a more powerful experience:
    ```bash
    node --inspect-brk app.js
    ```
- Open Chrome and navigate to `chrome://inspect`.
- **Features:** Set breakpoints, step through code, inspect variables, watch expressions, view call stacks.
- **Best for:** Complex async flows, promises, memory/state inspection.

---

### 3. Using VS Code Debugger (Preferred IDE Method)
- Open your Node.js project in VS Code.
- Go to **Run & Debug** → "Add Configuration".
- Add to `launch.json`:
    ```json
    {
        "type": "node",
        "request": "launch",
        "name": "Debug App",
        "program": "${workspaceFolder}/app.js"
    }
    ```
- Set breakpoints and hit ▶️ "Start Debugging".
- **Pro Tip:** Set `"autoAttach": "on"` in VS Code settings to auto-debug spawned processes.

---

### 4. Debugging with `node --inspect` and Chrome DevTools
- Start your app:
    ```bash
    node --inspect=9229 index.js
    ```
- Chrome connects at `localhost:9229`.

---

### 5. Use `debug` Module for Structured Logging
- Install:
    ```bash
    npm install debug
    ```
- Usage:
    ```js
    const debug = require('debug')('app:server');
    debug('Starting server...');
    ```
- Run with:
    ```bash
    DEBUG=app:* node app.js
    ```
- **Great for:** Scoped, environment-aware debug logs.

---

### 6. Monitoring and Profiling (Production Debugging)
- **Tools:**
    | Tool         | Purpose                                 |
    |--------------|-----------------------------------------|
    | clinic.js    | Visual performance profiling            |
    | pm2 + pm2 logs | Log management & real-time monitoring |
    | Node.js Inspector + Heap Snapshots | Debug memory leaks, GC issues |
    | nodemon + --inspect | Auto-reloads + debugging         |

- Example:
    ```bash
    npm install -g pm2
    pm2 start app.js --watch --inspect
    ```

---

### 7. Linting and Static Analysis
- Use ESLint to catch bugs early:
    ```bash
    npm install eslint --save-dev
    npx eslint yourfile.js
    ```
- **Catches:** Undefined variables, deprecated methods, unreachable code, async issues.

---

### 8. Add Logging Layers (Winston / Pino)
- Structured logging for larger apps.
- Example with Winston:
    ```bash
    npm install winston
    ```
    ```js
    const winston = require('winston');
    const logger = winston.createLogger({ transports: [new winston.transports.Console()] });
    logger.info('Service started');
    logger.error('Something broke');
    ```
- **Useful for:** Production debugging, log aggregation.

---

### 9. Post-Mortem Debugging with Core Dumps
- For advanced crash analysis:
    - Generate core dumps.
    - Analyze with `lldb`, `gdb`, or Chrome DevTools.
    - Set environment variables:
        ```bash
        ulimit -c unlimited
        node --abort-on-uncaught-exception index.js
        ```

---

### 10. Best Practices

| Tip                             | Why It Helps                                 |
|---------------------------------|----------------------------------------------|
| Use consistent error handling   | Easier to trace errors through callbacks/promises |
| Avoid silent failures           | Always log or re-throw                       |
| Use `.catch()` for Promises     | Prevents unhandled rejections                |
| Use `try/catch` in async/await  | Required to catch async errors               |
| Monitor logs                    | Especially in production (LogDNA, ELK, Datadog) |

---

#### Example: Async Error Debugging
```js
async function getUser(id) {
    try {
        const user = await db.getUserById(id);
        console.log('User:', user);
    } catch (err) {
        console.error('DB failed:', err);
    }
}
```
> Debug in context, not just with logs.

---

## Q18: What is N-API in Node.js?

### 🔍 What is N-API?
N-API (Node.js API) is a C API provided by Node.js to write native modules in C or C++ that work across Node versions without breaking.

---

### 🧠 Why Use N-API?
- Node.js is written in C++. Sometimes JavaScript isn’t fast enough for:
    - You need high-performance native code (e.g., image processing, encryption, hardware access).
    - You need high-performance native code (e.g., image processing, encryption, hardware access). (e.g., OpenSSL, libxml)
    - Accessing low-level system APIs (e.g., GPU, drivers)
    - Boosting performance where JS is too slow

---

### 🧩 Traditional vs N-API

| Feature                  | node-gyp (old way) | N-API (new way)      |
|--------------------------|--------------------|----------------------|
| Tied to Node.js version? | ❌ Yes — needs rebuild | ✅ No — stable ABI |
| Cross-version compatible?| ❌                | ✅                   |
| ABI stable?              | ❌                | ✅                   |
| Safer memory model?      | ❌                | ✅                   |
| Async worker support?    | ❌ Manual         | ✅ Built-in support  |
| Long-term maintenance?   | ❌                | ✅ ✔️                |

---

### ✅ Benefits of N-API
- **ABI-Stable:** Works across Node.js versions without recompilation.
- **Language-Agnostic:** Not just C/C++—works with Rust via wrappers like `napi-rs`.
- **Memory Safe:** Abstracts Node/V8 internals.
- **Async API Support:** Supports non-blocking native modules.
- **Future-Proof:** No need to refactor for every new Node.js release.

---

### 🛠️ How It Works (Basic Example)

**1. C++ N-API Module (`hello.cc`):**
```cpp
#include <napi.h>

Napi::String SayHello(const Napi::CallbackInfo& info) {
    return Napi::String::New(info.Env(), "Hello from C++");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("sayHello", Napi::Function::New(env, SayHello));
    return exports;
}

NODE_API_MODULE(addon, Init)
```

**2. `binding.gyp`:**
```json
{
    "targets": [
        {
            "target_name": "addon",
            "sources": [ "hello.cc" ]
        }
    ]
}
```

**3. Build and Use:**
```bash
node-gyp configure build
```

**4. JavaScript Usage:**
```js
const addon = require('./build/Release/addon');
console.log(addon.sayHello()); // "Hello from C++"
```

---

### 🚀 Real-World Use Cases

| Scenario           | Example                                 |
|--------------------|-----------------------------------------|
| Crypto algorithms  | Faster hash functions (e.g., bcrypt)    |
| Image processing   | `libjpeg` bindings                      |
| Database drivers   | Native drivers for PostgreSQL, MongoDB  |
| Machine Learning   | Tensor bindings                         |
| Hardware I/O       | Access to GPU, camera, serial ports     |

---

### 🧰 Tooling Ecosystem

| Tool              | Purpose                                 |
|-------------------|-----------------------------------------|
| node-addon-api    | C++ wrapper over N-API                  |
| napi-rs           | Use Rust with N-API                     |
| node-gyp          | Builds native modules                   |
| cmake-js          | CMake support for native modules        |
| prebuild / node-pre-gyp | Distribute compiled binaries      |

---

### 📦 Popular Libraries Using N-API

- `bcrypt`
- `sharp` (image processing)
- `serialport`
- `leveldown`
- `node-libcurl`

---

### 🧑‍💼 As a Lead Developer, You Should:
- Use N-API for wrapping native code or optimizing hot paths.
- Prefer `node-addon-api` or `napi-rs` for abstraction.
- Avoid using V8 internals directly (not future-safe).
- Encourage modularity—offload compute to C++ when profiling shows bottlenecks.

---

### 🔚 Summary

| Feature      | Value                                         |
|--------------|-----------------------------------------------|
| What is it?  | Stable C/C++ interface for Node.js            |
| Why use it?  | Native performance, cross-version compatibility|
| Benefits     | ABI stability, memory safety, async support   |
| Tools        | node-addon-api, node-gyp, napi-rs             |
| Use cases    | Performance-critical, C++ integration, system-level access |

## Q19: What are the Use Cases for the Node.js `vm` Core Module

The Node.js `vm` core module provides APIs to create and execute code within a new V8 virtual machine context, separate from your application's global context.

> **Think of it as:**  
> Running JavaScript code in a sandboxed environment—like running untrusted code inside a safe box, isolated from your app’s main variables and environment.

### What is the `vm` Module Used For?

```js
const vm = require('vm');
```

It provides methods like:

- `vm.runInNewContext(code, contextObj)`
- `vm.Script`
- `vm.createContext`

---

### ✅ Key Use Cases for the `vm` Module

1. **🧪 Running Untrusted or User-Submitted Code**  
    Safely execute limited or controlled JavaScript code submitted by:
    - End users
    - Admin dashboards
    - Plugins or extensions

    **Example:**
    ```js
    const vm = require('vm');
    const userCode = 'a + b';
    const context = { a: 2, b: 3 };
    vm.createContext(context); // sandbox
    vm.runInContext(userCode, context); // returns 5
    ```
    *Prevents access to `fs`, `process`, or other global resources.*

2. **🔧 Scripting Support in Applications (like Plugins)**  
    Let users customize behavior with mini-scripts:
    - Custom business rules
    - Game logic
    - Alert/notification conditions

    **Example:**
    ```js
    const script = new vm.Script('if (data.price > 100) "buy"; else "wait";');
    const context = vm.createContext({ data: { price: 120 } });
    console.log(script.runInContext(context)); // buy
    ```

3. **🧰 Creating Sandboxed Environments for Tests or Tools**  
    Useful for:
    - REPL (Read-Eval-Print-Loop) interfaces
    - Static analyzers
    - Dynamic code evaluators (like Jupyter notebooks)

    **Example:**
    ```js
    const context = vm.createContext({ result: null });
    const code = 'result = 10 + 20;';
    vm.runInContext(code, context);
    console.log(context.result); // 30
    ```

4. **🔐 Security-focused Isolation**  
    Evaluate user-generated scripts securely.  
    > *Note: Not 100% secure—real sandboxing requires `vm2` or external processes.*

5. **🧵 Lightweight Virtual Threads or Workers**  
    Simulate:
    - Running many lightweight tasks
    - Different users or data environments

6. **⚙️ On-the-fly Code Compilation**  
    Compile and cache dynamic logic using `vm.Script`.

    **Example:**
    ```js
    const script = new vm.Script('Math.sqrt(64)');
    console.log(script.runInThisContext()); // 8
    ```

7. **🧠 Building DSLs or Template Engines**  
    Safely evaluate expressions in:
    - Email templates (`{{user.name}}`)
    - Custom logic
    - JSON-like scripts

---

### 🧱 API Summary

| API                          | Purpose                        |
|------------------------------|-------------------------------|
| `vm.runInThisContext(code)`  | Run in global scope (isolated)|
| `vm.runInNewContext(code, context)` | Run in a sandbox         |
| `vm.Script(code)`            | Compile once, run many        |
| `vm.createContext(obj)`      | Set up sandbox environment    |

---

### 🛑 Caveats

| Issue                       | Notes                                                      |
|-----------------------------|------------------------------------------------------------|
| 🧨 Not fully secure         | Can be broken by malicious code (use `vm2` for strict isolation) |
| 📉 Slower than native JS    | Extra context switching overhead                           |
| ⛓️ No direct `require`/modules | By design, for security                                 |
| 👁️ Shares memory (same process) | Not a full sandbox like `worker_threads` or containers |

---

### 🧑‍💼 As a Lead Developer, Use `vm` For:

- User-configurable logic safely injected at runtime
- Dynamic rules engines
- Data processing pipelines with user expressions
- Building plugin systems (with limits)
- Evaluating external script configurations (e.g., A/B testing logic)

---

### 🔚 Summary

| Feature         | `vm` Module                |
|-----------------|---------------------------|
| Use Case        | Run isolated JS code       |
| Safety          | Partially sandboxed        |
| Alternatives    | `vm2`, `worker_threads`, child processes |
| Good For        | Scripting, plugin engines, testing, config evaluation |
| Not Good For    | Running truly untrusted code in production (use `vm2` or external process) |

---

## Q20: Provide Your Favourite Reasons to Use Node.js

As an expert or lead Node.js developer, here are my favorite, battle-tested reasons to use Node.js—especially for scalable, high-performance, and developer-friendly applications.

### 🏆 1. Event-Driven, Non-Blocking I/O (Perfect for I/O-heavy Systems)

- **Why it matters:**  
  Node.js uses a single-threaded event loop that can handle thousands of concurrent connections without spawning a thread per request.

- **Great for:**  
  - Real-time chat apps
  - Streaming APIs
  - REST/GraphQL backends
  - Proxies or API gateways

- **Example:**  
  Handle 10k concurrent API requests without breaking a sweat.

---

### ⚡ 2. JavaScript Everywhere

- **Why it matters:**  
  Use one language (JS/TS) across the stack:
  - Client (React, Angular, Vue)
  - Server (Node.js + Express/Fastify)
  - Build tools, testing, even infrastructure (CDK, Pulumi)

- **Benefit:**  
  Reduces cognitive load and context switching.

- **Example:**  
  A full-stack TypeScript app using React + Express + Prisma + tRPC.

---

### 🚀 3. Huge Ecosystem and NPM Registry

- **Why it matters:**  
  Node.js has the largest ecosystem of open-source libraries via NPM.

- **Great for:**  
  - Web frameworks (Express, Fastify, NestJS)
  - Auth (Passport, Auth0, Cognito SDKs)
  - Queues (BullMQ, Agenda)
  - Cloud SDKs (AWS, GCP, Azure)

- **Example:**  
  Build an email pipeline with Nodemailer + BullMQ in minutes.

---

### 🧩 4. Modular Architecture and Microservice Friendly

- **Why it matters:**  
  Node.js's minimal runtime encourages composable, small, and focused modules—ideal for microservices and serverless apps.

- **Benefits:**  
  - Fast cold start times
  - Easy to containerize
  - Compatible with Serverless platforms (AWS Lambda, Vercel, etc.)

- **Example:**  
  Lambda function in 10ms cold start using Node.js + esbuild.

---

### 💻 5. Real-Time Communication Made Easy

- **Why it matters:**  
  Node.js, combined with WebSockets or Socket.IO, is ideal for:
  - Multiplayer games
  - Live dashboards
  - Collaborative tools
  - Notification engines

- **Example:**  
  Live stock ticker or Google Docs-style collaboration in ~50 lines using Socket.IO.

---

### 🧠 6. Developer Productivity and Community

- **Why it matters:**  
  Fast prototyping, hot reloaders, linters, formatters, dev servers, testing libraries—all built into the Node.js ecosystem.

- **Tools:**  
  - `nodemon`, `ts-node-dev`
  - `eslint`, `prettier`
  - `vitest`, `jest`
  - `playwright`, `puppeteer`

- **Example:**  
  Scaffold a production-grade monorepo with TypeScript in minutes (using TurboRepo, Nx, or PNPM workspaces).

---

### 📊 7. Great for API-First and BFF Architectures

- **Why it matters:**  
  Node.js is ideal for creating:
  - REST APIs
  - GraphQL backends
  - Backend-for-Frontend layers
  - Lightweight API gateways or proxies

- **Example:**  
  A BFF for a mobile app that handles device logic, token refresh, and caching at the edge.

---

### 🧵 8. Efficient Worker Threads and Offloading CPU Tasks

- **Why it matters:**  
  With `worker_threads`, Node.js now handles CPU-bound tasks without blocking the main thread—plus horizontal scaling via clustering.

- **Example:**  
  Image compression, PDF generation, or encryption in worker threads while the main loop stays snappy.

---

### 🧪 9. Ideal for DevOps, CLI, and Tooling

- **Why it matters:**  
  Node.js is a top choice for building internal tools, DevOps utilities, and CLIs—thanks to its file system access, streams, and simple APIs.

- **Example:**  
  Build a CLI that syncs S3 buckets or creates GitHub issues in under 50 lines with `commander`, `axios`, `chalk`.

---

### 🌍 10. Massive Industry Adoption + Talent Pool

- **Why it matters:**  
  Companies like Netflix, PayPal, Uber, Walmart, and LinkedIn use Node.js at scale—mature, well-documented, and very active community.

- **Benefits:**  
  - Easy to hire, onboard, and collaborate
  - Proven in production at massive scale

---

### 🧭 Summary: When Node.js Truly Shines

| Use Case             | Node.js Strength         |
|----------------------|-------------------------|
| Realtime apps        | ✅ Excellent             |
| REST/GraphQL APIs    | ✅ Best-in-class         |
| Microservices        | ✅ Ideal                 |
| Serverless           | ✅ Fast startup          |
| Dev tools & CLIs     | ✅ Highly productive     |
| CPU-bound tasks      | ⚠️ Use `worker_threads` or offload to Rust/Go |
| Data science/ML      | ❌ Better in Python or R |

## Q21: Provide some of the reasons not to use Node.js

### ⚠️ Reasons Not to Use Node.js

#### 1. 🧮 CPU-Intensive or Heavy Computation Tasks

**Why:**  
Node.js is single-threaded by default. CPU-heavy operations (like video encoding, cryptography, or large-scale data crunching) block the event loop and degrade performance for all other requests.

**Example:**
```js
// This will block the event loop for all users
for (let i = 0; i < 1e9; i++) { Math.sqrt(i); }
```

**Better alternatives:**  
- Go (lightweight goroutines)  
- Rust/C++ (high-performance native code)  
- Offload with `worker_threads` or external microservices

---

#### 2. 🧵 Highly Multi-threaded Architectures by Design

**Why:**  
If your application must spawn and coordinate multiple threads (e.g., matrix multiplication, AI model serving), Node.js isn't optimal.  
Node.js workarounds like `worker_threads` are available but:
- Not as ergonomic or mature as native threading in Go, Java, or Rust
- Shared memory is limited and complex

**Prefer:**  
- Java (with Executors, Fork/Join)  
- Go (Goroutines)  
- Rust (thread-safe concurrency)

---

#### 3. 🧰 Complex Synchronous Workflows Requiring Strict Execution Order

**Why:**  
Node.js is inherently asynchronous and non-blocking. Writing complex synchronous logic or sequential flows can become verbose and difficult to manage — especially if the ecosystem doesn't support Promises or async/await properly (e.g., some legacy DB drivers).

**Prefer:**  
- Python or Java for clean, synchronous logic in business workflows  
- Or use TypeScript + modern async/await patterns in Node.js (if you're committed to it)

---

#### 4. 📉 Real-Time, Low-Latency Systems at the OS/Kernel Level

**Why:**  
Node.js is not built for ultra-low-latency systems like:
- HFT (High-Frequency Trading)
- OS kernels, drivers, hardware interrupts

**Prefer:**  
- C/C++  
- Rust  
- Go

---

#### 5. 🔐 Need for Strict Type Safety or Compile-Time Guarantees

**Why:**  
Vanilla JavaScript is dynamically typed, which may lead to bugs at runtime. Although TypeScript mitigates this, it's still optional and doesn't prevent logic bugs as strictly as Rust or Haskell.

**Prefer:**  
- Rust (strict memory safety, ownership)  
- Haskell or Scala (strong functional typing)  
- Java/Kotlin for strict business rule enforcement

---

#### 6. 🧬 Heavy Data Science, ML, or Scientific Computing

**Why:**  
Node.js lacks rich libraries for:
- Machine learning
- Data visualization
- Scientific computation
- Matrix ops / NumPy-style math

**Prefer:**  
- Python (NumPy, Pandas, TensorFlow, PyTorch)  
- R for statistical analysis  
- Julia for high-performance numerical computing

---

#### 7. 🧰 Complex Enterprise Systems with Long-Term Maintainability Concerns

**Why:**  
Large enterprise systems may benefit from:
- Strict OOP patterns
- Mature ORMs
- Transactional support
- Inversion of Control (IoC) containers
- Enterprise-wide standards (Java, .NET)

**Prefer:**  
- Java (Spring Boot) or .NET Core  
- Python with Django for structured, mature projects

---

#### 8. 🧩 Tight Integration with Native OS Features or Hardware APIs

**Why:**  
Node.js isn’t a systems language. Direct interfacing with OS-level features (e.g., hardware drivers, USB stacks, memory management) is cumbersome.

**Prefer:**  
- Rust or C++

---

#### 9. ⚖️ Large Monolithic Applications with Shared Memory Models

**Why:**  
Node.js doesn’t support shared memory by default (outside `worker_threads` and `SharedArrayBuffer`). Shared-state logic often becomes hard to model with async paradigms.

**Prefer:**  
- Java/Spring Boot for monolithic, memory-intensive systems  
- Go for balance of concurrency + shared memory (via channels)

---

#### 10. 📊 Systems That Rely on Blocking I/O or Sync APIs

**Why:**  
Node.js's async-first nature makes synchronous/blocking code problematic. For example:
- Synchronous file access
- Waiting for shell commands
- Long-running synchronous DB calls

**Prefer:**  
- Python/Java for such cases

---

### ✅ Summary Table

| Use Case                        | Use Node.js?         | Better Alternatives         |
|----------------------------------|----------------------|----------------------------|
| Real-time apps                   | ✅ Yes               | -                          |
| High CPU processing              | ❌ No                | Go, Rust                   |
| Machine learning                 | ❌ No                | Python                     |
| Multi-threaded workloads         | ⚠️ Limited           | Go, Java                   |
| OS-level programming             | ❌ No                | Rust, C++                  |
| Monoliths with shared memory     | ⚠️ Difficult         | Java                       |
| Enterprise-level OOP apps        | ⚠️ Possible but verbose | Java, .NET              |
| Data pipelines                   | ✅ Yes (with streams)| Python (for analytics)      |

---

## Q25: What is the relationship between Node.js and V8?

### Node.js and V8: What’s the connection?

1. **V8 is the JavaScript engine developed by Google**  
    - V8 is the open-source JavaScript engine originally developed for Google Chrome.
    - It compiles JavaScript code directly into highly optimized machine code (just-in-time compilation).
    - V8 provides the runtime to execute JavaScript, handling parsing, compilation, garbage collection, and execution.

2. **Node.js uses V8 to run JavaScript outside the browser**  
    - Node.js is a runtime environment for running JavaScript on the server (outside browsers).
    - Node.js embeds the V8 engine to execute JavaScript code on the server side.
    - This is why Node.js can run JS code at near-native speed.

3. **But Node.js adds a lot more on top of V8**  
    - V8 only executes JavaScript. It doesn’t provide:
      - File system access (`fs`)
      - Network I/O (`http`, `net`)
      - Operating system integration
      - Asynchronous event loop and non-blocking I/O (`libuv`)
      - Process management, buffers, streams, etc.
    - Node.js adds these capabilities by:
      - Using `libuv`, a C library, for async I/O and event loop management.
      - Exposing APIs that wrap OS-level resources.
      - Providing built-in modules (`fs`, `http`, `crypto`, `child_process`, etc.)

4. **Architecture Summary**

```
+-------------------------------+
|         Node.js runtime        |
| +---------------------------+ |
| |         V8 Engine          | |  ← Executes JS code
| +---------------------------+ |
| +---------------------------+ |
| |         libuv (C++)        | |  ← Async I/O, event loop
| +---------------------------+ |
| +---------------------------+ |
| | Node.js Built-in Modules   | |  ← fs, net, http, etc.
| +---------------------------+ |
+-------------------------------+
```

5. **Why is V8 crucial to Node.js performance?**  
    - V8’s just-in-time compiler optimizes JS code at runtime.
    - V8’s garbage collector manages memory efficiently.
    - Node.js benefits directly from every V8 improvement and optimization.

6. **Example: How Node.js executes JS**
```js
console.log('Hello from Node.js!');
```
- V8 parses and compiles this JS to machine code.
- Node.js’s event loop (via libuv) manages the execution lifecycle.
- Node.js APIs handle stdout writing to console (not provided by V8).

---

## Q26: Explain the concept of Domain in Node.js

### What is a Domain in Node.js?

A Domain is a core module in Node.js designed to provide a way to handle multiple different I/O operations as a single group, particularly for managing and handling errors across asynchronous operations more gracefully.

### Why were Domains introduced?

In Node.js, error handling can get tricky when errors occur in asynchronous callbacks. Traditional try/catch blocks don't catch errors thrown asynchronously, making error propagation and handling more complex.

Domains help by providing a context to group I/O operations and their callbacks, so errors emitted anywhere in that group can be caught and handled in one place.

### How does Domain work?

- You create a domain.
- Add event emitters, timers, callbacks, or I/O operations to the domain.
- Any errors emitted by those objects/events get caught by the domain’s error handler.

**Basic Usage Example:**
```js
const domain = require('domain');

const d = domain.create();

d.on('error', (err) => {
  console.error('Domain caught error:', err);
});

d.run(() => {
  setTimeout(() => {
     throw new Error('Something went wrong!');
  }, 100);
});
```
**Explanation:**
- We create a domain `d`.
- Attach an `'error'` event handler to catch errors in the domain.
- Run an asynchronous function inside the domain using `d.run`.
- The `setTimeout` throws an error, which normally would crash the app.
- But here, the domain catches the error and handles it inside the `'error'` event.

### What problems do Domains solve?

- Catch errors emitted asynchronously without crashing the entire Node.js process.
- Provide centralized error handling across different async resources.
- Avoid deeply nested try/catch or multiple error handlers.

### Important Notes & Limitations

- Domains are considered **deprecated** since Node.js 4.x+ and their use is discouraged in favor of other modern patterns.

**Alternative patterns include:**
- Using Promises with `.catch()`
- `async/await` with try/catch blocks
- Using the new `AsyncLocalStorage` API for context propagation
- Structured error handling via `process.on('uncaughtException')` and `process.on('unhandledRejection')`

**Why deprecated?**
- Domains have subtle bugs and unpredictable behavior, especially when mixed with some async APIs.
- They can introduce performance overhead.
- Better async context propagation tools and error-handling practices have emerged.

**Modern Alternative: AsyncLocalStorage**  
AsyncLocalStorage allows managing async context similar to domains but in a more reliable and supported way.

---

## Q28: What are `express.json()` and `express.urlencoded()` in Express.js?

Both are built-in middleware functions in Express.js used to parse incoming request bodies so that you can easily access data sent from clients.

### 1. `express.json()`

- Middleware to parse incoming requests with JSON payloads.
- It parses the body of requests where the `Content-Type` header is `application/json`.
- After parsing, the JSON data is available on `req.body` as a JavaScript object.

**Example:**
```js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/data', (req, res) => {
  console.log(req.body); // parsed JSON object
  res.send('JSON data received');
});

app.listen(3000);
```

---

### 2. `express.urlencoded()`

- Middleware to parse incoming requests with URL-encoded payloads (typically form submissions).
- It parses data sent with `Content-Type: application/x-www-form-urlencoded`.
- The `extended` option determines how deep the parsing goes:
  - `extended: false`: Uses Node.js core `querystring` library — supports simple key-value pairs.
  - `extended: true`: Uses `qs` library — supports nested objects and arrays.

**Example:**
```js
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.post('/submit-form', (req, res) => {
  console.log(req.body); // parsed form data as JS object
  res.send('Form data received');
});

app.listen(3000);
```

---

### Why do you need these middlewares?

- HTTP requests (especially POST/PUT/PATCH) often send data in the request body:
  - JSON payloads are common in APIs and modern clients.
  - URL-encoded data is common with HTML forms.
- By default, Express does not parse the body. These middlewares:
  - Read the raw incoming data.
  - Parse it to JS objects.
  - Attach parsed data to `req.body`.
- This allows your route handlers to work with request data easily.

---

## Q29: Is there any difference between `res.send` and `return res.send` in Express.js?

### 1. `res.send()` alone

- `res.send()` sends the response back to the client.
- It does **not** stop the execution of the function (your route handler).
- So, if you write code after `res.send()`, it will still run.

**Example:**
```js
app.get('/example1', (req, res) => {
  res.send('Hello!');
  console.log('This will still run');
  // More code here runs even after sending response
});
```
**Behavior:**
- The response is sent immediately.
- The code after `res.send()` executes (which can lead to unintended side effects).

---

### 2. `return res.send()`

- Using `return` immediately exits the function after sending the response.
- No further code in the route handler runs.
- This helps prevent accidental execution of code after the response is sent.

**Example:**
```js
app.get('/example2', (req, res) => {
  return res.send('Hello!');
  // No code here will run
});
```

---

### Why is `return res.send()` often preferred?

- **Prevents "Headers already sent" errors:** If you accidentally run more code that tries to send another response, Express will throw an error because a response can only be sent once.
- **Makes it clear in your code that response is complete, and the function ends here.**
- **Helps avoid subtle bugs** in complex route handlers or middleware chains.

**Example where this matters:**
```js
app.get('/user/:id', (req, res) => {
  if (!req.params.id) {
     return res.status(400).send('User ID required'); // Stop here on error
  }

  // If no return, this code runs even after sending response above
  // leading to "Cannot set headers after they are sent to the client" error
  res.send(`User ID is ${req.params.id}`);
});
```

## Q30: What is the difference between `cluster` & `worker_threads` package in Node.js?

### Overview

| Aspect            | `cluster`                                              | `worker_threads`                                           |
|-------------------|-------------------------------------------------------|------------------------------------------------------------|
| **Purpose**       | Create multiple processes to utilize multi-core CPUs   | Create multiple threads within a single process             |
| **Concurrency**   | Multi-process (each process has its own memory)        | Multi-threading (threads share memory within one process)   |
| **Communication** | IPC (Inter-Process Communication) via messaging        | Shared memory and messaging via `MessagePort`               |
| **Use case**      | Scaling network servers (e.g., HTTP servers)           | Performing CPU-intensive tasks off the main event loop      |
| **Overhead**      | Higher (multiple processes, separate memory)           | Lower (threads share same memory space)                     |
| **Isolation**     | Processes are isolated, no shared memory               | Threads share memory, risk of race conditions               |
| **Stability**     | Crashes isolated to one process                        | One thread crash may affect entire process                  |
| **API complexity**| Simple API to fork worker processes                    | More complex, needs synchronization for shared memory       |
| **Availability**  | Since Node.js v0.8.0 (older)                           | Since Node.js v10.5.0 (experimental initially)              |

---

### What is `cluster`?

- Lets you fork multiple Node.js processes (workers) from a master process.
- Each worker runs an independent Node.js instance with its own event loop and memory.
- Used to scale server apps across CPU cores (Node.js is single-threaded by default).
- Workers communicate with the master via IPC messages.
- Crashes in a worker do not affect other workers or the master process.

**Example:**

```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Restart worker on crash
    });
} else {
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Hello from worker ' + process.pid);
    }).listen(8000);
    console.log(`Worker ${process.pid} started`);
}
```

---

### What are `worker_threads`?

- Allow you to run JavaScript in parallel threads inside the same process.
- Threads share memory through `SharedArrayBuffer` and communicate via message passing.
- Useful for CPU-intensive tasks or offloading heavy computation to avoid blocking the main thread.
- Threads have isolated V8 contexts but can share buffers.

**Example:**

```js
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
    const worker = new Worker(__filename);
    worker.on('message', (msg) => {
        console.log('Message from worker:', msg);
    });
    worker.postMessage('Start work');
} else {
    parentPort.on('message', (msg) => {
        // Heavy computation here
        parentPort.postMessage('Work done');
    });
}
```

---

### When to use which?

| Scenario                                              | Recommended Choice |
|-------------------------------------------------------|-------------------|
| Scaling a web server on multiple CPU cores            | `cluster`         |
| Running CPU-intensive tasks without blocking event loop| `worker_threads`  |
| Need strict process isolation and fault tolerance     | `cluster`         |
| Need shared memory or thread-level parallelism        | `worker_threads`  |

---

### Summary

| Feature         | `cluster`                   | `worker_threads`                |
|-----------------|----------------------------|---------------------------------|
| Model           | Multiple processes          | Multiple threads (shared memory)|
| Use case        | Scaling server processes    | Parallel CPU-heavy tasks        |
| Fault tolerance | High (process crash isolated)| Lower (thread crash affects process)|
| Memory          | Separate per process        | Shared memory possible          |
| API complexity  | Simpler                     | More complex                    |

---

## Q31: When would you use global variables in Node.js? Are they always bad?

### 🔍 What Are Global Variables in Node.js?

Global variables are accessible from anywhere in the application without being passed or required explicitly.

Node.js provides built-in global variables/functions, such as:

```js
console, process, __dirname, __filename, global
```

You can also define your own:

```js
global.myAppConfig = { version: '1.0.0' };
```

---

### ✅ When Might You Use Global Variables?

1. **Shared Configurations or Constants**  
     For truly static values across the whole app (that don't change at runtime):

     ```js
     global.__APP_VERSION__ = '1.2.3';
     ```
     > But a `config.js` module is often a better choice.

2. **Logging Utility**  
     For tiny or personal apps:

     ```js
     global.logger = require('./utils/logger');
     ```
     > Prefer dependency injection for clarity and testability.

3. **Feature Flags (In Controlled Environments)**  
     Some systems use global feature toggles, but only with extreme care and isolation.

---

### ❌ Why Global Variables Are Usually Bad

| Problem            | Explanation                                                      |
|--------------------|------------------------------------------------------------------|
| Tight coupling     | Modules become dependent on shared global state                  |
| Testing difficulty | Harder to mock or replace in unit tests                         |
| Hidden dependencies| Not obvious what a module depends on                            |
| Risk of conflicts  | One global variable can overwrite another unintentionally        |
| Memory leaks       | Poorly managed globals can prevent GC                            |
| Concurrency issues | Globals modified across async ops can lead to unexpected results |

---

### ✅ Best Practice: Use Modules Instead

Node.js modules provide file-level scope, which is great for encapsulating variables.

**Example:**

```js
// config.js
module.exports = {
    dbHost: 'localhost',
    port: 3000,
};

// someModule.js
const config = require('./config');
console.log(config.port);
```

> This makes dependencies explicit, improves testability, and avoids global state.

---

### Summary

| ✅ Okay Uses                    | ❌ Bad Uses                        |
|---------------------------------|------------------------------------|
| Constants like app version/env  | Sharing runtime mutable state      |
| Debug-only globals in tiny scripts| App-wide logic/state management  |
| Controlled read-only feature flags| Dependency injection shortcuts   |

---

## Q33: What is the difference between browser global scope and Node.js global scope?

### 🔁 High-Level Overview

| Feature                | Browser                | Node.js                        |
|------------------------|------------------------|--------------------------------|
| Global object          | `window`               | `global`                       |
| Global scope in script | Variables/functions attached to `window` | Variables not attached to `global` |
| Module scope           | No modules by default  | Each file is a CommonJS module |
| `this` at top level    | Refers to `window`     | Refers to `module.exports`     |
| Globals pollution      | Easy and dangerous     | Harder due to module scoping   |

---

### 🌐 1. Global Object

**In the Browser:**
```js
console.log(window); // Global object in browsers
var x = 10;
console.log(window.x); // 10
```

**In Node.js:**
```js
console.log(global); // Global object in Node.js
var x = 10;
console.log(global.x); // undefined
```
> In Node.js, `var`, `let`, and `const` are scoped to the module, not attached to `global`.

---

### 📁 2. Module System Impact

**Browser:**
All code runs in the same global scope (unless using ES6 modules or IIFEs).

```html
<script>
    var foo = 'bar';
</script>
<script>
    console.log(foo); // 'bar'
</script>
```

**Node.js:**
Each file is wrapped in a function and behaves like a module:

```js
// fileA.js
var foo = 'bar';

// fileB.js
console.log(foo); // ReferenceError: foo is not defined
```

Node.js wraps each module like:

```js
(function(exports, require, module, __filename, __dirname) {
    // your module code here
});
```

---

### 🔄 3. Attaching to Global Scope

**Browser:**
```js
window.appName = 'MyApp';
console.log(appName); // 'MyApp'
```

**Node.js:**
```js
global.appName = 'MyApp';
console.log(global.appName); // 'MyApp'
```
> This works, but is generally not recommended due to tight coupling and side effects.

---

### ⚠️ 4. `this` Behavior

**Browser:**
```js
console.log(this); // window
```

**Node.js:**
```js
console.log(this); // {} (same as module.exports)
```
> In the top-level scope of a Node.js module, `this` refers to `module.exports`, not `global`.

---

### 🧪 5. Example Comparison

**Browser Example:**
```html
<script>
    var a = 1;
    console.log(window.a); // 1
</script>
```

**Node.js Example:**
```js
var a = 1;
console.log(global.a); // undefined
```

To attach explicitly:

```js
global.a = 1;
console.log(global.a); // 1
```


## Q38: What is the meaning of the `@` prefix on npm package?

The `@` prefix in an npm package name indicates the package is part of a **scoped package**.

### ✅ What is a Scoped Package?

A scoped package groups related packages under a namespace, typically representing an organization, team, or user.

#### 📦 Format

```
@scope/package-name
```

**Example:**

```bash
npm install @nestjs/core
```

- `@nestjs` is the scope (publisher or organization)
- `core` is the package name

### 🧠 Why Use Scoped Packages?

| Benefit            | Explanation                                         |
|--------------------|-----------------------------------------------------|
| ✅ Namespacing     | Prevents naming conflicts with other packages        |
| ✅ Private packages| Scoped packages can be published as private on npm   |
| ✅ Logical grouping| Groups related modules by team/project/org           |
| ✅ Access control  | Manage permissions on a per-scope basis              |

#### 🔐 Private Scoped Packages

Scoped packages are **private by default** unless marked as public.

```bash
npm publish --access public
```

If you publish without `--access public`, you'll get an error unless you have a paid account or are working in a private org.

#### 📁 Directory Structure Example

If you're building your own packages:

```
packages/
├── package.json
├── @myorg/
│   ├── utils/
│   └── api/
```

Your `package.json` might look like:

```json
{
    "name": "@myorg/utils",
    "version": "1.0.0"
}
```

---

## Q39: Which one is better: Node.js built-in cluster or PM2 clustering?

### 🧩 1. What Are They?

#### ✅ Node.js cluster Module

- Built-in core module for forking multiple worker processes sharing the same server port.
- Requires manual management of workers (forking, restarting, load balancing, etc.).

#### ✅ PM2 Clustering

- PM2 is a production process manager for Node.js.
- Offers clustering using the same underlying cluster module, but with automation, monitoring, and management tools.

### 🆚 Feature Comparison

| Feature                  | Node.js cluster      | PM2 Clustering                       |
|--------------------------|---------------------|--------------------------------------|
| Built-in                 | ✅ Yes              | ❌ External module (`npm install pm2`)|
| Process management       | Manual (you code it)| Automatic and declarative            |
| Auto-restart on crash    | You implement it    | ✅ Built-in                           |
| Load balancing           | Round-robin         | ✅ Same (uses cluster under the hood) |
| Monitoring dashboard     | ❌ None             | ✅ PM2 Dashboard / Web UI             |
| Log management           | Manual              | ✅ Automatic + log rotation           |
| Zero-downtime reloads    | ❌ Difficult        | ✅ Supported (`pm2 reload`)           |
| Deployment features      | ❌                  | ✅ (e.g., `pm2 deploy`)               |
| Ecosystem integration    | ❌ Raw              | ✅ Config, health checks, metrics     |
| Ideal for                | Full control        | Quick setup, production deployment   |

### 🧠 When to Use Node.js cluster

Choose cluster if:

- You need custom behavior around worker lifecycle (e.g., graceful shutdowns, sticky sessions).
- You are building a framework or platform.
- You want fine-grained control over worker communication, fault tolerance, and orchestration.

**Example:**

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Auto-restart
    });
} else {
    http.createServer((req, res) => {
        res.end(`Handled by worker ${process.pid}`);
    }).listen(3000);
}
```

### ⚙️ When to Use PM2 Clustering

Choose PM2 if:

- You want quick scaling across CPUs with minimal setup.
- You need production readiness: logs, monitoring, auto-restart, crash recovery.
- You prefer infrastructure-as-code style app declarations.

**Example:**

```bash
npm install -g pm2
pm2 start app.js -i max    # Cluster mode, spawn processes equal to CPU cores
```

You can also use a config file:

```js
// ecosystem.config.js
module.exports = {
    apps: [{
        name: "api",
        script: "./app.js",
        instances: "max",
        exec_mode: "cluster"
    }]
};
```

Run with:

```bash
pm2 start ecosystem.config.js
```

### 🧾 Summary

| Use Case                                               | Recommended Option |
|--------------------------------------------------------|-------------------|
| Fast, production-grade setup with monitoring           | ✅ PM2            |
| Full control over forking, communication, shutdowns    | ✅ cluster        |
| Deploying in containerized/serverless setup            | ⚠️ Depends        |
| Avoid external tools                                   | ✅ cluster        |
| Need built-in logging, dashboards, deployment          | ✅ PM2            |

### 👑 Final Verdict

| Scenario                               | Use                |
|-----------------------------------------|--------------------|
| Simple scalability, fast setup          | 🔥 PM2             |
| Custom orchestration logic              | 🧠 Node.js cluster |
| Production server with monitoring       | 🚀 PM2 (cluster mode)|

---

## Q40: When would you use cluster module in Node.js?

### 🧠 Why Use the Cluster Module?

Node.js runs on a single-threaded event loop, so only one CPU core is used by default. To utilize all available cores, you need to spawn separate processes — this is where the cluster module helps.

### ✅ Common Use Cases

1. **Improve Throughput on Multi-core Machines**

     Fork worker processes across cores for high connection volume.

     ```js
     const cluster = require('cluster');
     const os = require('os');

     if (cluster.isMaster) {
         const numCPUs = os.cpus().length;
         console.log(`Master ${process.pid} is running`);

         for (let i = 0; i < numCPUs; i++) {
             cluster.fork();
         }

         cluster.on('exit', (worker, code, signal) => {
             console.log(`Worker ${worker.process.pid} died. Restarting...`);
             cluster.fork(); // Optional restart
         });
     } else {
         require('./server'); // Load your HTTP server logic
     }
     ```

2. **Handling CPU-bound Tasks Without Blocking the Event Loop**

     Spread heavy computation across multiple worker processes.

3. **Graceful Handling of Failures (Fault Tolerance)**

     Monitor and restart workers automatically if they crash.

     ```js
     cluster.on('exit', (worker) => {
         console.log(`Worker ${worker.process.pid} exited`);
         cluster.fork(); // Optional self-healing
     });
     ```

4. **Load Balancing Across Processes**

     Built-in round-robin load balancer (on Unix-like systems).

     > ⚠️ On Windows, handled differently (shared socket).

5. **Pre-forking Servers for Performance**

     Pre-forking at startup ensures workers are ready to serve immediately.

#### 🚫 When Not to Use cluster

- You need advanced process management, monitoring, and logging → Use PM2
- You're deploying in containers (Docker, Kubernetes) that handle multiple replicas → prefer single-threaded Node.js instances
- For short-lived or serverless functions (like AWS Lambda) where scalability is managed by the platform

#### 📝 Real-world Examples

- Web servers (Express.js, Koa.js) scaling across CPUs
- Real-time APIs handling thousands of socket connections
- Queues/workers parallelizing CPU-heavy jobs (video processing, PDF generation)

---

## Q41: What is the purpose of pm2 module in Node.js?

### 🚀 Purpose of PM2

The main goals of PM2 are:

| Purpose                  | Description                                               |
|--------------------------|----------------------------------------------------------|
| 🔁 Keep your app alive    | Automatically restarts your app if it crashes or stops   |
| 📊 Monitor performance   | Provides real-time metrics and logs                      |
| 🧠 Manage processes      | Helps scale across CPU cores using clustering            |
| 📦 Simplify deployment   | Built-in configs, process list saving/loading, reloads   |
| 📜 Centralized logging   | Aggregates logs for all processes (stdout and stderr)    |

### ⚙️ Key Features of PM2

1. **Process Management**
     - Start/stop/restart your app
     - Manage multiple apps/services from a single CLI/dashboard

     ```bash
     pm2 start app.js        # Start app
     pm2 stop app            # Stop app by name
     pm2 restart app         # Restart
     ```

2. **Cluster Mode (Multi-Core Support)**
     - Spawn Node.js processes equal to CPU cores

     ```bash
     pm2 start app.js -i max   # 'max' = number of CPU cores
     ```

     Uses Node.js cluster module internally.

3. **Auto-Restart on Crash**

     ```bash
     pm2 start app.js --watch   # Watches for file changes, restarts automatically
     ```

4. **Log Management**
     - Centralized logging and optional log rotation

     ```bash
     pm2 logs        # View logs
     pm2 flush       # Clear logs
     ```

5. **Monitoring & Dashboard**
     - Real-time metrics (CPU, memory)

     ```bash
     pm2 monit       # Terminal-based monitor
     ```

     Also available via web dashboard (pm2 plus or keymetrics.io).

6. **Zero-Downtime Deployments**

     ```bash
     pm2 reload app   # Zero-downtime reload
     ```

7. **Ecosystem Configuration**

     Define multiple apps/environments in one file:

     ```js
     // ecosystem.config.js
     module.exports = {
         apps: [
             {
                 name: "api",
                 script: "./server.js",
                 instances: "max",
                 exec_mode: "cluster",
                 watch: true,
                 env: {
                     NODE_ENV: "development"
                 },
                 env_production: {
                     NODE_ENV: "production"
                 }
             }
         ]
     };
     ```

     Run with:

     ```bash
     pm2 start ecosystem.config.js
     ```

8. **Startup Script (Auto-boot on System Restart)**

     ```bash
     pm2 startup
     pm2 save      # Save current process list
     ```

### 🔐 When Should You Use PM2?

Use PM2 when:

- Deploying Node.js apps in production
- Need resilience (auto-restart on crash)
- Want easy clustering with minimal config
- Need process monitoring/logging out of the box
- Managing multiple apps or microservices


## Q42: How do I run a Node.js app as a background service?

### 1. Using PM2 (Recommended for Production)

PM2 is a popular production process manager for Node.js apps. It simplifies background execution, auto-restart, and monitoring.

**Install PM2:**
```bash
npm install -g pm2
```

**Start your app:**
```bash
pm2 start app.js
```

**Save the running process list:**
```bash
pm2 save
```

**Set up startup script for boot:**
```bash
pm2 startup
# Follow the command it gives (e.g., systemctl enable...)
```
Your app will now restart on system reboot and run in the background.

**Monitor:**
```bash
pm2 list         # Shows all apps
pm2 logs         # See logs
pm2 monit        # Real-time monitoring
```

---

### 2. Using `nohup` + `&` (Simple, Not Ideal for Production)

A Linux/Unix shell trick for running a process in the background.

**Run your app:**
```bash
nohup node app.js > output.log 2>&1 &
```
- `nohup`: Ignores hangup signals (terminal exit)
- `&`: Sends to background
- `> output.log 2>&1`: Redirects output and error to a log file

**Kill it later:**
```bash
ps aux | grep node
kill <PID>
```
> **Note:** Not ideal for crash recovery or log rotation.

---

### 3. Using systemd (Linux-only, Ideal for Server Environments)

Systemd lets you define services that automatically run at startup.

**Create a service file:**  
`/etc/systemd/system/myapp.service`
```ini
[Unit]
Description=My Node.js App
After=network.target

[Service]
ExecStart=/usr/bin/node /path/to/app.js
Restart=always
User=nobody
Environment=NODE_ENV=production
WorkingDirectory=/path/to

[Install]
WantedBy=multi-user.target
```

**Enable and Start:**
```bash
sudo systemctl daemon-reexec
sudo systemctl enable myapp
sudo systemctl start myapp
```

**Check status:**
```bash
sudo systemctl status myapp
```
> Good for deep Linux integration, but more complex than PM2.

---

### 4. Using Docker (Containerized Background Service)

If your app runs in a container:
```bash
docker run -d --name myapp myimage
```
- `-d` runs the container in detached (background) mode

---

### Summary Table

| Method      | Use Case                  | Restarts on Crash | Restarts on Reboot | Monitors   |
|-------------|---------------------------|-------------------|--------------------|------------|
| PM2         | Production-grade apps     | ✅ Yes            | ✅ Yes             | ✅ Yes     |
| nohup &     | Quick and dirty           | ❌ No             | ❌ No              | ❌ No      |
| systemd     | Linux servers, OS-level   | ✅ Yes            | ✅ Yes             | 🟡 Basic   |
| Docker      | Containerized apps        | ✅ (if configured)| ✅ (via orchestrator)| 🟡 Basic |

---

## Q43: Is an Event Emitter Synchronous or Asynchronous?

An `EventEmitter` in Node.js is **synchronous by default** — but can be used in both synchronous and asynchronous contexts.

### Default Behavior: Synchronous

When an event is emitted, the listeners (callbacks) attached to that event are called **immediately and synchronously** in the order they were registered.

**Example: Synchronous Execution**
```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('message', () => {
    console.log('Listener 1 executed');
});

emitter.on('message', () => {
    console.log('Listener 2 executed');
});

console.log('Before emit');
emitter.emit('message');
console.log('After emit');
```
**Output:**
```
Before emit
Listener 1 executed
Listener 2 executed
After emit
```
> The `emit()` method runs all listeners synchronously, before continuing with the next line.

---

### But You Can Make Listeners Asynchronous

While `EventEmitter.emit()` is synchronous, your listeners themselves can perform asynchronous operations.

**Example: Asynchronous Listener**
```js
emitter.on('asyncEvent', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Async listener done');
});

console.log('Before async emit');
emitter.emit('asyncEvent');
console.log('After async emit');
```
**Output:**
```
Before async emit
After async emit
Async listener done
```
> Even though the listener is async, `emit()` itself does not wait — it just calls the listener and moves on.

---

### Key Takeaways

| Concept                | Behavior                        |
|------------------------|---------------------------------|
| `emitter.emit()`       | 🔁 Synchronous                  |
| Listeners              | Can be synchronous or async     |
| emit() waits for async?| ❌ No                           |
| Order of execution     | ✅ In the order registered      |

**Summary:**  
- `EventEmitter.emit()` is synchronous by design.
- Any asynchronous behavior must be implemented inside the listener.
- If you need to await all listeners or coordinate async actions, use Promises or libraries like EventEmitter2 or eventemitter3.

---

## Q44: Explain the order of Event Listeners execution in Node.js

### Order of Execution: First Registered, First Called

Each call to `.on()` (or `.addListener()`) adds a listener to an internal list. When you call `.emit()`, Node.js synchronously invokes all listeners for that event in the order they were added.

**Example**
```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('event', () => {
    console.log('Listener 1');
});

emitter.on('event', () => {
    console.log('Listener 2');
});

emitter.emit('event');
```
**Output:**
```
Listener 1
Listener 2
```

---

### Special Cases

#### 1. `prependListener()`
Adds a listener to the front of the list instead of the end.
```js
emitter.prependListener('event', () => {
    console.log('Prepended Listener');
});
```
This listener executes before others.

#### 2. `once()` and `prependOnceListener()`
- `once()` adds a one-time listener that is removed after the first execution.
- `prependOnceListener()` does the same but puts it at the front.

```js
emitter.once('event', () => {
    console.log('Once Listener');
});
```
They still follow the ordering rules.

---

**Example: Mixed Order**
```js
const emitter = new EventEmitter();

emitter.on('event', () => console.log('Listener A'));
emitter.prependListener('event', () => console.log('Prepended Listener'));
emitter.once('event', () => console.log('Once Listener'));
emitter.prependOnceListener('event', () => console.log('Prepended Once Listener'));

emitter.emit('event');
emitter.emit('event');
```
**Output:**
```
Prepended Once Listener
Prepended Listener
Once Listener
Listener A
Prepended Listener
Listener A
```

---

### Under the Hood

Node.js maintains a listener array per event:
```js
this._events[event] = [listener1, listener2, ...];
// .on() → pushes to the end
// .prependListener() → unshifts to the beginning
// .emit() → loops over the array synchronously in order
```

---

### Async Pitfall

The order of execution remains consistent, but completion time depends on whether listeners are async:

```js
emitter.on('event', async () => {
    await new Promise(r => setTimeout(r, 100));
    console.log('Slow Listener');
});

emitter.on('event', () => {
    console.log('Fast Listener');
});

emitter.emit('event');
```
**Output:**
```
Fast Listener
Slow Listener
```
Even though Slow Listener was added first, `emit()` doesn’t wait for it to finish.

---

### Summary Table

| Method                  | Behavior                                 |
|-------------------------|------------------------------------------|
| `on()` / `addListener()`| Appends listener to the end              |
| `prependListener()`     | Adds listener to the beginning           |
| `once()`                | Adds a one-time listener at the end      |
| `prependOnceListener()` | Adds a one-time listener at the beginning|
| `emit()`                | Calls listeners synchronously, in order  |


## Q45: What is a Stream and What Types of Streams are Available in Node.js?

In Node.js, a **stream** is an abstract interface for working with streaming data—data that is read or written sequentially over time, rather than all at once.

Streams are used to handle I/O efficiently, such as reading files, receiving HTTP requests, or interacting with network sockets, especially when dealing with large data.

### 🧠 Why Use Streams?

- **Memory-efficient:** Process data chunk-by-chunk (not the entire file in memory).
- **Faster:** Start processing before the full data is available.
- **Composable:** You can pipe streams together for transformations.

### 🔄 Types of Streams in Node.js

There are four main types of streams:

| Type      | Direction      | Description                          | Example                                 |
|-----------|---------------|--------------------------------------|-----------------------------------------|
| Readable  | Read data     | You can read data from it            | `fs.createReadStream()`, HTTP request   |
| Writable  | Write data    | You can write data to it             | `fs.createWriteStream()`, HTTP response |
| Duplex    | Read + Write  | Can read and write (2-way)           | `net.Socket`                            |
| Transform | Modify data   | Duplex stream that transforms data   | `zlib.createGzip()`, compression        |

---

### 🔍 Stream Types in Detail

#### 1. ✅ Readable Stream

Data is pushed from a source to your app. You can listen to `'data'`, `'end'`, and `'error'` events.

```js
const fs = require('fs');
const readable = fs.createReadStream('file.txt');

readable.on('data', chunk => {
    console.log('Received:', chunk.toString());
});
```

#### 2. ✅ Writable Stream

You write data into the stream.

```js
const writable = fs.createWriteStream('output.txt');
writable.write('Hello, World!');
writable.end();
```

#### 3. ✅ Duplex Stream

Has both readable and writable sides.

```js
const { Duplex } = require('stream');

const duplex = new Duplex({
    read(size) {
        this.push('Read data');
        this.push(null); // No more data
    },
    write(chunk, encoding, callback) {
        console.log('Written:', chunk.toString());
        callback();
    }
});

duplex.on('data', chunk => console.log('Received:', chunk.toString()));
duplex.write('Write this');
```

#### 4. ✅ Transform Stream

A special duplex stream that modifies the input before passing it to the output.

```js
const { Transform } = require('stream');

const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});

process.stdin.pipe(upperCaseTransform).pipe(process.stdout);
```
_Type some text in your terminal to see it printed in uppercase!_

---

### 🛠 Built-in Stream Implementations in Node.js

| Module | Stream Type         | Use Case                  |
|--------|---------------------|---------------------------|
| fs     | Readable/Writable   | File read/write           |
| http   | Readable/Writable   | HTTP requests/responses   |
| zlib   | Transform           | Compression (gzip/deflate)|
| net    | Duplex              | TCP sockets               |
| stream | All                 | Custom stream creation    |

---

## Q46: When Should I Use EventEmitter?

Use `EventEmitter` in Node.js when you want to build a system based on publish/subscribe (pub-sub) or event-driven architecture, especially when components need to react to specific events emitted by other components—without tightly coupling them together.

### ✅ When to Use EventEmitter

1. **Custom Event-Driven Logic**  
     If your module or object needs to emit events that others should respond to.

     ```js
     const EventEmitter = require('events');
     const emitter = new EventEmitter();

     emitter.on('userCreated', (user) => {
         console.log('Welcome email sent to:', user.email);
     });

     function createUser(email) {
         const user = { email };
         emitter.emit('userCreated', user);
     }

     createUser('alice@example.com');
     ```
     _Use case: decoupling side-effects (e.g., logging, analytics, emails) from core logic._

2. **Replacing Callbacks with Events for Reusability**  
     If you’re building something where callbacks would be too rigid or deeply nested.

     ```js
     downloader.on('progress', percent => {
         console.log(`Downloaded ${percent}%`);
     });
     ```

3. **Implementing Observer Pattern**  
     Notify multiple subscribers when something changes (e.g., file changes, user state changes).

4. **Streaming and Network-based Modules**  
     Built-in Node.js modules like `http`, `net`, `fs`, and `stream` all use EventEmitter.

     ```js
     const http = require('http');

     const server = http.createServer();

     server.on('request', (req, res) => {
         res.end('Hello World');
     });

     server.listen(3000);
     ```

5. **Plugin or Hook Systems**  
     For apps that allow plugin architecture, EventEmitter allows plugins to hook into specific events (e.g., `beforeSave`, `afterLogin`, `onShutdown`).

---

### ❌ When Not to Use EventEmitter

- **Overkill for simple data flow:** If your data flow is straightforward, avoid unnecessary complexity.
- **When you need async results:** Prefer Promises or async/await for one-time async actions (like fetching data).
- **Hard to trace/debug:** Events can make flow harder to follow in large codebases without good naming/logging.

---

### 🧠 Design Tip

| Criteria                              | Use EventEmitter? |
|----------------------------------------|:----------------:|
| Many listeners reacting to an action   | ✅ Yes           |
| Decouple logic across modules          | ✅ Yes           |
| One-time data response                 | ❌ No (use Promise)|
| Complex error handling required        | ⚠️ Use with caution |

---

### 🛠 Real-World Examples

| Use Case              | Why EventEmitter Works Well         |
|-----------------------|-------------------------------------|
| Chat application      | Broadcast messages to clients       |
| Logging system        | Emit logs across app layers         |
| Upload progress       | Update UI with % completed          |
| Server lifecycle hooks| Emit onStart, onStop                |

---

### ✅ Summary

Use EventEmitter when you:

- Need a reactive, decoupled, scalable system.
- Want to model events like `userLoggedIn`, `fileUploaded`, `connectionLost`.
- Are building on top of Node.js’s own event-driven design (e.g., HTTP, TCP, Streams).

---

## Q53: How Does Node.js Handle Child Threads?

Node.js is single-threaded by design, but it can create child threads to offload CPU-intensive or blocking tasks. This is primarily done using:

### ✅ Two Main Ways to Handle Child Threads in Node.js

1. **`child_process` module** – For running external scripts or processes
2. **`worker_threads` module** – For running JavaScript code in parallel threads

---

### 🧵 1. `child_process` – External Processes

Used to spawn system-level child processes. You can:

- Execute shell commands
- Run other Node.js scripts
- Communicate via stdin, stdout, and stderr

**Example: Spawn a child Node.js process**

```js
const { spawn } = require('child_process');

const child = spawn('node', ['child.js']);

child.stdout.on('data', (data) => {
    console.log(`Child Output: ${data}`);
});

child.on('exit', (code) => {
    console.log(`Child exited with code ${code}`);
});
```
_This will execute the `child.js` file as a new Node.js process (child OS process)._

---

### 👷 2. `worker_threads` – True JavaScript Threads

The modern way to handle child threads in Node.js (since v10.5+).

- Allows running JS in parallel using Worker Threads
- Useful for CPU-intensive tasks (e.g., hashing, image processing)
- Shared memory (via `SharedArrayBuffer`) is supported

**Example: Basic Worker Thread**

**worker.js**
```js
const { parentPort } = require('worker_threads');

parentPort.postMessage('Hello from worker!');
```

**main.js**
```js
const { Worker } = require('worker_threads');

const worker = new Worker('./worker.js');

worker.on('message', message => {
    console.log('Received from worker:', message);
});
```
_Worker threads live in separate V8 contexts, unlike regular async code._

---

### 🔍 Comparison: `child_process` vs `worker_threads`

| Feature      | child_process         | worker_threads                  |
|--------------|----------------------|---------------------------------|
| Scope        | OS process           | Thread within same process      |
| Memory       | Separate             | Shared (via SharedArrayBuffer)  |
| IPC          | stdin, stdout, message| postMessage() and parentPort   |
| Use Case     | Shell commands, scripts| Heavy JS computation          |
| Startup cost | High                 | Low (lighter threads)           |

---

### 🔧 When to Use What?

| Use Case                        | Recommended Approach         |
|----------------------------------|-----------------------------|
| Running external shell scripts   | `child_process.spawn()`      |
| Parallel CPU-bound JS logic      | `worker_threads`             |
| Offloading image/video encoding  | `worker_threads`             |
| Executing other Node scripts     | `child_process.fork()`       |

---

### 💡 Bonus: Offloading Expensive Work

If you're doing CPU-intensive logic like:

- File compression
- Image resizing
- Large JSON parsing
- Crypto/hash functions

➡️ Use `worker_threads` to avoid blocking the event loop.

---

### 🚨 Important Notes

- Node.js is not multi-threaded by default—all your JavaScript runs in a single thread.
- Use threads only when needed. For most web apps, the event loop and async I/O are enough.
- Too many threads or child processes = memory & CPU overhead.




## Q54: Could we run an external process with Node.js?

### 🧪 Example 3: Run a Python Script from Node.js

**hello.py**
```python
print("Hello from Python")
```

**Node.js:**
```js
const { spawn } = require('child_process');

const py = spawn('python3', ['hello.py']);

py.stdout.on('data', (data) => {
    console.log(`🐍 Output: ${data}`);
});
```

---

### 👶 Example 4: Run Another Node.js Script with `fork()`

**child.js**
```js
process.on('message', (msg) => {
    console.log('Child received:', msg);
    process.send('Message received!');
});
```

**main.js**
```js
const { fork } = require('child_process');

const child = fork('./child.js');
child.send('Hello Child');
child.on('message', (msg) => {
    console.log('Main received:', msg);
});
```
> `fork()` is optimized for IPC (inter-process communication) between Node processes.

---

## Q56: What is the preferred method of resolving unhandled exceptions in Node.js?

### ✅ Best Practices to Resolve Unhandled Exceptions

1. **Use `try...catch` with async/await**
        ```js
        async function fetchData() {
            try {
                const data = await getDataFromDB();
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle/recover gracefully
            }
        }
        ```
        > 🔐 Most robust and readable approach for async logic.

2. **Use `.catch()` with Promises**
        ```js
        getDataFromDB()
            .then(data => console.log(data))
            .catch(err => {
                console.error('Error:', err);
            });
        ```

3. **Listen to `process.on('uncaughtException')` (for last-resort fallback)**
        ```js
        process.on('uncaughtException', (err) => {
            console.error('🔥 Uncaught Exception:', err);
            // Clean up resources, then exit
            process.exit(1); // recommended
        });
        ```
        > ⚠️ This should be your emergency catch-all, not a regular pattern.

4. **Listen to `process.on('unhandledRejection')` (Promise rejections)**
        ```js
        process.on('unhandledRejection', (reason, promise) => {
            console.error('🚨 Unhandled Promise Rejection:', reason);
            // Optional: send logs, cleanup
            process.exit(1); // or restart app
        });
        ```
        > ⛔ Unhandled rejections will crash the app in future Node versions (strict mode).

---

### 🔁 Recommended Recovery Strategy

| Step                | Why it matters                                 |
|---------------------|------------------------------------------------|
| Log the error       | Visibility in production                       |
| Alert if needed     | Notify ops/monitoring systems                  |
| Clean up resources  | Close DB connections, clear timers             |
| Exit gracefully     | Avoid undefined behavior                       |
| Use a process manager | PM2 or Docker will auto-restart             |

---

### 👎 What Not to Do

- Avoid using `uncaughtException` for business logic recovery — it’s only for fatal fallback.
- Don't continue running after a fatal error; the app could be in an unstable state.

---

### 👷‍♂️ Production Tip: Combine with a Process Manager

Use PM2, Docker, or Kubernetes to:
- Auto-restart the process on crash
- Ensure high availability

```bash
pm2 start app.js --restart-delay=5000
```

---

## Q58: What Are Buffers and Why Use Them in Node.js?

A **Buffer** is a built-in object used to handle binary data directly in memory, especially useful when dealing with streams, files, or network operations.

### 📦 What is a Buffer?

A Buffer is a raw memory allocation outside of the V8 heap (unlike strings or objects), used to efficiently process binary data like:

- Images
- Videos
- PDF files
- Data coming over network protocols (TCP, HTTP)
- File I/O

```js
const buffer = Buffer.from('Hello');
console.log(buffer); // <Buffer 48 65 6c 6c 6f>
```
> ✅ Buffer gives you low-level access to memory similar to C/C++.

---

### ✅ Why Use Buffers in Node.js?

| Reason                | Explanation                                                        |
|-----------------------|--------------------------------------------------------------------|
| 🧠 Binary data handling | Enables you to work with binary directly (e.g., TCP packets, file chunks) |
| 🔄 Stream I/O          | Buffers are key when processing streams (e.g., file read/write, HTTP body) |
| 💬 Encoding support    | Easily convert between UTF-8, ASCII, Base64, etc.                 |
| ⚡ Performance         | Efficient for low-level operations (faster than working with strings/arrays) |
| 📤 Network transmission| Required when sending/receiving binary over TCP/UDP               |

---

### 🛠 Common Use Cases

**Reading files in binary format:**
```js
const fs = require('fs');
const buffer = fs.readFileSync('image.png');
console.log(buffer); // binary data
```

**Writing to file in chunks:**
```js
const buf = Buffer.from('Node.js Rocks!');
fs.writeFileSync('message.txt', buf);
```

**Streaming (e.g., HTTP, TCP):**
```js
http.createServer((req, res) => {
    const file = fs.createReadStream('bigfile.zip');
    file.pipe(res); // uses internal buffering
});
```

**Base64 encoding:**
```js
const buf = Buffer.from('hello');
console.log(buf.toString('base64')); // aGVsbG8=
```

---

### 🧪 Creating Buffers

```js
Buffer.from('Hello');        // From string
Buffer.alloc(10);            // Allocate buffer of size 10 (filled with 0s)
Buffer.allocUnsafe(10);      // Faster, but uninitialized (use carefully)
```

> ⚠️ Use `Buffer.alloc()` instead of `Buffer.allocUnsafe()` unless you're optimizing and confident.  
> Avoid holding large buffers in memory if you're not processing them immediately (memory leaks).

---

### 🔁 Encoding Support

Buffer supports conversions between multiple encodings:

- 'utf8'
- 'ascii'
- 'base64'
- 'hex'
- 'latin1'

```js
const buf = Buffer.from('hello', 'utf8');
console.log(buf.toString('hex')); // 68656c6c6f
```

---

## Q59: What is Stream Chaining in Node.js?

**Stream Chaining** refers to connecting multiple stream operations together using the `.pipe()` method — creating a chain or pipeline where data flows from one stream to the next.

It's an elegant way to process large amounts of data in small chunks without buffering it all in memory.

---

### 🧠 Why Use Stream Chaining?

- ✅ Memory-efficient: Avoids loading entire data into memory.
- ✅ Modular: Breaks processing into reusable parts.
- ✅ Non-blocking: Uses async I/O under the hood.
- ✅ Readable: Cleaner syntax using `.pipe()`.

---

### 📦 Real-World Analogy

Imagine you're washing clothes:

- 🧺 Input: Dirty laundry (Readable Stream)
- 🚿 Washer: Cleans clothes (Transform Stream)
- 🌬️ Dryer: Dries clothes (Writable Stream)
- 🧼 You chain them: `washer.pipe(dryer)`

---

### ✅ Example: Reading, Compressing, and Writing a File

```js
const fs = require('fs');
const zlib = require('zlib');

// Step 1: Create readable, transform, and writable streams
const readable = fs.createReadStream('input.txt');
const gzip = zlib.createGzip();
const writable = fs.createWriteStream('input.txt.gz');

// Step 2: Chain them together
readable
    .pipe(gzip)         // compress
    .pipe(writable)     // write to .gz file
    .on('finish', () => {
        console.log('✅ File successfully compressed.');
    });
```
> 🔗 Each `.pipe()` connects one stream to the next.

---

### 🧪 Breakdown of Stream Chain Components

| Stream Type | Purpose                  | Example                        |
|-------------|--------------------------|--------------------------------|
| Readable    | Source of data           | `fs.createReadStream()`        |
| Writable    | Destination for data     | `fs.createWriteStream()`       |
| Duplex      | Both readable and writable | Custom TCP socket            |
| Transform   | Modify data while streaming | `zlib.createGzip()`, custom CSV parser |

---

### 🌊 Example: Chain of Transforms

```js
const { createReadStream, createWriteStream } = require('fs');
const { createGzip, createBrotliCompress } = require('zlib');

createReadStream('input.txt')
    .pipe(createGzip())              // gzip compress
    .pipe(createBrotliCompress())    // then brotli compress
    .pipe(createWriteStream('input.txt.gz.br'))
    .on('finish', () => console.log('Double compressed!'));
```

---

### 🧰 Bonus: Custom Transform Stream

```js
const { Transform } = require('stream');

const toUpperCase = new Transform({
    transform(chunk, encoding, callback) {
        const upper = chunk.toString().toUpperCase();
        callback(null, upper);
    }
});

fs.createReadStream('input.txt')
    .pipe(toUpperCase)
    .pipe(fs.createWriteStream('output.txt'));
```

---

### ⚠️ Error Handling in Chained Streams

Always attach `.on('error', ...)` to each stream or use a pipeline utility:

```js
const { pipeline } = require('stream');
pipeline(
    fs.createReadStream('input.txt'),
    zlib.createGzip(),
    fs.createWriteStream('output.gz'),
    (err) => {
        if (err) console.error('Pipeline failed.', err);
        else console.log('Pipeline succeeded.');
    }
);
```



## Q60: What is a Blocking Code in Node.js?

In Node.js, **blocking code** refers to any code that halts the execution of the entire event loop until the operation completes. This prevents Node.js from handling other requests during that time.

### 🔥 Why It's a Problem

Node.js runs on a single-threaded event loop, so blocking code means:

- ❌ The entire server becomes unresponsive until that code finishes.

### 🧱 Example of Blocking Code

```js
const fs = require('fs');

// ❌ Blocking (synchronous) version
const data = fs.readFileSync('bigfile.txt', 'utf8');
console.log('File content:', data);
console.log('This line waits for file read to finish');
```
> `fs.readFileSync` blocks the entire thread — no other request is processed until the file is fully read.

#### ✅ Non-Blocking Alternative

```js
fs.readFile('bigfile.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log('File content:', data);
});
console.log('This line is printed immediately!');
```
> `fs.readFile()` is asynchronous — it delegates work and lets the event loop stay free to handle other tasks.

### ⏱ Common Examples of Blocking Code

| Blocking API                  | Better Alternative                |
|-------------------------------|-----------------------------------|
| `fs.readFileSync()`           | `fs.readFile()` (async)           |
| `crypto.pbkdf2Sync()`         | `crypto.pbkdf2()`                 |
| `child_process.execSync()`    | `child_process.exec()`            |
| `JSON.parse(largeJSONString)` | Use stream-based JSON parser      |
| CPU-heavy loops or sorting    | Move to Worker Threads            |

### 🧠 Real-World Analogy

> 🕴️ Imagine a receptionist handling calls. If one caller takes 5 minutes and the receptionist can’t take other calls until done, that’s blocking.

### ⚠️ How Blocking Happens

- Synchronous operations
- Tight CPU loops (e.g., infinite loops, recursive calculations)
- Large JSON processing
- File or network operations done synchronously

### 🧰 Tools to Avoid Blocking

- Use async APIs (most Node.js APIs are async)
- Worker Threads: Offload CPU-bound tasks
- Child Processes: For long-running or external tasks
- Event-Driven Architecture: Use streams, events, and callbacks/promises

---

## Q63: Do I need Dependency Injection in Node.js and how to deal with it?

**Yes** — Dependency Injection (DI) can be very useful in Node.js, especially as your application grows in complexity. While not required for small scripts, DI brings many benefits in large, testable, maintainable codebases (e.g., microservices, backends, CLI apps).

### 🧠 What Is Dependency Injection?

Dependency Injection is a design pattern where an object’s dependencies (e.g., services, configurations, DB clients) are provided externally, rather than the object creating them itself.

#### 📦 Instead of this:

```js
const db = new MongoDB();
const userService = new UserService(db);
```
You "inject" `db` into `UserService`, so it doesn't know or care how it's created.

### ✅ Why Use Dependency Injection in Node.js?

| Benefit                    | Description                                              |
|----------------------------|---------------------------------------------------------|
| 🧪 Easier to test          | Inject mocks/stubs during unit tests                    |
| ♻️ Reusable services       | Decouple business logic from concrete implementations   |
| 🔄 Swappable implementations | Swap services (e.g., local FS vs S3) without code change |
| 🔍 Better separation       | Keeps concerns clean: construction vs usage             |
| 🧱 Maintainable architecture | Helps with layered, modular code organization           |

### 🧰 Approaches to DI in Node.js

#### 1. Manual Injection (Simple & Common)

```js
// db.js
class DB {
    connect() { console.log('Connected'); }
}

// service.js
class UserService {
    constructor(db) {
        this.db = db;
    }
    getUsers() {
        this.db.connect();
        return ['user1', 'user2'];
    }
}

// app.js
const db = new DB();
const userService = new UserService(db);
userService.getUsers();
```
✔️ Simple, clean, no framework needed.

#### 2. Using a DI Container (InversifyJS)

If you want class-based DI like Angular/Spring:

```bash
npm install inversify reflect-metadata
```

```ts
// userService.ts
@injectable()
class UserService {
    constructor(@inject("DB") private db: DB) {}
}
```

```ts
// di-container.ts
const container = new Container();
container.bind<DB>("DB").to(MongoDB);
container.bind<UserService>(UserService).toSelf();
```
You can now inject dependencies across the app without manually wiring them each time.

#### 3. Function-Based Dependency Injection (Functional Style)

You don’t need classes to use DI:

```js
// service.js
function createUserService(db) {
    return {
        getUsers: () => {
            db.query('SELECT * FROM users');
        }
    };
}

const db = createMySQLConnection();
const userService = createUserService(db);
```
✔️ Ideal for functional programming or microservices.

### 🔍 When You Should Consider DI

- You're building a scalable backend (Express.js, Fastify, NestJS).
- You want clean testing without mocking global modules.
- You're integrating pluggable components (e.g., logger, mailer, cache).
- You need environment-based logic (local vs prod, real vs mock).

### 🔥 Example with Express + Manual DI

```js
// userRouter.js
module.exports = (userService) => {
    const router = require('express').Router();
    router.get('/', async (req, res) => {
        const users = await userService.getUsers();
        res.json(users);
    });
    return router;
};

// app.js
const express = require('express');
const app = express();
const db = require('./db');
const userService = require('./userService')(db);
const userRouter = require('./userRouter')(userService);

app.use('/users', userRouter);
```
✔️ All dependencies are injected from the top — easy to mock and test.

### 🧪 How It Helps with Testing

```js
const mockDB = {
    query: jest.fn().mockReturnValue([{ name: 'Mock User' }])
};

const userService = createUserService(mockDB);
expect(userService.getUsers()).toEqual([{ name: 'Mock User' }]);
```

---

## Q64: How can you have one global variable between all clustered workers in Node.js?

In Node.js, clustered workers run in separate processes, not threads — so memory is not shared between them. That means you **cannot directly share a global variable** across workers like in multithreaded environments.

However, there are workarounds to simulate shared global state between cluster workers.

### ✅ Recommended Solutions

#### 1. Use the Master Process (Primary) as a Coordinator

Workers can communicate with the master process via IPC (inter-process communication) using `process.send()` and `cluster.on('message')`.

**Example: Shared Counter via Master**

```js
// master-worker-global.js
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

let globalCounter = 0;

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();

        // Listen for updates from workers
        worker.on('message', (msg) => {
            if (msg.cmd === 'increment') {
                globalCounter++;
                console.log(`Global counter is now ${globalCounter}`);

                // Optionally send updated value back
                worker.send({ cmd: 'counterUpdated', value: globalCounter });
            }
        });
    }
} else {
    // Worker process
    setInterval(() => {
        process.send({ cmd: 'increment' });
    }, 2000);

    process.on('message', (msg) => {
        if (msg.cmd === 'counterUpdated') {
            console.log(`[Worker ${process.pid}] Got updated counter: ${msg.value}`);
        }
    });
}
```
✅ This creates a centralized global variable in the master process, while workers send/receive updates through messages.

#### 2. Use an External Shared Store (Redis, DB, etc.)

For production-ready, distributed systems, use Redis or similar shared storage.

```js
const redis = require('redis');
const client = redis.createClient();

client.incr('global_counter', (err, value) => {
    console.log(`Counter is now ${value}`);
});
```
🟢 Scales across multiple servers too. Ideal for true shared state across a cluster.

#### 3. Use worker_threads for Shared Memory (Not Cluster)

If you need actual shared memory, consider using `worker_threads` and `SharedArrayBuffer`.

```js
const { Worker, isMainThread, workerData } = require('worker_threads');

if (isMainThread) {
    const shared = new SharedArrayBuffer(4);
    const counter = new Int32Array(shared);

    new Worker(__filename, { workerData: shared });
    new Worker(__filename, { workerData: shared });

    setInterval(() => {
        console.log('Main counter:', counter[0]);
    }, 1000);
} else {
    const counter = new Int32Array(workerData);
    setInterval(() => {
        Atomics.add(counter, 0, 1);
    }, 500);
}
```
✅ Works only inside `worker_threads`, not cluster.

### ⚠️ Important Notes

| Option                | Shared Across Workers | Use Case                          |
|-----------------------|----------------------|-----------------------------------|
| In-memory variable    | ❌ No                | Local to each worker only         |
| Master coordination   | ✅ Yes (via IPC)     | Simple shared state               |
| Redis or DB           | ✅ Yes               | Scalable/shared across servers    |
| SharedArrayBuffer     | ✅ Yes (in threads)  | High-perf shared memory in threads|



## Q68: Does Node.js Support Multi-Core Platforms? Can It Utilize All Cores?

Yes, Node.js supports multi-core platforms and can utilize all CPU cores, but **not automatically**.

### 🧠 Why Not Automatically?

Node.js runs JavaScript using the V8 engine, which executes code on a **single thread per process**. This design simplifies non-blocking I/O, but also means:

- **By default, a Node.js app runs on only one CPU core.**

To take advantage of multiple cores, you must explicitly create multiple processes or threads.

---

### ✅ Ways to Utilize Multiple Cores in Node.js

#### 1. Cluster Module (Built-in)

The `cluster` module allows you to fork multiple child processes (workers), each running its own Node.js instance.

```js
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    console.log(`Worker ${process.pid} started`);
    // Start HTTP server or other work here
}
```
> Now each core gets its own worker process.

---

#### 2. PM2 Process Manager

[PM2](https://pm2.keymetrics.io/) is a popular production-grade process manager for Node.js that supports automatic clustering.

```bash
pm2 start app.js -i max
```
- `-i max` starts as many instances as CPU cores.
- Load is balanced using the cluster module internally.

> Easy to deploy, manage, and monitor multi-core Node.js apps.

---

#### 3. `worker_threads` (Built-in)

Use for parallel computation using threads (unlike cluster, which uses processes). Threads share memory, so they’re useful for CPU-intensive work.

```js
const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
    new Worker(__filename); // Spawns another thread
} else {
    // CPU-bound work here
}
```
> Useful for offloading CPU-heavy tasks, not I/O or HTTP workloads.

---

#### 4. Load Balancing (External)

You can also scale your app horizontally using:

- Docker + Kubernetes
- HAProxy or NGINX
- AWS Elastic Load Balancer

These approaches spin up multiple Node.js instances and distribute traffic to each.

---

### 🧪 Real-World Usage

| Use Case                      | Method                |
|-------------------------------|-----------------------|
| Handle more web traffic       | cluster or PM2        |
| Offload CPU-bound tasks       | worker_threads        |
| Microservices architecture    | Multiple containers   |
| Serverless multi-core scale   | Multiple Lambdas      |

---

### ❗️ Things to Remember

- Each cluster worker has its own memory, event loop, and Node.js instance.
- Use shared stores like Redis if workers need to share state.
- `worker_threads` are great for parallelizing CPU-heavy work (e.g., image processing, encryption).

---

## Q71: Difference Between `child_process.spawn` and `child_process.exec` in Node.js

Node.js's `child_process` module allows you to spawn and manage child processes. Two commonly used methods are:

- `spawn`
- `exec`

Both can run shell commands or external scripts, but they differ in how they handle input/output, buffering, and use cases.

---

### 🧠 TL;DR: Key Differences

| Feature             | spawn                | exec                         |
|---------------------|---------------------|------------------------------|
| Output handling     | Streams (stdout, stderr) | Buffers (entire output in memory) |
| Max data size       | Unlimited (streamed) | Limited (default: 200KB)     |
| Suitable for long output | ✅ Yes          | ❌ No (can overflow buffer)   |
| Shell execution     | ❌ No (default)      | ✅ Yes (executes in a shell)  |
| Use cases           | Data streaming, large output | Simple command with small output |
| Return value        | ChildProcess         | stdout, stderr via callback  |

---

### 🔧 1. `spawn()`

Used for streaming large outputs and fine-grained control of input/output.

```js
const { spawn } = require('child_process');

const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
```

**Best Use Cases:**
- Long-running processes (e.g., file uploads, logs)
- Real-time output (streaming logs)
- Heavy output size

---

### 🔧 2. `exec()`

Used for simple commands where you just want the result as a string, and you don’t expect large output.

```js
const { exec } = require('child_process');

exec('ls -lh /usr', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
```

**Default max buffer is 200KB:**

```js
exec('your_command', { maxBuffer: 1024 * 1024 }); // increase to 1MB
```

**Best Use Cases:**
- Small shell commands (e.g., `ls`, `pwd`, `git status`)
- Scripting with shell commands
- When you just want the full output as a string

---

### 🆚 `spawn` vs `exec` Summary Table

| Feature             | spawn         | exec (default)         |
|---------------------|--------------|------------------------|
| Output type         | Stream       | Buffer (string)        |
| Output size limit   | No           | Yes (default 200KB)    |
| Shell access        | No (can enable with shell) | Yes (default uses shell) |
| Performance (large data) | Better  | Worse (memory heavy)   |
| Callback style      | Event-based  | Callback-based         |
| Use case            | Real-time logs, large output | Simple command execution |

---

### ⚠️ Bonus: `execFile()`

Another variant of `exec` that runs an executable **without a shell**, for better performance and security:

```js
const { execFile } = require('child_process');
execFile('node', ['--version'], (err, stdout, stderr) => {
    console.log(stdout); // v20.5.1
});
```

---

## Q72: Difference Between `fork()` & `spawn()` in Node.js

Both `spawn()` and `fork()` are methods from the `child_process` module used to create new processes, but they serve different purposes and offer different capabilities.

---

### 🔧 TL;DR — Core Difference

| Feature         | spawn()                  | fork()                                 |
|-----------------|-------------------------|----------------------------------------|
| Purpose         | Launch any new process  | Launch a new Node.js script            |
| Communication   | Standard I/O (stdin, stdout, stderr) | Full IPC via send()/on('message') |
| Output          | Stream-based            | Stream + message-based                 |
| Use Case        | Run any command or executable | Create a child process to run another JS file |
| Extra channel (IPC) | ❌ Not available     | ✅ Built-in                            |

---

### 🔹 1. `spawn(command, args, options)`

Creates a child process to run any shell command or program.

```js
const { spawn } = require('child_process');

const ls = spawn('ls', ['-l']);

ls.stdout.on('data', (data) => {
    console.log(`Output: ${data}`);
});
```

**Use `spawn()` when:**
- You want to execute a binary/external command (e.g., git, ffmpeg)
- You need streamed I/O (stdout, stderr)
- You don’t need a communication channel (like `send()`)

---

### 🔹 2. `fork(modulePath, args, options)`

Special case of `spawn()` optimized for spawning Node.js child processes. Automatically sets up a communication channel.

**parent.js**
```js
const { fork } = require('child_process');
const child = fork('./child.js');

child.send({ task: 'start' });
child.on('message', (msg) => {
    console.log('Message from child:', msg);
});
```

**child.js**
```js
process.on('message', (msg) => {
    console.log('Child received:', msg);
    process.send({ result: 'done' });
});
```

**Use `fork()` when:**
- You are spawning another Node.js script
- You need two-way communication via messages
- You want to create a worker-like system for task delegation

---

### 🧪 Technical Internals

| Internals           | spawn()         | fork()                        |
|---------------------|-----------------|-------------------------------|
| Communication       | Only stdio      | stdio + process.send() (IPC)  |
| Use of execPath     | Not enforced    | Automatically uses Node’s process.execPath |
| Serialization Format| N/A             | JSON (for process.send())     |
| Memory space        | Separate process| Separate process              |

---

### 🔥 Real-World Example Use Cases

| Use Case                        | Method   |
|----------------------------------|----------|
| Run FFmpeg for media conversion  | spawn()  |
| Run Git commands from Node.js    | spawn()  |
| Offload CPU-heavy computation    | fork()   |
| Build a message-passing task system | fork()|
| Execute Bash/Python scripts      | spawn()  |
| Spawn child Node.js worker       | fork()   |



## Q75: What is Piping in Node.js?

**Piping** in Node.js is a mechanism that connects the output of one stream to the input of another, allowing efficient chaining of stream operations—much like piping commands in a Unix shell.

### 📦 Definition

Piping passes data from a readable stream directly into a writable stream, eliminating the need to manually handle `data`, `end`, or `error` events.

### ✅ Real-World Analogy

- **Faucet:** ReadableStream  
- **Pipe:** `.pipe()` method  
- **Sink:** WritableStream  

Node.js streams data between endpoints without buffering everything in memory.

### 💡 Example: Copying a File

```js
const fs = require('fs');

// Create a readable stream
const readStream = fs.createReadStream('source.txt');

// Create a writable stream
const writeStream = fs.createWriteStream('destination.txt');

// Pipe the read stream into the write stream
readStream.pipe(writeStream);
```

- Streams content from `source.txt` to `destination.txt`
- No need to manually listen to `'data'` or `'end'` events
- Efficient for large files—no full file is loaded in memory

### 🔁 Chaining Pipes (e.g., Compress a File)

```js
const fs = require('fs');
const zlib = require('zlib');

fs.createReadStream('input.txt')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('input.txt.gz'));
```

- Reads `input.txt`
- Compresses it using Gzip
- Writes the compressed output to `input.txt.gz`

### 🧱 Behind the Scenes

`.pipe()` is roughly equivalent to:

```js
readable.on('data', (chunk) => {
    writable.write(chunk);
});
readable.on('end', () => {
    writable.end();
});
```

It also handles:
- Backpressure automatically
- Error forwarding (if you handle `'error'`)

### ✅ Advantages of Using `.pipe()`

- Simple and declarative
- Handles backpressure automatically
- Memory efficient (especially for large files)
- Reduces boilerplate code
- Supports chaining (like Linux shell pipelines)

### ⚠️ Notes

- Always handle errors with `.on('error', ...)`
- For complex pipelines, consider using `stream.pipeline()` (Node.js v10+):

```js
const { pipeline } = require('stream');

pipeline(
    fs.createReadStream('input.txt'),
    zlib.createGzip(),
    fs.createWriteStream('input.txt.gz'),
    (err) => {
        if (err) console.error('Pipeline failed:', err);
        else console.log('Pipeline succeeded');
    }
);
```

---

## Q76: How to Gracefully Shutdown a Node.js Server?

Graceful shutdown means allowing existing connections to complete and releasing all resources (DB connections, file handles, workers, etc.) before exiting—crucial for production.

### ✅ Why is Graceful Shutdown Important?

- Prevents data loss
- Avoids corruption
- Ensures logs/metrics are flushed
- Closes DB connections, queues, child processes
- Enables zero-downtime deployments

### 🛠️ How to Implement Graceful Shutdown

#### 1. Start the Server

```js
const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Hello');
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

#### 2. Listen for Termination Signals

Common signals: `SIGINT` (Ctrl+C), `SIGTERM` (Docker stop, system kill)

```js
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
```

#### 3. Graceful Shutdown Logic

```js
function shutdown() {
    console.log('Received shutdown signal, closing server...');

    // Stop accepting new connections
    server.close((err) => {
        if (err) {
            console.error('Error during server close:', err);
            process.exit(1);
        }

        console.log('HTTP server closed.');

        // Close DB, queues, etc. here
        // Example:
        // await mongoose.disconnect();
        // redisClient.quit();

        process.exit(0); // Exit successfully
    });

    // Optional: Force shutdown after timeout
    setTimeout(() => {
        console.warn('Forcefully shutting down after 10s');
        process.exit(1);
    }, 10000);
}
```

#### 4. Handling Long-Running Requests

Track open connections:

```js
let connections = new Set();

server.on('connection', (conn) => {
    connections.add(conn);
    conn.on('close', () => connections.delete(conn));
});

function shutdown() {
    server.close(() => {
        console.log('Server closed.');

        for (const conn of connections) {
            conn.destroy(); // force-close if needed
        }

        process.exit(0);
    });
}
```

#### 5. Database and Queue Cleanup

```js
async function shutdown() {
    console.log('Shutting down...');
    server.close(() => {
        console.log('HTTP server closed.');
    });

    await db.close();         // MongoDB or PostgreSQL
    await redis.quit();       // Redis
    await queue.close();      // RabbitMQ or BullMQ

    process.exit(0);
}
```

### 🧪 Bonus: With Express

```js
const express = require('express');
const app = express();
const server = app.listen(3000);

// Graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
    server.close(() => {
        console.log('Express server closed');
        process.exit(0);
    });
}
```

### ✅ Tools That Trigger Graceful Shutdown

| Tool         | Sends Signal |
|--------------|-------------|
| Ctrl+C       | SIGINT      |
| kill command | SIGTERM     |
| Docker stop  | SIGTERM     |
| Kubernetes   | SIGTERM     |
| PM2 (restart)| SIGINT      |

---

## Q77: What are LTS Releases of Node.js and Why Should You Care?

### 🧾 Definition: What is LTS?

**LTS** stands for **Long-Term Support**.

- LTS releases are officially maintained versions that get critical bug fixes, security updates, and performance improvements for an extended period (typically 30 months).
- Ideal for production environments due to stability and reliability.

### 📅 Node.js Release Schedule

| Version Type      | What it Means                                 |
|-------------------|-----------------------------------------------|
| Current           | Actively developed, latest features           |
| LTS (Active)      | Recommended for production; bug/security fixes|
| LTS (Maintenance) | Only critical fixes (e.g., security patches)  |
| End-of-Life (EOL) | No updates or support                         |

- New LTS versions are released every October and enter Maintenance 12 months later.

#### 📆 Example Timeline

| Release | LTS Codename | LTS Start | Maintenance Start | End-of-Life (EOL) |
|---------|--------------|-----------|------------------|-------------------|
| 18.x    | Hydrogen     | Oct 2022  | Oct 2023         | Apr 2025          |
| 20.x    | Iron         | Oct 2023  | Oct 2024         | Apr 2026          |
| 22.x    | TBD          | Oct 2024  | Oct 2025         | Apr 2027          |

See [Node.js Releases](https://nodejs.org/en/about/releases) for official info.

### 🛠️ Why Should You Care?

| Reason             | Why It Matters                                 |
|--------------------|------------------------------------------------|
| ✅ Stability       | LTS avoids experimental/unstable APIs          |
| ✅ Security        | LTS versions get security patches              |
| ✅ Enterprise      | Trusted for production deployments             |
| ✅ Ecosystem       | Most npm packages prioritize LTS compatibility |
| ⚠️ Compliance     | LTS often required by audits                   |
| 🚀 Predictability  | Upgrade with confidence on a known timeline    |

### 🆚 LTS vs Current: At a Glance

| Feature            | LTS         | Current         |
|--------------------|-------------|-----------------|
| Stability          | ✅ High     | ❌ Experimental |
| Update Frequency   | 🔁 Slow     | 🔁 Frequent     |
| Production Usage   | ✅ Yes      | ⚠️ Not recommended |
| Top-Level await    | ✅ Supported| ✅ Available    |

### 📌 Best Practice

- **Always use an LTS version for production**, unless testing upcoming features or building developer tooling.

To install latest LTS:

```bash
nvm install --lts
```

To use it:

```bash
nvm use --lts
```

### 🧠 TL;DR

- **LTS = Safe, Stable, and Supported**
- Use it for all production-grade projects
- Avoid using Current unless you're testing new features or contributing to Node.js




## Q86: How does the Cluster module work? What's the difference between it and a load balancer?

### 1. How the Cluster Module Works in Node.js

Node.js is single-threaded by default, but modern machines have multiple CPU cores. The `cluster` module allows you to fork the same Node.js process across multiple cores, taking advantage of multi-core CPUs.

#### How It Works

- The cluster module spawns child processes (called **workers**) that share the same server port.
- A **master process** manages and distributes incoming requests to workers.
- Each worker is a separate process, with its own event loop and memory.

**Benefits:**

- True parallel processing in Node.js
- Improves throughput and performance on multi-core systems
- Resilient: if one worker crashes, others can continue to serve requests

#### Example

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart crashed worker
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

} else {
    // Worker processes
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Handled by worker ${process.pid}`);
    }).listen(3000);

    console.log(`Worker ${process.pid} started`);
}
```

---

### 2. Cluster vs Load Balancer

| Feature         | Cluster Module (Internal)           | Load Balancer (External, e.g., Nginx, HAProxy) |
|-----------------|-------------------------------------|------------------------------------------------|
| **Level**       | Application level (inside Node.js)  | Network/Transport level (outside Node.js)      |
| **Load Distribution** | Distributes HTTP requests to local child processes | Routes traffic to different Node.js servers    |
| **Scope**       | On one machine (single host, multiple cores) | Across multiple machines or containers         |
| **Fault Tolerance** | Recovers from worker crashes     | Can detect and reroute to healthy servers      |
| **Scalability** | Limited to CPU cores of a single machine | Horizontally scalable across many machines     |
| **Use Case**    | Improve CPU usage in single-node apps | Distribute traffic for multi-node architectures|
| **Example**     | `cluster.fork()`                    | nginx, AWS ELB, Kubernetes Service             |

#### When to Use What?

| Situation                                      | Use This                                   |
|------------------------------------------------|---------------------------------------------|
| Use all CPU cores                              | ✅ Cluster module                           |
| Deploying to multiple servers                  | ✅ External Load Balancer (e.g., Nginx, ELB)|
| Microservices or Docker-based system           | ✅ Load Balancer + PM2/cluster              |
| Zero downtime + graceful restarts              | ✅ PM2 with clustering                      |

#### Can You Use Both?

Absolutely.  
- Run a Node.js cluster inside a single container (via cluster or PM2)
- Use an external load balancer (like Nginx, HAProxy, or AWS ELB) to distribute traffic across multiple containers or VMs

This gives you both vertical and horizontal scalability.

**TL;DR:**  
- The cluster module helps you parallelize your app on one machine.  
- Load balancers help you scale out across multiple machines.  
- Use cluster for CPU utilization, and load balancers for distributing traffic globally.

---

## Q94: Why should you separate Express app and server?

Separating the Express app from the server in a Node.js project is considered a best practice—especially for building maintainable, testable, and scalable applications.

### TL;DR

| Aspect                  | Benefit                                                      |
|-------------------------|-------------------------------------------------------------|
| 🔍 Testability          | You can test the app without starting a server              |
| 🔁 Reusability          | Use the same app in different environments or setups         |
| 🧪 Separation of Concerns | Keeps app logic and infrastructure separate                |
| 🚀 Better Deployment    | Useful when combining with other services like AWS Lambda or PM2 |

### Recommended Folder Structure

```
project/
├── app.js        ← Express app only (routing, middleware)
├── server.js     ← Starts HTTP server using app
└── tests/
        └── app.test.js
```

#### `app.js` – Only Express Setup

```js
// app.js
const express = require('express');
const app = express();

app.use(express.json());
app.get('/', (req, res) => res.send('Hello World!'));

module.exports = app; // Don't start server here
```

#### `server.js` – Starts HTTP Server

```js
// server.js
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### Benefits Explained

#### 1. ✅ Testability

You can test the app without needing to bind to a port:

```js
// tests/app.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
    it('should return Hello World', async () => {
        const res = await request(app).get('/');
        expect(res.text).toBe('Hello World!');
    });
});
```

If you included the `.listen()` in the same file, you'd have to mock it or use an actual port—which is slower and flaky.

#### 2. 🔁 Reusability & Flexibility

You can plug the app into:
- an HTTP server
- HTTPS server
- a serverless function
- Socket.io integration

**Example for HTTPS:**

```js
const https = require('https');
const fs = require('fs');
const app = require('./app');

const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

https.createServer(options, app).listen(443);
```

---

## Q. What is monkey patching in JS?

Monkey patching in JavaScript is the practice of modifying, extending, or overriding existing code at runtime, especially functions or methods of built-in objects or modules—without altering the original source code.

### 🐒 Monkey Patching — Definition

It’s like a “hotfix”—you patch or change behavior by dynamically replacing methods on objects/functions after they’re loaded.

#### Example: Monkey Patching `console.log`

```js
// Original behavior
console.log("Hello");

// Monkey patching
const originalLog = console.log;

console.log = function(...args) {
    originalLog("Monkey Patched:", ...args);
};

console.log("Hello");  // Output: Monkey Patched: Hello
```

You’ve now intercepted all `console.log()` calls and added custom behavior.

### 🧠 Real-World Use Cases

| Use Case           | Example                                         |
|--------------------|-------------------------------------------------|
| 🔧 Logging/tracing | Patch `fs.readFile` to log every read operation |
| 🔍 Testing/mocking | Patch `Date.now()` or network calls for predictable tests |
| 🚨 Fixing bugs     | Patch a broken third-party function temporarily |
| 🚫 Feature blocking| Patch methods to disable or restrict features   |

### ❌ Why Monkey Patching is Dangerous

- **Global side effects** – Changing one part of the system affects everything else.
- **Maintenance nightmare** – Unexpected behavior for other developers.
- **Compatibility risks** – Updates to the original module may break your patch.
- **Hard to debug** – Breakpoints and stack traces become misleading.

### 🔒 Safer Alternatives

| Purpose         | Use Instead of Monkey Patching      |
|-----------------|-------------------------------------|
| Testing         | Dependency injection + mocks        |
| Logging         | Middleware / interceptors           |
| Extending classes | Subclassing or prototype wrapping |
| Modifying libs  | Forking or using plugin systems     |

#### Example: Monkey Patching `Array.prototype`

```js
// Dangerous monkey patch
Array.prototype.first = function() {
    return this[0];
};

const arr = [10, 20, 30];
console.log(arr.first()); // 10

// But now EVERY array globally has a `first()` method
```

This could conflict with future ECMAScript standards or other libraries.

### ✅ When Monkey Patching is Okay

- In tightly scoped, internal tools or test setups
- With clear control over the full runtime
- Temporarily, with full documentation and rollback plan

### 🧾 Summary

| Aspect      | Description                                 |
|-------------|---------------------------------------------|
| What        | Modify existing functions/objects at runtime|
| Why         | Add features, hotfixes, or override behavior|
| Risk        | Hard to maintain, debug, and test           |
| Safer Options | Dependency injection, mocks, subclasses   |



## Q99: How many threads does Node.js actually create?

While Node.js is often described as "single-threaded", under the hood, it actually creates multiple threads. Here’s a breakdown of the threads Node.js uses and their roles:

### 🧵 Thread Summary

| Component           | Thread(s) Used                       | Description                                               |
|---------------------|--------------------------------------|-----------------------------------------------------------|
| Main Thread         | 1 thread                             | Executes JavaScript (your app code) using the event loop  |
| libuv Thread Pool   | 4 threads by default (configurable)  | Handles async I/O (fs, crypto, DNS, etc.)                 |
| V8 Engine Threads   | ~2–4 internal threads                | Parser, compiler, garbage collector, etc.                 |
| Worker Threads      | User-defined (0 or more)             | If you use the `worker_threads` module                    |
| Cluster Workers     | User-defined (1 or more processes)   | If you use the `cluster` module                           |

---

### 1. **Main Thread**

- Runs your JavaScript code in the main event loop.
- Coordinates everything, delegates heavy I/O to background threads.

---

### 2. **libuv Thread Pool** (Default: 4 Threads)

- Used for non-blocking async tasks like:
    - `fs.readFile`, `fs.writeFile`
    - `crypto.pbkdf2`, `bcrypt`
    - `dns.lookup`
    - Compression (`zlib`)
    - Other C++-based native module tasks

```bash
# Increase thread pool size (max 128)
UV_THREADPOOL_SIZE=8 node app.js
```

---

### 3. **V8 Engine Threads**

- V8 uses multiple internal threads for:
    - Garbage collection
    - Code parsing/compilation
    - JIT optimization
- Number varies by platform and load.
- Not directly controlled by you.

---

### 4. **Worker Threads** (Optional)

- Use the `worker_threads` module to spawn threads:

```js
const { Worker } = require('worker_threads');
new Worker('./worker.js'); // creates a new thread
```

- Each worker runs on its own thread and event loop.

---

### 5. **Cluster Module** (Optional)

- `cluster.fork()` creates new **processes** (not threads).
- Each has its own memory, event loop, and thread pool.
- Used to utilize multi-core CPUs.

---

### 🔍 **Actual Thread Count (Typical Setup)**

| Type                | Count         |
|---------------------|--------------|
| Main thread         | 1            |
| libuv thread pool   | 4 (default)  |
| V8 internal threads | 2–4          |
| Workers (optional)  | As created   |
| Cluster (optional)  | As forked    |

> Even a basic Node.js app runs with 7–10 threads internally — it’s just abstracted from you.

---

### 👁️ **Visualization**

```
[Main Thread (Event Loop)]
        ├─ libuv Thread 1 (e.g., fs)
        ├─ libuv Thread 2 (e.g., crypto)
        ├─ libuv Thread 3
        ├─ libuv Thread 4
        ├─ V8 GC Thread
        ├─ V8 Compiler Thread
        └─ Optional Worker Thread(s) / Cluster Processes
```

---

### 🛠 **When to Increase libuv Threads?**

Increase the thread pool if you:
- Have many concurrent I/O-heavy operations
- Use `bcrypt`, `zlib`, `crypto`, or similar blocking APIs heavily

```bash
UV_THREADPOOL_SIZE=16 node server.js
```

---

### ✅ **Conclusion**

Node.js is single-threaded for JavaScript, but behind the scenes, it uses many threads:
- One for the JS event loop
- Four (default) in the libuv thread pool
- Several internal V8 engine threads
- Optional worker threads or clusters for scaling

This hybrid model provides the non-blocking power of Node.js while keeping the coding model simple.

---

## Q100: What is the Reactor Pattern in Node.js?

### 🔌 **Definition**

The Reactor Pattern is a design pattern for handling concurrent I/O using a single-threaded event loop. It allows an application to demultiplex I/O events (from sockets, files, etc.) and dispatch them to registered callback handlers — without blocking the main thread.

> Node.js heavily relies on the Reactor Pattern, implemented via the libuv library, to handle asynchronous I/O efficiently.

---

### 🧬 **Core Concepts**

- **Event Demultiplexer** — Listens for I/O events (e.g., epoll, kqueue, IOCP).
- **Event Queue** — Stores events to be processed.
- **Event Handlers** — Functions registered to handle specific events.
- **Event Loop** — Continuously checks for new events and dispatches them to handlers.

---

### 📦 **Node.js Implementation**

| Component      | Role                                                      |
|----------------|-----------------------------------------------------------|
| libuv          | Cross-platform async I/O library implementing Reactor     |
| Event Loop     | Runs inside the main thread, polling for I/O events       |
| Callback Reg.  | User-defined JS callbacks tied to events (e.g., fs.read)  |
| Thread Pool    | Offloads blocking I/O (optional, not part of the pattern) |

---

### ⏱️ **Example: I/O with Reactor Pattern**

```js
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log('File content:', data);
});
```

**Behind the scenes:**
1. `fs.readFile` registers an I/O request with libuv.
2. The event loop waits for OS notification (via epoll, IOCP, etc.).
3. When I/O completes, the callback is queued.
4. Event loop picks the callback from the event queue and executes it.

---

### 🧠 **Synchronous vs Reactor Pattern**

| Synchronous (Blocking)         | Reactor Pattern (Non-blocking)         |
|--------------------------------|----------------------------------------|
| Each I/O blocks the thread     | I/O is handled in the background       |
| Inefficient for high concurrency| Ideal for many concurrent connections |
| Simpler code                  | Uses callbacks/promises                |

---

### 💡 **Analogy**

- **Synchronous:** One chef handles one table at a time — slow and blocks others.
- **Reactor pattern:** Chef delegates orders to kitchen, continues taking orders — fast and scalable.

---

### 🏗️ **Visual Diagram**

```
┌────────────┐      ┌──────────────┐
│ JavaScript │◄─────┤ Event Queue │◄────────┐
└────┬───────┘      └──────┬───────┘         │
         │                    Callback          │
         ▼                                     ▼
[ Register I/O ]                 [ libuv (Event Demux) ]
         │                                     │
         ▼                                     ▼
[ System I/O Call ]◄───OS───►[ I/O Ready Notification ]
```

---

### ✅ **Benefits**

- 🚀 Scalable: Handles thousands of concurrent requests efficiently.
- 🔄 Non-blocking: No thread is blocked waiting for I/O.
- 📦 Lightweight: No thread-per-request model required.
- 🔁 Simple concurrency model: One thread, event-driven code.

---

### 🛑 **Limitations**

- Complex error handling with nested callbacks (solved via Promises/async).
- Not suited for CPU-intensive tasks (handled using `worker_threads`).

---

## Q101: What is the difference between `process.nextTick()` and `setImmediate()`?

Both `process.nextTick()` and `setImmediate()` schedule callbacks to be executed asynchronously, but they differ in timing and phase of execution within the event loop.

---

### 🧠 **Quick Difference**

| Feature             | `process.nextTick()`                | `setImmediate()`                      |
|---------------------|-------------------------------------|---------------------------------------|
| Execution Phase     | Before the next event loop tick     | During the check phase of the event loop |
| Priority            | Very high – runs before I/O events  | Lower – runs after I/O callbacks      |
| Use Case            | Schedule microtasks or continuation | Defer execution until current I/O completes |

---

### 🎢 **Event Loop Phases**

Node.js Event Loop Phases:
1. Timers (`setTimeout`, `setInterval`)
2. Pending Callbacks
3. Idle, Prepare
4. Poll (I/O events)
5. **Check** ⬅️ `setImmediate()` callbacks run here
6. Close callbacks

After every phase and between phases, Node.js runs all `process.nextTick()` callbacks first.

---

### 📦 **Examples**

#### `process.nextTick()` example:

```js
console.log("Start");

process.nextTick(() => {
    console.log("This runs in process.nextTick");
});

console.log("End");
```

**Output:**
```
Start
End
This runs in process.nextTick
```
*Why?* Because `nextTick()` runs before the event loop continues.

---

#### `setImmediate()` example:

```js
console.log("Start");

setImmediate(() => {
    console.log("This runs in setImmediate");
});

console.log("End");
```

**Output (in most cases):**
```
Start
End
This runs in setImmediate
```
*It runs after I/O and timers, during the check phase.*

---

#### Combining Both

```js
setImmediate(() => {
    console.log('setImmediate');
});

process.nextTick(() => {
    console.log('nextTick');
});
```

**Output:**
```
nextTick
setImmediate
```
*Because `nextTick` is a microtask, and microtasks run before the event loop proceeds.*

---

### 🛠️ **Use Cases**

| Use This...           | When You Want To...                                           |
|-----------------------|--------------------------------------------------------------|
| `process.nextTick()`  | Run before any I/O or timer callbacks, or to prevent stack unwinding |
| `setImmediate()`      | Run after I/O callbacks but as soon as possible              |

---

### ⚠️ **Warning About `process.nextTick()`**

It can starve the event loop if used excessively:

```js
function tick() {
    process.nextTick(tick);
}
tick(); // Event loop is never freed — starvation!
```
*Avoid long chains of `nextTick()` unless necessary.*



## Q103: Explain some Error Handling approaches in Node.js you know about. Which one will you use?

Error handling is critical in Node.js due to its asynchronous, event-driven nature. Poor error handling can lead to crashes, memory leaks, or unresolved promises. Below are robust error-handling strategies every Node.js lead developer should know.

### 1. Try-Catch (for synchronous code and async/await)
- **Use case:** Synchronous code or inside async functions.

```js
try {
    let result = JSON.parse('invalid JSON');
} catch (err) {
    console.error("Error occurred:", err.message);
}
```

For async functions:
```js
async function fetchData() {
    try {
        const data = await getRemoteData();
    } catch (err) {
        console.error("Async Error:", err.message);
    }
}
```
**When to use:** Most reliable with async/await or synchronous logic.

---

### 2. Error-First Callbacks (Node-style callbacks)
- **Convention:** `function(err, result) {}`

```js
fs.readFile('file.txt', (err, data) => {
    if (err) {
        return console.error("File read error:", err);
    }
    console.log("File content:", data.toString());
});
```
**When to use:** Traditional Node-style modules and APIs.

---

### 3. Using Promises with `.catch()`
- **Avoid unhandled promise rejections.**

```js
getData()
    .then(data => console.log(data))
    .catch(err => console.error("Promise error:", err));
```
**When to use:** In promise chains (especially outside async/await context).

---

### 4. Global Handlers
- **Catch unhandled exceptions or rejected promises at the process level.**

```js
process.on('uncaughtException', err => {
    console.error("Uncaught Exception:", err);
    process.exit(1); // recommended: graceful shutdown
});

process.on('unhandledRejection', reason => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});
```
> ⚠️ Use as last resort – always prefer local error handling.

---

### 5. Middleware Error Handling in Express

```js
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});
```
**When to use:** All Express.js apps should have a centralized error middleware.

---

### 6. Domain Module (Deprecated)
- The domain module was used to trap errors across async contexts.

```js
const domain = require('domain');
const d = domain.create();

d.on('error', (err) => {
    console.error('Domain caught:', err);
});

d.run(() => {
    throw new Error('Oops');
});
```
> ❌ Deprecated – should not be used in modern code.

---

### 7. EventEmitter Error Handling
- Custom event emitters should emit `'error'` events and handle them properly.

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('error', (err) => {
    console.error("Event error:", err.message);
});

emitter.emit('error', new Error("Something went wrong"));
```
> ⚠️ If no `'error'` handler exists → Node.js will crash!

---

### 8. Graceful Shutdown
- Handle errors and clean up (close DB, files, etc.)

```js
process.on('SIGINT', async () => {
    try {
        await db.close();
        server.close(() => {
            console.log("Server closed gracefully");
            process.exit(0);
        });
    } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
    }
});
```

---

#### Which Approach Do I Prefer as a Lead Node.js Developer?

| Context                | Preferred Strategy                        |
|------------------------|-------------------------------------------|
| Sync + async/await     | try/catch                                 |
| Legacy APIs            | Error-first callbacks                     |
| Promises               | .catch() or try/catch                     |
| Express.js             | Central error middleware                  |
| Global safety net      | process.on('uncaughtException'), graceful shutdown |
| Custom Events          | Always handle 'error' events              |

---

#### Best Practices

- Always fail fast and log meaningful errors.
- Never swallow errors silently.
- Always handle `'error'` events from streams, emitters, etc.
- Don’t overuse global handlers – local handling is better.
- Use logging tools like Winston, Pino, or Sentry in production.

---

## Q105: How V8 compiles JavaScript code?

### 🚀 TL;DR

The V8 engine compiles JavaScript using a mix of interpreting and just-in-time (JIT) compilation through several steps:

- Parsing
- Bytecode Generation (Ignition)
- Profiling & Optimization (TurboFan)
- Deoptimization if needed

---

### 🧠 Step-by-Step Breakdown

1. **Parsing**
     - V8 parses your JavaScript code into an Abstract Syntax Tree (AST).
     - Uses a parser and scanner to tokenize the source code and identify syntax structure.
     - Example:  
         For code like `let x = 2 + 3;`, V8 breaks it down into nodes like:  
         `VariableDeclaration -> BinaryExpression -> Literal`

2. **Bytecode Generation (Ignition Interpreter)**
     - After parsing, the Ignition interpreter converts the AST into bytecode (a lightweight intermediate format).
     - This bytecode is fast to interpret and uses less memory than compiled machine code.
     - Ignition is great for startup performance and memory efficiency.

3. **Profiling for Hot Code**
     - While running the bytecode, V8 profiles execution to detect frequently-used functions or “hot paths.”
     - Hot code is then passed to TurboFan, V8’s optimizing compiler.

4. **Optimizing Compilation (TurboFan)**
     - TurboFan compiles hot bytecode into highly optimized machine code.
     - It performs several optimizations:
         - Inlining: Embeds function calls directly.
         - Type specialization: Assumes variable types (e.g., number vs object).
         - Loop unrolling, constant folding, dead code elimination.
     - This dramatically improves performance.

5. **Deoptimization (if assumptions break)**
     - If runtime behavior changes (e.g., a variable type changes from number to string), V8 deoptimizes.
     - It throws away the optimized code and reverts to interpreted bytecode.
     - This protects correctness at the cost of performance.

---

### 🔄 Compilation Pipeline Summary

```
JavaScript Source Code
             ↓
     Parsing → AST
             ↓
     Ignition → Bytecode
             ↓
Hot Function? → Yes → TurboFan → Optimized Machine Code
             ↓
    Runtime → Maybe Deoptimize if Assumptions Break
```

---

### 📦 Real-World Implications for You as a Developer

| Action                        | Impact                                             |
|-------------------------------|---------------------------------------------------|
| Avoid changing object shapes   | Keeps hidden classes stable for faster optimization|
| Reuse functions and closures   | Increases chance of JIT optimization              |
| Use consistent types          | Helps TurboFan specialize and optimize code        |
| Avoid polymorphic code        | Better for inline caching and performance          |

---

## Q106: How would you implement process communication when using cluster module in Node.js

Inter-process communication (IPC) is essential when using the cluster module in Node.js to coordinate between the master (primary) and worker processes. Node.js enables built-in messaging over IPC channels between the master and each worker process.

### ✅ What You’ll Learn

- How to implement communication between master and worker processes
- Examples using `worker.send()` and `process.on('message')`
- How to broadcast or direct messages
- Best practices and advanced scenarios

---

### ⚙️ Basic Setup with Cluster

```js
// cluster-comm.js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;

    console.log(`Master PID: ${process.pid}`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();

        // Send message to worker
        worker.send({ type: 'init', payload: `Hello Worker ${worker.id}` });

        // Listen to messages from worker
        worker.on('message', (msg) => {
            console.log(`Master received from Worker ${worker.id}:`, msg);
        });
    }

} else {
    console.log(`Worker ${process.pid} started`);

    // Receive messages from master
    process.on('message', (msg) => {
        if (msg.type === 'init') {
            console.log(`Worker received: ${msg.payload}`);

            // Reply back to master
            process.send({ type: 'ack', payload: `Hello Master from Worker ${process.pid}` });
        }
    });

    // Dummy server
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Handled by Worker ${process.pid}`);
    }).listen(3000);
}
```

---

### 📡 How Communication Works

- `worker.send(obj)` → sends message to child
- `process.send(obj)` → sends message to parent
- `worker.on('message')` and `process.on('message')` → listen for messages

These methods internally use Node.js IPC over sockets when the worker is forked via cluster.

---

### 📥 Message Format (Custom Convention)

To organize communication well, use structured messages:

```js
{
    type: 'init' | 'ack' | 'error' | 'log',
    payload: {} | string | number
}
```
You can use this convention to simulate RPC or command pattern.

---

### 🧠 Advanced: Broadcasting Message to All Workers

```js
function broadcastToWorkers(message) {
    for (const id in cluster.workers) {
        cluster.workers[id].send(message);
    }
}
```

---

### 🔁 Sending Message from Worker to Another Worker (via Master)

Workers can't talk to each other directly — use the master as a message broker:

```js
// In Worker
process.send({ type: 'forward', targetId: 3, payload: 'Message to Worker 3' });

// In Master
worker.on('message', (msg) => {
    if (msg.type === 'forward') {
        const target = cluster.workers[msg.targetId];
        if (target) {
            target.send({ from: worker.id, payload: msg.payload });
        }
    }
});
```

---

### 🛡️ Best Practices

| Practice                   | Why It Matters                        |
|----------------------------|---------------------------------------|
| Use message type field     | Helps organize command handling       |
| Avoid circular JSON        | IPC can't send cyclic data            |
| Handle IPC errors gracefully| Prevent crashes                      |
| Don't overuse process.send | High-frequency messaging can slow things down |
| Centralize message routing | Easier to debug and extend            |

---

### 📚 Real-World Use Cases

- Master aggregates logs from workers
- Workers request shared state from master
- Master restarts/replaces workers based on health
- Implementing in-memory coordination across workers



# Q107: What is the difference between `cluster.fork()` vs `child_process.fork()` in Node.js?

Understanding the difference between `cluster.fork()` and `child_process.fork()` is critical when designing scalable, multi-process Node.js applications. Although both create child processes, they serve different purposes and offer distinct features.

## 🔍 High-Level Summary

| Feature                  | `cluster.fork()`                                  | `child_process.fork()`                          |
|--------------------------|---------------------------------------------------|-------------------------------------------------|
| **Purpose**              | Scale Node.js server instances across CPU cores   | Run any Node.js module as a separate process    |
| **Module Used**          | `cluster`                                         | `child_process`                                 |
| **IPC Channel**          | Automatically set up                              | Automatically set up                            |
| **Worker Management**    | Built-in (`cluster.workers`)                      | Manual                                          |
| **Shared Server Ports**  | Yes (via master-worker model)                     | No (independent processes)                      |
| **Built-in Load Balancing** | Yes                                         | No                                              |
| **Signals/Lifecycle**    | Built-in                                          | Manual                                          |
| **Use Case**             | Horizontal scaling of HTTP servers                | Isolated processes or CPU-bound tasks           |

---

## 🧪 Use Case Examples

### 🔧 `cluster.fork()` – For Scaling Servers

Used when you want to spawn multiple workers (Node.js processes) to handle load on a single server port.

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    // Each worker shares the same server port
    http.createServer((req, res) => {
        res.end(`Handled by worker ${process.pid}`);
    }).listen(3000);

    console.log(`Worker ${process.pid} started`);
}
```

**✅ Benefits:**
- Load balancing handled by Node.js internally
- All workers listen on the same port
- Monitored and restarted by master if they crash

---

### 🛠️ `child_process.fork()` – For General Process Management

Used when you want to run a separate Node.js script/module as a subprocess for tasks like:
- CPU-intensive jobs
- Running background workers
- Isolated execution

**parent.js**
```js
const { fork } = require('child_process');
const child = fork('./child.js');

child.send({ task: 'heavy' });
child.on('message', (msg) => {
    console.log('Parent received:', msg);
});
```

**child.js**
```js
process.on('message', (msg) => {
    if (msg.task === 'heavy') {
        let result = 0;
        for (let i = 0; i < 1e9; i++) result += i;
        process.send({ result });
    }
});
```

**✅ Benefits:**
- Run completely independent code modules
- Useful for offloading heavy tasks without blocking the main event loop

---

## 📌 Key Technical Differences

| Concept           | `cluster.fork()`                          | `child_process.fork()`                |
|-------------------|-------------------------------------------|---------------------------------------|
| Module Context    | Workers share same module entry point      | Can run a different script            |
| Port Sharing      | Yes (via master)                          | No — must bind to different ports     |
| Cluster Awareness | Managed by cluster module                  | No knowledge of clustering            |
| Lifecycle Events  | Emits events like `online`, `exit`, `disconnect` | Manual event handling (`message`, `exit`, etc.) |

---

## 🧠 Which One Should I Use?

| Situation                                 | Use                    |
|--------------------------------------------|------------------------|
| Scale a Node.js web server                 | `cluster.fork()`       |
| Run CPU-bound jobs or worker scripts       | `child_process.fork()` |
| Need to share server sockets               | `cluster.fork()`       |
| Need complete isolation and different code | `child_process.fork()` |

---

# Q108: How would you scale a Node application?

## How to Scale a Node.js Application

### 1️⃣ Vertical Scaling (Scaling Up)
- **What:** Increase resources (CPU, RAM) on a single machine.
- **How:** Upgrade server hardware or cloud instance specs.
- **Pros:** Easy to implement, no code changes needed.
- **Cons:** Limited by hardware max capacity, single point of failure.

---

### 2️⃣ Horizontal Scaling (Scaling Out)

#### a. Using the Cluster Module

Node.js runs on a single thread, so to utilize multiple CPU cores, you spawn worker processes using the built-in cluster module.

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster) {
    const cpus = os.cpus().length;

    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    http.createServer((req, res) => {
        res.end(`Handled by worker ${process.pid}`);
    }).listen(3000);
}
```

#### b. Load Balancers & Multiple Machines

- Run multiple instances of your app on different machines/containers.
- Use a load balancer (like Nginx, HAProxy, or cloud solutions like AWS ELB) to distribute requests.
- Scale horizontally by adding/removing instances.

---

### 3️⃣ Statelessness & Shared State

- Ensure your Node.js app is stateless — no in-memory session or cache tied to a single instance.
- Use external stores like:
    - Redis for session storage and caching
    - Databases (SQL/NoSQL) for persistent data

---

### 4️⃣ Offloading Work with Worker Threads or Child Processes

- For CPU-intensive tasks (image processing, heavy computations), offload from the main event loop.
- Use:
    - `worker_threads` module (lightweight threads)
    - `child_process` or `cluster` (full Node processes)

---

### 5️⃣ Caching & CDN

- Cache frequently accessed data in-memory or distributed cache (e.g., Redis, Memcached).
- Use a CDN (Content Delivery Network) to offload static content delivery.

---

### 6️⃣ Microservices Architecture

- Split monolithic apps into smaller, independently deployable services.
- Each microservice handles a specific domain or functionality.

---

### 7️⃣ Containerization & Orchestration

- Use Docker containers to package your Node.js app.
- Deploy multiple containers on cloud or on-premise.
- Use orchestration tools like Kubernetes, Docker Swarm, or AWS ECS.

---

### 8️⃣ Monitoring and Auto-scaling

- Implement monitoring (e.g., Prometheus, Datadog, New Relic).
- Set up auto-scaling policies to automatically add/remove instances based on load.

---

### 9️⃣ Database Scaling

- Use read replicas for read-heavy workloads.
- Use sharding or partitioning for very large datasets.
- Optimize queries and indexing.

---

# Q109: Does the cluster in Node.js utilize the same event loop?

No, the cluster in Node.js does **not** utilize the same event loop across workers. Each worker process created by the cluster module runs in its own separate instance of the Node.js runtime, which means:

- Each worker has its own independent event loop.
- They do not share the same event loop or memory space.
- Communication between the master and workers is done via Inter-Process Communication (IPC), usually with message passing.

This isolation helps utilize multiple CPU cores fully and improves fault tolerance since if one worker crashes, others are unaffected.

**Summary:**

| Concept          | Explanation                       |
|------------------|-----------------------------------|
| Cluster workers  | Separate Node.js processes        |
| Event loop       | Each worker has its own event loop|
| Memory           | No shared memory between workers  |
| Communication    | IPC with message passing          |

**Example:**
```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster) {
    const cpus = os.cpus().length;
    for (let i = 0; i < cpus; i++) {
        cluster.fork(); // creates a new process with its own event loop
    }
} else {
    // This code runs in each worker process with its own event loop
    http.createServer((req, res) => {
        res.end(`Handled by worker process ${process.pid}`);
    }).listen(3000);
}
```

**Why separate event loops?**
- Node.js is single-threaded per process.
- To scale across cores, multiple processes with independent event loops run concurrently.
- Enables true parallelism in multi-core systems.

---

# Q111: Does JavaScript pass by reference or pass by value?

JavaScript uses both pass-by-value and pass-by-reference depending on the data type.

## How JavaScript Passes Variables to Functions

### 1. Primitive Types — Passed by Value

Primitive types include:
- `number`
- `string`
- `boolean`
- `null`
- `undefined`
- `symbol`
- `bigint`

When you pass a primitive to a function, JavaScript copies the actual value. Changes inside the function do not affect the original variable.

```js
let a = 10;

function modify(x) {
    x = 20;
    console.log('Inside function:', x); // 20
}

modify(a);
console.log('Outside function:', a);  // 10 (unchanged)
```

---

### 2. Objects (including arrays and functions) — Passed by Reference to the Object

For objects, arrays, and functions, the variable holds a reference to the actual object in memory.

When passed to a function, JavaScript copies the reference (the address), not the actual object. This means:
- You can modify the properties or elements of the object inside the function, and the changes will be visible outside.
- But if you reassign the parameter itself to a new object, it won’t affect the original reference.

```js
let obj = { name: 'Alice' };

function modify(o) {
    o.name = 'Bob';       // modifies the property on the original object
    o = { name: 'Charlie' }; // reassigns local reference, does NOT affect original
    console.log('Inside:', o);
}

modify(obj);
console.log('Outside:', obj);
```

**Output:**
```
Inside: { name: 'Charlie' }
Outside: { name: 'Bob' }
```

---

# Q1: Rewrite promise-based Node.js applications to async/await

**Original Promise-based code:**
```js
const fs = require('fs').promises;

function readFilePromise(filePath) {
    return fs.readFile(filePath, 'utf8')
        .then(data => {
            console.log('File data:', data);
            return data;
        })
        .catch(err => {
            console.error('Error reading file:', err);
            throw err;
        });
}

readFilePromise('./example.txt')
    .then(() => console.log('Done'))
    .catch(() => console.log('Failed'));
```

**Rewritten with async/await:**
```js
const fs = require('fs').promises;

async function readFileAsync(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        console.log('File data:', data);
        return data;
    } catch (err) {
        console.error('Error reading file:', err);
        throw err;
    }
}

(async () => {
    try {
        await readFileAsync('./example.txt');
        console.log('Done');
    } catch {
        console.log('Failed');
    }
})();
```

---

# Q2: How would you read files in parallel in Node.js? Provide a code example

```js
function wait(ms, label) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Task ${label} done after ${ms} ms`);
            resolve(label);
        }, ms);
    });
}

async function runInParallel() {
    const tasks = [
        wait(1000, 'A'), // finishes after 1 second
        wait(2000, 'B'), // finishes after 2 seconds
        wait(1500, 'C'), // finishes after 1.5 seconds
    ];

    const results = await Promise.all(tasks);
    console.log('All tasks completed:', results);
}

runInParallel();
```

---

# Q3: Explain what is wrong with async/await use in the forEach loop

The common mistake with async/await inside a `forEach` loop is that `forEach` does **not** wait for async functions to complete, so the asynchronous calls inside it run but you don’t get to await their completion properly. This often leads to unexpected behavior where all async operations are started but the containing function finishes before those operations are done.

**What’s wrong with this?**
```js
const arr = [1, 2, 3];

arr.forEach(async (num) => {
    await someAsyncFunction(num);
    console.log(`Processed ${num}`);
});

console.log('Done');
```
- The async callback runs for each element.
- But `arr.forEach` does not wait for these async callbacks.
- So `'Done'` prints immediately before all `someAsyncFunction` calls finish.

**Why?**
- `forEach` does not support async/await.
- It ignores the returned promises from the async callbacks.
- So you cannot await the whole loop’s completion.

---

## Correct ways to handle async iteration:

### 1. Use a regular `for` loop or `for...of` with `await`
```js
for (const num of arr) {
    await someAsyncFunction(num);
    console.log(`Processed ${num}`);
}

console.log('Done');
```
This runs sequentially — waits for each async call before next iteration.

---

### 2. Run in parallel with `Promise.all` and `map`
```js
await Promise.all(
    arr.map(async (num) => {
        await someAsyncFunction(num);
        console.log(`Processed ${num}`);
    })
);

console.log('Done');
```
This runs all async calls in parallel and waits for all to complete.

---

# Q4: How would you read files in sequence in Node.js? Provide a code example

**Reading Files Sequentially Example:**
```js
const fs = require('fs').promises;

async function readFilesInSequence(filePaths) {
    const results = [];

    for (const path of filePaths) {
        try {
            const content = await fs.readFile(path, 'utf8');
            console.log(`Read file: ${path}`);
            results.push(content);
        } catch (err) {
            console.error(`Error reading file ${path}:`, err);
            // You can decide to break or continue based on error handling strategy
            throw err; // or continue;
        }
    }

    return results;
}

(async () => {
    const files = ['./file1.txt', './file2.txt', './file3.txt'];
    const contents = await readFilesInSequence(files);

    contents.forEach((content, i) => {
        console.log(`Content of ${files[i]}:`);
        console.log(content);
    });
})();
```



## Q. What is a Webhook?

A **webhook** is a way for one system to notify another system when an event happens, via an HTTP callback.

> 🧠 **Think of it like:**  
> “Hey, payment is done — here’s the data — go do your stuff.”

Instead of polling every few seconds asking “Is the payment done?”, the payment provider (e.g., Razorpay, Stripe) sends an HTTP POST request to your server automatically when the event occurs (like payment success, failure, refund, etc.).

### 🧾 Example: Razorpay Webhook

```http
POST /api/webhook/payment
Content-Type: application/json

{
    "event": "payment.captured",
    "payload": {
        "payment": {
            "email": "user@example.com",
            "amount": 10000
        }
    }
}
```

Your server would verify this request, and then trigger any follow-up actions (e.g., send receipt, notify user, update DB).

---

### ✅ When to use Webhooks

- Payment confirmation from third-party services (Stripe, Razorpay, UPI)
- Event-driven actions like SMS/email notifications
- Asynchronous state updates between microservices

---

## Q. Closures & Memory Leaks in Node.js

### 🔍 What is a Closure?

A **closure** occurs when an inner function retains access to variables from its outer function even after the outer function has finished executing.

### ❌ How Closures Cause Memory Leaks

When long-lived objects (like event listeners, timers, or global variables) retain references to closed-over variables, those variables cannot be garbage collected, even if you don’t need them anymore.

#### 🧠 Real-World Node.js Twist

In long-running Node.js apps, especially in backend services:

- Unremoved listeners (`.on()` without `.off()` or `.removeListener()`)
- Unclosed intervals/timers
- Caches holding closures
- Misused singletons

can all cause retained memory, leading to performance degradation over time (increased heap, GC pauses).

---

## Q. Handling Large File Uploads Securely (e.g., KYC Docs)

### ✅ Strategy Overview

| Concern      | Solution                                             |
| ------------ | --------------------------------------------------- |
| Large size   | Stream upload instead of loading into memory         |
| Security     | Validate MIME type, file size, scan for viruses     |
| Storage      | Upload directly to S3, GCS, or local disk using stream |
| Limits       | Set size & type limits using middleware config      |

### 🛠 Recommended Stack

- **Multer** – for `multipart/form-data`
- **Multer-S3** (if AWS)
- **Busboy** or **streamifier** for streams
- **ClamAV** – optional file virus scan

---

### ✅ Example: Multer with Limits (Memory Upload)

```js
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        if (!['image/png', 'application/pdf'].includes(file.mimetype)) {
            return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
    },
});
```

#### ✅ Route Example

```js
app.post('/upload', authenticate, upload.single('kycDoc'), async (req, res) => {
    // Upload to S3 or save to DB/file system
    const buffer = req.file.buffer;
    // validate, scan, and store
    res.json({ message: 'Upload successful' });
});
```

> 🔐 **Always sanitize file names, limit upload paths, and avoid storing untrusted files publicly accessible.**


# To prevent uncaught exceptions at the application level in Node.js, use a combination of global error handling, best practices, and safe async code structure.

## 1. Catch Uncaught Exceptions Globally

> **Not recommended for recovery, but good for logging**

```js
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Optional: cleanup, alerting
    process.exit(1); // safest to shut down
});
```

**Note:** Don’t try to recover from uncaught exceptions — they leave your app in an inconsistent state.

---

## 2. Handle Unhandled Promise Rejections

```js
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    // Optional: cleanup, alerting
    process.exit(1); // restart via PM2, Docker, etc.
});
```

