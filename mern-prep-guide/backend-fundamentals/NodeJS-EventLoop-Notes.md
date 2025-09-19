
# 📝 Detailed Notes on Node.js Event Loop & Queues

## 1. Introduction
- The **event loop** allows Node.js (single-threaded) to handle **non-blocking I/O**.
- It works by **phases**, each with **its own queue of callbacks**.
- Between phases, **microtasks** (like promises and `process.nextTick`) are executed.

---

## 2. Queues in Node.js Event Loop

### 2.1 Macro-task Queues (by Phases)
| Phase Name (Macro-task)     | Queue Name         | Examples |
|-----------------------------|-------------------|-----------|
| **Timers Phase**            | Timers Queue       | `setTimeout`, `setInterval` |
| **Pending / I/O Callbacks** | I/O Callback Queue | Deferred system callbacks (e.g., `fs`, `net`) |
| **Idle / Prepare Phase**    | Internal (libuv)   | Not exposed to JS |
| **Poll Phase**              | Poll Queue         | I/O events, HTTP requests |
| **Check Phase**             | Check Queue        | `setImmediate()` callbacks |
| **Close Callbacks Phase**   | Close Queue        | `socket.on('close')`, `stream.on('close')` |

### 2.2 Micro-task Queues (run between phases)
| Priority | Micro-task Queue       | Examples |
|-----------|-----------------------|-----------|
| 1 (highest) | `process.nextTick()` Queue | `process.nextTick()` |
| 2 | Promise / Microtask Queue   | Promises `.then()`, `queueMicrotask()` |

### 2.3 Full List of Queues
1. **Process.nextTick Queue** (micro-task, highest priority)
2. **Promise / Microtask Queue**
3. **Timers Queue** (`setTimeout`, `setInterval`)
4. **I/O Callback Queue**
5. **Poll Queue**
6. **Check Queue** (`setImmediate`)
7. **Close Callbacks Queue**

---

## 3. Execution Priority
- **process.nextTick()** first
- **Promise microtasks** second
- Then macro tasks (Timers → I/O → Poll → Check → Close)

---

## 4. GET API Request Example with Event Loop

### 4.1 Code Example
```js
app.get('/api', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    res.send(data);
  });
});
```

### 4.2 Step-by-Step Flow
1. **HTTP Request Arrives** → handled by Node HTTP parser.
2. Callback is queued into **Poll Phase** (I/O queue).
3. Your handler executes; calls `fs.readFile` (offloaded to libuv thread pool).
4. Thread pool completes file read; pushes callback into **Pending / I/O Callbacks Phase**.
5. Event loop picks up callback in **Poll Phase** again; executes `res.send(data)`.
6. Microtasks (`process.nextTick`, Promises) run after each phase.
7. Response sent to client asynchronously.
8. Event loop continues to next tasks.

### 4.3 Event Loop Phases Timeline
| Phase (in order) | What happens in GET example |
|-----------------|-----------------------------|
| **Poll (incoming req)** | GET request parsed, handler queued, starts `fs.readFile` |
| **Pending / I/O** | File read completes, callback queued |
| **Poll** | Event loop executes file read callback → `res.send(data)` |
| **Microtasks** | `process.nextTick` / Promise `.then` run |
| **Timers** (if any) | Executes any due `setTimeout` |
| **Check** (if any) | Executes `setImmediate` callbacks |
| **Close callbacks** (if any) | Executes `'close'` callbacks |

### 4.4 Key Queues Involved in GET Example
- **Poll Queue (I/O events)** — GET request & file read callback.
- **Microtask Queue** — Promises or `process.nextTick` inside your callbacks.
- **Timers Queue** — if using `setTimeout`.
- **Check Queue** — if using `setImmediate`.
- **Close Callbacks Queue** — if closing a connection/stream.

---

## 5. Key Takeaways
- **Phases = time slots**, **Queues = lists of callbacks inside phases**.
- **Microtasks run after each macro-task phase**.
- Typical order: `process.nextTick` → Promises → Timers → I/O → Poll → Check → Close.
- A GET API request starts in **Poll Phase**, async work finishes in **Pending/I/O**, callback executes again in **Poll**, then microtasks run, optionally Timers/Check/Close phases.

---

## 6. Summary Hierarchy
```
Microtasks:
   process.nextTick → Promises
Macro tasks (phases):
   Timers → I/O Callbacks → Poll → Check → Close Callbacks
```

---

## 7. Practical Analogy
- **Microtasks:** Urgent tasks → “finish paperwork before leaving.”
- **Timers:** Scheduled alarms → “meeting at 10:00.”
- **I/O Callbacks:** Incoming emails → “reply once fetched.”
- **Check (setImmediate):** End-of-day tasks → “turn off lights.”
- **Close Callbacks:** Shutting down → “lock the door.”

---
