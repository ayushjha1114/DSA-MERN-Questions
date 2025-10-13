
# 📝 Detailed Notes – Node.js Event Loop Flow for GET /api Example

## 1. Process Flow (GET /api Example)

### 1️⃣ Incoming HTTP Request
- A client sends a **GET /api** request to your Node.js server (e.g., Express or native HTTP module).
- Node.js `http` module (built on libuv + C++) receives the TCP packet.
- A callback (your route handler) is registered to be executed when the request is parsed.

### 2️⃣ Event Loop Places Callback in Poll Phase
- The event loop is running in cycles (phases).
- The HTTP server has an I/O event (data arrived).
- The callback for the request (your Express handler) is placed in the **Poll Queue (I/O queue)**.

### 3️⃣ Your Handler Executes (JavaScript Code)
```js
app.get('/api', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    res.send(data);
  });
});
```
- At this point your callback runs, sees the `fs.readFile`.
- The `fs.readFile` is offloaded to libuv’s thread pool (non-blocking I/O).

### 4️⃣ File System Work Happens in Background
- The event loop keeps running other callbacks meanwhile.
- When `fs.readFile` finishes reading from disk, libuv pushes the completion callback into the **I/O Callback Queue (next poll phase)**.

### 5️⃣ Event Loop Picks Up Completed I/O Callback
- The event loop moves to the **Poll Phase** again.
- It finds the callback from `fs.readFile` in the I/O queue.
- Executes the callback:
```js
res.send(data);
```
- `res.send()` writes the HTTP response back to the socket asynchronously.

### 6️⃣ Microtasks Between Phases
- Before moving to the next phase, Node drains:
  - `process.nextTick()` callbacks.
  - Promises `.then()` callbacks.
- This ensures microtasks complete before the next macro phase.

### 7️⃣ Sending Response to Client
- `res.send()` writes the HTTP response back to the socket.
- The underlying libuv layer sends it asynchronously.

### 8️⃣ Event Loop Continues
- Once the response is sent, the event loop is free to handle the next events.
- The cycle continues for other requests.

---

## 2. Summary of Flow in Order
- **HTTP Request Arrives** → Node.js HTTP parser.
- **Callback Queued in Poll Phase** → your handler executes.
- **Async Operation Starts** (like DB or file read) → sent to libuv thread pool.
- **Thread Pool Completes Work** → pushes callback to I/O Callback Queue.
- **Event Loop Poll Phase Runs Callback** → sends data to client.
- **Microtask Queues Drained** (`nextTick`, promises).
- **Response Sent Back** → Node.js writes to socket.
- **Loop Ready for Next Event**.

### Key Queues Involved in This Example:
- **Poll Queue (I/O events)** — GET request & file read callback.
- **Microtask Queue** — any Promises or `process.nextTick` inside your callbacks.
- **Timers Queue** — if you had `setTimeout` scheduled inside.
- **Check Queue** — if you used `setImmediate`.
- **Close Callbacks Queue** — if you closed a connection/stream.

✅ **In short:**  
A GET request → goes to the Poll Queue → your callback executes → any async work offloaded to libuv → completion callback returned to I/O queue → event loop picks it up and sends response → microtasks run → done.

---

## 3. Event Loop Phases Recap

Order of phases each tick:
1. **Timers Phase**
2. **Pending / I/O Callbacks Phase**
3. **Idle / Prepare (internal)**
4. **Poll Phase**
5. **Check Phase**
6. **Close Callbacks Phase**
🔁 **(Microtasks run after each phase)**

---

## 4. Full Flow with a GET /api Example — Phase by Phase

### 📍 Setup
```js
app.get('/api', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    res.send(data);
  });
});
```

### 1️⃣ Request Arrives — Poll Phase
- Client sends **GET /api**.
- Node’s HTTP parser receives data on the socket.
- When fully parsed, Node queues your route handler callback into the **Poll Phase (I/O queue)**.

**Phase:** Poll Phase  
**Queue:** I/O Queue  
**Action:** Your handler function begins executing.

### 2️⃣ Your Handler Executes — Async Call Starts
- Inside handler you call `fs.readFile`.
- `fs.readFile` offloads file reading to libuv thread pool (non-blocking).
- Your handler returns immediately (doesn’t block).

**Phase:** Still Poll Phase  
**Queue:** Thread pool starts work (outside event loop).  
**Action:** Event loop free to process other events.

### 3️⃣ Thread Pool Completes File Read — Pending I/O
- When `fs.readFile` finishes reading, libuv places the callback into the **Pending / I/O Callbacks Phase (or next Poll phase depending on timing)**.

**Phase:** Pending / I/O Callbacks Phase (next tick)  
**Queue:** I/O Callback Queue  
**Action:** Callback with file data is ready to run.

### 4️⃣ Event Loop Processes I/O Callback
- In the next loop iteration, the event loop enters the **Poll Phase**.
- It finds the file read callback in the **I/O Queue**.
- Executes your callback:
```js
res.send(data);
```
- `res.send()` schedules the network write to the socket.

**Phase:** Poll Phase  
**Queue:** I/O Queue  
**Action:** Sending data to the client.

### 5️⃣ Microtasks After Each Phase
- After the I/O callback completes but before moving to the next macro phase:
  - `process.nextTick()` callbacks are drained.
  - Promises `.then()` callbacks run.

**Phase:** Microtask handling (not a phase but always between phases).  
**Queues:** `process.nextTick()` queue, Promise microtask queue.

### 6️⃣ Timers Phase (if any timers)
- If you had scheduled a `setTimeout` inside your handler, after its delay it would run in this phase.

**Phase:** Timers Phase  
**Queue:** Timers Queue  
**Action:** Executes any timer callbacks whose delay expired.

### 7️⃣ Check Phase (if any setImmediate)
- If you used `setImmediate(() => { ... })`, those callbacks run here.

**Phase:** Check Phase  
**Queue:** Check Queue  
**Action:** Executes `setImmediate` callbacks.

### 8️⃣ Close Callbacks Phase (if any sockets closed)
- If a connection or stream emits `'close'`, those callbacks run here.

**Phase:** Close Callbacks Phase  
**Queue:** Close Callbacks Queue  
**Action:** Cleans up resources.

### 9️⃣ Loop Continues
- After these steps, the event loop continues to the next tick to handle new events and callbacks.

---

## 5. Phase by Phase Timeline Table

| Phase (in order)         | What happens in our GET example                                      |
|--------------------------|---------------------------------------------------------------------|
| **Poll (incoming req)**  | GET request parsed, handler queued, runs handler, starts `fs.readFile` |
| **Pending / I/O**        | File read completes, callback queued                                 |
| **Poll**                 | Event loop executes file read callback → `res.send(data)`            |
| **Microtasks**           | `process.nextTick` / Promise `.then` run                             |
| **Timers** (if any)      | Executes any due `setTimeout`                                        |
| **Check** (if any)       | Executes `setImmediate` callbacks                                    |
| **Close callbacks** (if any) | Executes `'close'` callbacks                                         |

---

## 6. Key Takeaways
- Incoming request callbacks start in the **Poll Phase**.
- Async operations (like fs, DB) finish in the **Pending / I/O Callbacks Phase**.
- `process.nextTick` and Promises run immediately after each phase.
- Timers and `setImmediate` have their own phases.
- Close events get their own cleanup phase.

✅ **In short:**  
The GET /api request enters at **Poll Phase**, async work finishes in **Pending/I/O**, callback executes again in **Poll**, then microtasks run, and optionally Timers/Check/Close phases run if scheduled.

