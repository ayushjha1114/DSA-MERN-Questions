# React's Internal Architecture: Before vs After v18

## 🧠 React < 18 (Legacy / Synchronous)
- **Single-threaded render** — blocking and non-interruptible.
- **Reconciliation** happens all at once (sync from root to leaf).
- **Updates batched** only in events, not promises or timeouts.
- **No built-in concurrency** — updates like `setTimeout` flush immediately.
- **No suspense for data-fetching** (only for lazy-loaded components).

> **Summary:**  
> *Fast but rigid. All-or-nothing rendering.*

---

## ⚛️ React 18+ (Concurrent / Fiber-powered)
- **Concurrent rendering** via time-slicing and Scheduler.
- **Fiber Tree** enables interruptible, prioritized rendering.
- **Lanes system** allows update prioritization (`startTransition` = low-priority).
- **Automatic batching** in all contexts (promises, events, etc.).
- **Suspense + Streaming SSR** enabled for async UIs.

> **Summary:**  
> *Flexible and smart. Work is split, paused, and resumed based on urgency.*

---

## 🧠 Easy-to-Memorize Analogy

| React Version | Mindset              | Rendering                  |
|---------------|----------------------|----------------------------|
| React < 18    | "One shot, one render" | Blocking                   |
| React 18+     | "Smart multitasker"    | Concurrent (Interruptible) |




# React 18 (Concurrent React) Internal Architecture: Step-by-Step Example

Let’s walk through a concrete example using React 18 (Concurrent React), and see what happens internally when you click the increment or decrement button.

---

## 🏗️ Internal Architecture Components in Concurrent React Fiber

| Component                | Description                                                                                  |
|--------------------------|----------------------------------------------------------------------------------------------|
| **Fiber Node**           | The unit of work representing a React element/component                                      |
| **Fiber Tree**           | Linked tree of fiber nodes representing the current UI                                      |
| **Work-in-Progress Tree**| Temporary tree built during render phase (to be committed if successful)                     |
| **Current Tree**         | The currently committed Fiber tree (what’s in the DOM)                                      |
| **Scheduler**            | Manages task prioritization, deadlines, and interruptible execution                         |
| **Lanes**                | Bitmask-based priority lanes (e.g. SyncLane, DefaultLane, TransitionLane)                   |
| **Root Node / FiberRoot**| Top-level node tracking pending work, current tree, and lane queues                         |
| **Host Config**          | Maps React operations to host environment (e.g., DOM, Native)                               |
| **Update Queue**         | Stores updates (setState, etc.) on a fiber node before they're processed                    |
| **Effect List**          | Tracks side-effects to apply during the commit phase (e.g., refs, DOM mutations)            |
| **Render Phase**         | Walks the tree and prepares side effects                                                    |
| **Commit Phase**         | Applies changes to the actual DOM                                                           |
| **Passive Effects Queue**| Manages effects from useEffect and useLayoutEffect                                          |
| **Suspense Boundary**    | Handles async rendering & fallback UIs                                                      |
| **Profiler Fiber**       | Tracks performance timing data in dev tools                                                 |
| **Host Fiber**           | Represents actual DOM nodes (e.g. `<div>`, `<span>`) in Fiber tree                         |
| **Context Dependency List**| Tracks context used in a subtree, triggers re-renders                                    |
| **Concurrent Mode Flag** | Enables interruptible rendering and scheduling via `createRoot()`                           |
| **Transition System**    | Manages transitions (`startTransition`, `useTransition`) using lower-priority lanes         |
| **Time Slicing Mechanism**| Splits rendering into small tasks to keep UI responsive                                   |
| **Task Queue (Scheduler Queue)**| Queue of work items scheduled based on priority and deadlines                       |
| **ReactPriorityLevel / SchedulerPriority**| Enum of priorities (Immediate, UserBlocking, Normal, Idle)                |
| **Flush Sync Queue**     | Sync updates that bypass scheduler (e.g., during event handlers)                            |
| **Event System**         | Delegated event listeners using synthetic events — optimized for batching                   |
| **Hydration State Machine**| Handles SSR hydration phase including Suspense and error handling                        |
| **Retry Lanes**          | Special lanes for retrying suspended updates (e.g. when async data is ready)                |
| **Double Buffering Tree**| Keeps both current and work-in-progress tree — enables atomic updates                       |
| **Concurrent Update Handling**| Safely updates shared fiber tree between concurrent renders                           |

---

## ✅ Example Component

```jsx
import { useState } from 'react';

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={() => setCount((c) => c - 1)}>-</button>
            <button onClick={() => setCount((c) => c + 1)}>+</button>
        </div>
    );
}
```

---

## 🔬 Step-by-Step Internal Execution in React 18

### 1. Initial Mount Phase

- **JSX → Virtual DOM**  
    JSX is transpiled into:
    ```js
    React.createElement('div', {}, ...)
    ```

- **Virtual DOM → Fiber Nodes**  
    React constructs a Fiber tree for this component.  
    Each element (`Counter`, `div`, `h2`, `button`, etc.) becomes a Fiber node.  
    React creates a root Fiber using `createRoot()`.

- **useState Initialization**  
    `useState(0)` creates a hook state on the Counter fiber.  
    `setCount` is stored in the Fiber’s update queue.

- **Scheduler Schedules Work**  
    Rendering is scheduled in a "Lane" using the internal scheduler.  
    First render uses high priority (`SyncLane`).

- **Render Phase**  
    React calls `Counter()` to get the JSX tree.  
    Creates a work-in-progress fiber tree.  
    No DOM updates yet.

- **Commit Phase**  
    React commits:
    - Creates DOM nodes
    - Sets innerText and event listeners
    - Flushes to the screen  
    The current Fiber tree becomes the committed tree.

---

### 2. User Clicks + Button

- **onClick Triggers `setCount((c) => c + 1)`**  
    Creates an update object, pushes it to the update queue on the Counter fiber.

- **React Schedules Work Again**  
    Update is scheduled with `SyncLane` (from an event handler).  
    React pauses any low-priority work and begins re-rendering.

---

### 3. Render Phase (Again)

- **React Calls `Counter()` Again**  
    `count` value is now 1.  
    New JSX is generated.  
    New work-in-progress tree is created (diffed against old tree).

- **Reconciliation**  
    React compares new elements with previous ones.  
    Only the text node inside `<h2>` changes from "Count: 0" → "Count: 1".

---

### 4. Commit Phase

- **DOM Mutation**  
    React updates only the changed DOM node:  
    Updates the `textContent` of `<h2>Count: 1</h2>`

- **Effect Phase**  
    If you had `useEffect`, it would run here (not in this simple example).

---

## 🧠 Internals Involved

| System         | Role                                         |
|----------------|----------------------------------------------|
| Fiber Tree     | Tracks UI elements and state                 |
| Hooks          | Stores and queues state updates              |
| Scheduler      | Manages timing and prioritization            |
| Lanes          | Prioritizes updates (`SyncLane` in this case)|
| Update Queue   | Holds `setCount` updates                     |
| Reconciliation | Compares new vs old tree                     |
| Effect List    | If effects exist, they're added here         |
| DOM Host Config| Actually updates the DOM (via ReactDOM)      |

---

## 🧩 What Happens in Memory

- The current Fiber tree remains as-is until a new one is ready.
- When user clicks the button:
    - A new tree is created → compared → committed.
    - The old tree is swapped with the new one.

---

## 🔄 Summary of Flow (Visual)

```
User click → setCount() → Schedule (SyncLane)
                    ↓
            Update Queue
                    ↓
            Render Phase (build new fiber tree)
                    ↓
            Diff against current fiber tree
                    ↓
            Commit changes to DOM (only changed parts)
```

---

## How React 18 Identifies Task Priority

React uses an internal priority model called **Lanes**, combined with a **Scheduler** that decides which updates to run first based on urgency.

---

### 🧱 1. React Scheduler: The Brain Behind Prioritization

React 18 uses its own internal cooperative scheduler.

It considers:
- Update type (user input, transition, render)
- Update time (when it was scheduled)
- Update lane (priority bucket)

The scheduler breaks work into small chunks, then decides:  
*"Should I do this now, or wait?"*

---

### 🚦 2. Lanes: Priority Buckets

React assigns each update to a "lane", representing its priority level.

| Lane Name         | Priority Level      | Example                                         |
|-------------------|--------------------|-------------------------------------------------|
| **SyncLane**      | 🚨 Highest         | Click, input typing, immediate setState         |
| **InputContinuous**| 🔶 High           | Scrolling, drag events                          |
| **DefaultLane**   | ⚙️ Normal          | Normal rendering (non-blocking)                 |
| **TransitionLane**| 🕓 Low (deferred)  | UI transitions using `startTransition()`        |
| **IdleLane**      | 💤 Very low         | Background prefetch, cache warmup               |

---

### 🧪 Example of Prioritized Tasks

**High Priority**
```js
function handleChange(e) {
    setQuery(e.target.value); // Happens in SyncLane
}
```

**Low Priority with `startTransition`**
```js
const [isPending, startTransition] = useTransition();

startTransition(() => {
    setSearchResults(fetchHeavyResults(query)); // Happens in TransitionLane
});
```

React will:
- Execute `handleChange` immediately
- Schedule `startTransition` work later, when the browser is idle or the main thread is free

---

### 🔄 React Internals: What Happens Behind the Scenes?

- Update is scheduled
- React assigns the update to a lane
- Scheduler checks:
    - Is there more urgent work pending?
    - Is it okay to pause current work?
- If allowed, React pauses low-priority work
- High-priority work runs immediately

---

### 💻 Timeline Analogy

```
|-- User types (SyncLane) --| ← Immediate
                                                        |--- Search filtering UI (TransitionLane) ---| ← Delayed
```

React keeps track of pending lanes using a bitmask and a `getHighestPriorityLane()` function internally.

---

### 📊 Visualization

Imagine updates like tasks in a task manager:

```yaml
[🧠 setInput()]         => Priority: High (SyncLane)
[🔍 setSearchResults()] => Priority: Low (TransitionLane)
[🛌 WarmupCache()]      => Priority: IdleLane
```

React schedules them:
- SyncLane first
- Then Transition
- Then Idle (if no other work)

---

### ⚙️ Developer APIs that Affect Priority

| API                | Lane           | Use Case                          |
|--------------------|---------------|-----------------------------------|
| setState (direct)  | SyncLane      | Input fields, immediate updates   |
| startTransition    | TransitionLane| Low-priority, non-blocking UI     |
| useDeferredValue   | TransitionLane| Defers a value for heavy updates  |
| useEffect          | Post-commit   | Side effects                      |



## 🌳 What Type of Tree is the Fiber Tree?

The Fiber Tree is a **single child + sibling linked tree** (aka "first child–next sibling tree").  
It's not a traditional binary or n-ary tree—React Fiber uses a custom linked-list-based structure for efficient traversal, interruption, and updates.

---

### 🔁 Internals: Fiber Node Structure

Each Fiber node contains:

- **`.child`**: Reference to its first child
- **`.sibling`**: Reference to its next sibling
- **`.return`**: Reference to its parent
- **`.alternate`**: Work-in-progress twin
- **Other fields**: `type`, `key`, `stateNode`, `flags`, `lanes`, `updateQueue`, `memoizedState`, etc.

```js
{
    type: 'div',
    key: null,
    stateNode: DOMNode,
    child: FiberNode,       // First child
    sibling: FiberNode,     // Next sibling
    return: FiberNode,      // Parent
    alternate: FiberNode,   // Work-in-progress twin
    flags: EffectTag,       // Side-effects (Update, Placement, etc.)
    lanes: 1,               // Priority lane
    updateQueue: [...],     // Pending state updates
    memoizedState: ...,
    ...
}
```

---

### 🔄 Why This Structure?

| Feature                   | Why It Matters                                                                 |
|---------------------------|-------------------------------------------------------------------------------|
| ✅ Efficient traversal    | Move down to child or across to sibling without recursive stack               |
| ✅ Interruptible rendering| Can yield in the middle of traversal                                          |
| ✅ No deep recursion      | Uses iterative traversal (helps with stack safety)                            |
| ✅ Easy to clone/update   | Create work-in-progress trees using `.alternate` pointers                     |

---

### 🧠 Visual Representation

#### Tree Structure

```
App
├── Header
│   └── Logo
├── Main
│   ├── Article
│   └── Sidebar
└── Footer
```

#### Internally in Fiber

```
App
 ↓ .child
Header
 ↓ .sibling
Main
 ↓ .sibling
Footer

(Header)
 ↓ .child
Logo

(Main)
 ↓ .child
Article
 ↓ .sibling
Sidebar
```

---

### 📚 Comparison with Other Tree Structures

| Structure Type                | Description                           | Used In Fiber? |
|-------------------------------|---------------------------------------|:--------------:|
| Binary Tree                   | 2 children max                        | ❌ No          |
| N-ary Tree                    | Any number of children in an array    | ❌ No          |
| First-child next-sibling tree | Linked list of siblings, single child | ✅ Yes         |

---

### 🎯 Key Advantages

- **Optimized for reconciliation**: Easy to diff and reuse unchanged nodes.
- **Supports concurrency**: Fine-grained scheduling possible because traversal is incremental.
- **Low memory overhead**: Efficient memory reuse via `.alternate`.



## React 18+ Automatic Batching

In React 18+, **automatic batching** refers to React's ability to group multiple state updates into a single re-render—even when those updates happen outside React event handlers (e.g., inside `setTimeout`, `fetch`, or `Promise.then` callbacks).

---

### 🔁 What is "Batching"?

**Batching** means combining multiple state updates into one render pass to optimize performance and avoid unnecessary re-renders.

- **Before React 18:**  
    Only updates inside React event handlers (like `onClick`) were batched automatically.

```jsx
// ✅ Batched in React 17 (event handler)
function handleClick() {
    setCount(c => c + 1);
    setFlag(true);
}
```

But this wouldn't work in async code:

```jsx
// ❌ Not batched in React 17
setTimeout(() => {
    setCount(c => c + 1);
    setFlag(true);
}, 1000);
```
This causes **two separate re-renders**.

---

### ✅ React 18: Automatic Batching Everywhere

With automatic batching in React 18+, the above `setTimeout` example will now batch those updates into one render, just like in an event handler.

React batches all state updates inside:

- Event handlers
- `setTimeout`
- `Promise.then`
- Native events (if wrapped with `createRoot`)
- Fetch responses
- Any async logic

---

### 🧪 Example Comparison

#### 🔴 React 17 (no automatic batching outside handlers):

```jsx
useEffect(() => {
    setTimeout(() => {
        setCount(c => c + 1);  // causes re-render
        setFlag(true);         // causes another re-render
    }, 1000);
}, []);
```
**Two renders occur** — bad for performance.

#### 🟢 React 18 (with automatic batching):

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```
```jsx
useEffect(() => {
    setTimeout(() => {
        setCount(c => c + 1);  // batched
        setFlag(true);         // batched
    }, 1000);
}, []);
```
**Only one render**, because React batches them automatically.

---

### ⚙️ How It Works Internally

- React 18 tracks state updates inside a context using a scheduler.
- Any update in a shared context is batched unless it's flushed explicitly.
- React waits to flush DOM updates until the end of the task/microtask queue.

---

### 🔓 Opting Out

If you want to force separate renders, use:

```js
import { flushSync } from 'react-dom';

flushSync(() => {
    setCount(c => c + 1);
});
flushSync(() => {
    setFlag(true);
});
```
This forces React to render immediately after each update.




## How Data Binding Works in React 18+

| Step | What Happens                                      |
|------|---------------------------------------------------|
| 1    | Component renders with state/props                |
| 2    | JSX binds values to DOM elements                  |
| 3    | User interacts → triggers state change            |
| 4    | React schedules update (prioritized)              |
| 5    | New tree built → diffed → DOM updated efficiently |


# Partitioning vs Sharding in Databases

Partitioning and sharding are techniques to manage large datasets for performance, scalability, and maintainability. Here’s a concise guide for production-grade systems.

---

## 🔹 Partitioning

Partitioning divides a large table into smaller, manageable pieces (partitions) while retaining the logical structure of a single table.

**Benefits:**
- **Faster queries:** Reduces I/O by scanning only relevant partitions.
- **Easier maintenance:** Archive/drop old partitions.
- **Parallel queries:** Queries can run across partitions.
- **Optimized indexes:** Indexes are smaller and more efficient.

### Types of Partitioning

| Type                  | Description                       | Example                                      |
|-----------------------|-----------------------------------|----------------------------------------------|
| Range Partitioning    | By range of column values         | `created_at` monthly partitions              |
| List Partitioning     | By discrete values                | Partition by country (`'US'`, `'IN'`)        |
| Hash Partitioning     | By hash function on a column      | Partition by `user_id % 4`                   |
| Composite Partitioning| Combines methods                  | Range + hash for multi-tenant cases          |

### Example: PostgreSQL Range Partitioning

```sql
-- Step 1: Create partitioned table
CREATE TABLE user_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    activity TEXT,
    created_at DATE
) PARTITION BY RANGE (created_at);

-- Step 2: Create partitions
CREATE TABLE user_logs_2024_01 PARTITION OF user_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE user_logs_2024_02 PARTITION OF user_logs
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- ...more partitions

-- Step 3: Insert/query (no change in logic)
INSERT INTO user_logs (user_id, activity, created_at)
VALUES (1, 'login', '2024-01-25');

SELECT * FROM user_logs
WHERE created_at BETWEEN '2024-01-01' AND '2024-02-01';
```
_PostgreSQL scans only relevant partitions (partition pruning)._

### Production Best Practices

| Concern                | Recommendation                                 |
|------------------------|------------------------------------------------|
| Query performance      | Always filter by partition key                 |
| Auto partition mgmt    | Automate creation/rotation (cron/app logic)    |
| Retention/archiving    | Drop old partitions for instant purging        |
| Indexing               | Index only needed columns per partition        |
| Monitoring             | Track bloat, query plans, partition sizes      |
| Migrations             | Plan changes during downtime or with tools     |

### Tools & Libraries

- **pg_partman:** Automatic partition maintenance for PostgreSQL
- **TimescaleDB:** Advanced time-series partitioning (hypertables)
- **Custom logic:** For NoSQL/ORMs, partitioning at app level

### Partitioning in NoSQL

- **MongoDB:** Sharding (horizontal partitioning)
- **Cassandra:** Partition key defines data locality
- **DynamoDB:** Partition key + sort key

---

## 🔹 Sharding

Sharding splits data horizontally across multiple databases or machines (shards), each holding a subset of the data. Used when partitioning a single table isn’t enough.

**Key Points:**
- **Scales beyond a single server**
- **Each shard is a separate DB/server**
- **Requires routing logic in the app**

### Sharding vs Partitioning

| Feature         | Partitioning                | Sharding                       |
|-----------------|----------------------------|--------------------------------|
| Level           | Within one DB instance      | Across multiple DBs/servers    |
| Goal            | Performance, manageability  | Scalability, capacity          |
| Maintenance     | Easier                      | More complex                   |
| Query engine    | Centralized                 | Often needs routing logic      |

### Example: User-Based Sharding

Suppose a social app with 100M users:

- Users 1–10M → `user_db_1`
- Users 10M–20M → `user_db_2`
- ...each DB on a separate server

#### Sharding Steps

1. **Choose a Shard Key**
   - Distributes data evenly
   - Matches query patterns
   - Is immutable
   - _Good keys:_ `user_id`, `tenant_id`, `region`
   - _Bad keys:_ `email`, `timestamp`

2. **Set Up Multiple Databases**
   ```bash
   user_db_1 (db1.server.com)
   user_db_2 (db2.server.com)
   ```

3. **Routing Layer in App**
   ```typescript
   function getShardForUser(userId) {
     const numShards = 4;
     return `user_db_${userId % numShards}`;
   }
   // Use a connection pool per shard
   ```

4. **Querying/Writing**
   ```typescript
   const db = getShardForUser(userId);
   await db.query("SELECT * FROM users WHERE id = $1", [userId]);
   ```

### Sharding Best Practices

| Concern         | Solution                                 |
|-----------------|------------------------------------------|
| Rebalancing     | Use shard map, re-shard gradually        |
| Fault tolerance | Redundancy per shard (replication)       |
| Monitoring      | Track load per shard                     |
| Backups         | Independent backups per shard            |
| Security        | Encrypt keys, isolate DBs                |
| Deployment      | Use Terraform/K8s for scaling            |

---

## 🔚 Summary

- **Partitioning:** Breaks large tables into smaller ones for faster queries and easier management.
- **Sharding:** Splits data across multiple DBs/servers for horizontal scaling.

**Production tips:**
- Use range partitioning for time-series logs.
- Automate partition/shard rotation.
- Monitor performance and bloat.
- Plan schema, indexes, and routing logic carefully.
- Avoid cross-shard operations.


## Partitioning vs Sharding: Key Differences

The major difference between partitioning and sharding lies in where and how the data is split.

### 🔍 At a Glance

| Feature           | Partitioning                                                                 | Sharding                                                      |
|-------------------|------------------------------------------------------------------------------|---------------------------------------------------------------|
| **Definition**    | Dividing a table into smaller parts within the same database instance         | Dividing the data across multiple databases or servers        |
| **Goal**          | Performance & manageability                                                  | Scalability & system capacity                                 |
| **Data Location** | All partitions are on the same server / DB instance                          | Shards live on different servers / DBs                        |
| **Query Handling**| Handled internally by the DBMS (transparent)                                 | App or middleware must route queries to the right shard       |
| **Indexing**      | Indexing can be partition-specific                                           | Each shard has its own indexes                                |
| **Cross-table joins** | Easy, within one DB                                                      | Hard, requires merging across shards                          |
| **Failure Isolation** | Not isolated; all partitions go down if DB crashes                       | Fault is isolated per shard                                   |
| **Scalability**   | Limited by single machine                                                    | Scales horizontally across machines                           |

---

### 🎯 Use Cases

#### ✅ Use Partitioning When:
- You're dealing with very large tables (e.g. logs, events, transactions)
- You need to archive old data easily
- You want to optimize queries by date, region, etc.
- You want to improve vacuuming/performance in PostgreSQL
- You're not yet hitting the resource limits of your database server

**Example:**  
A financial app stores millions of transaction logs — partition by `transaction_date` monthly to optimize reads & archiving.

#### ✅ Use Sharding When:
- You’ve outgrown a single DB's CPU, RAM, or storage
- You have billions of rows or millions of users
- Your traffic is high enough to need multiple DB servers
- You want fault isolation (e.g., if shard A fails, shard B is unaffected)
- You're building a multi-tenant SaaS (e.g., each tenant in a separate shard)

**Example:**  
A social network with 100M users shards user data by `user_id % N`, each shard lives on a different DB server.

---

### 🔚 Summary

| Concept        | Partitioning                  | Sharding                        |
|----------------|------------------------------|---------------------------------|
| **Scaling**    | Vertical (within 1 DB)       | Horizontal (across DBs)         |
| **Managed By** | Database engine              | Application or middleware       |
| **Complexity** | Lower                        | Higher                          |
| **Performance**| Improves local query performance | Solves data volume & traffic scaling |

---

### 🚀 Rule of Thumb

> Start with partitioning. Move to sharding when you hit hardware or performance limits that partitioning can't solve.



## Partitioning vs Sharding: Key Differences

The major difference between partitioning and sharding lies in where and how the data is split.

### 🔍 At a Glance

| Feature            | Partitioning                                                                 | Sharding                                                      |
|--------------------|------------------------------------------------------------------------------|---------------------------------------------------------------|
| **Definition**     | Dividing a table into smaller parts within the same database instance         | Dividing the data across multiple databases or servers         |
| **Goal**           | Performance & manageability                                                  | Scalability & system capacity                                 |
| **Data Location**  | All partitions are on the same server / DB instance                          | Shards live on different servers / DBs                        |
| **Query Handling** | Handled internally by the DBMS (transparent)                                 | App or middleware must route queries to the right shard        |
| **Indexing**       | Indexing can be partition-specific                                           | Each shard has its own indexes                                |
| **Cross-table joins** | Easy, within one DB                                                       | Hard, requires merging across shards                          |
| **Failure Isolation** | Not isolated; all partitions go down if DB crashes                        | Fault is isolated per shard                                   |
| **Scalability**    | Limited by single machine                                                    | Scales horizontally across machines                           |

---

### 🎯 Use Cases

#### ✅ Use Partitioning When:
- Dealing with very large tables (e.g. logs, events, transactions)
- Need to archive old data easily
- Want to optimize queries by date, region, etc.
- Want to improve vacuuming/performance in PostgreSQL
- Not yet hitting the resource limits of your database server

**Example:**  
A financial app stores millions of transaction logs — partition by `transaction_date` monthly to optimize reads & archiving.

#### ✅ Use Sharding When:
- Outgrown a single DB's CPU, RAM, or storage
- Have billions of rows or millions of users
- Traffic is high enough to need multiple DB servers
- Want fault isolation (e.g., if shard A fails, shard B is unaffected)
- Building a multi-tenant SaaS (e.g., each tenant in a separate shard)

**Example:**  
A social network with 100M users shards user data by `user_id % N`, each shard lives on a different DB server.

---

### 🔚 Summary

| Concept        | Partitioning                  | Sharding                        |
|----------------|------------------------------|---------------------------------|
| **Scaling**    | Vertical (within 1 DB)        | Horizontal (across DBs)         |
| **Managed By** | Database engine               | Application or middleware       |
| **Complexity** | Lower                         | Higher                          |
| **Performance**| Improves local query performance | Solves data volume & traffic scaling |

---

### 🚀 Rule of Thumb

> Start with partitioning. Move to sharding when you hit hardware or performance limits that partitioning can't solve.