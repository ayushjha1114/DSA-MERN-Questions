# React Virtual DOM Tree Diff Algorithm

React uses a tree diffing algorithm in its Virtual DOM to efficiently determine the minimum number of changes needed to update the real DOM. This process is called **reconciliation**.

---

## 🧠 What is the Tree Diff Algorithm?

React’s tree diff algorithm compares two trees:

- **Previous Virtual DOM tree** (before update)
- **New Virtual DOM tree** (after update)

It then:

1. Figures out what’s changed
2. Generates a patch
3. Applies the patch to the real DOM

> ⚡ **Note:** React's diff algorithm is optimized with heuristics to reduce time complexity. It is not a generic tree diff (which is O(n³)).

---

## 🎯 Heuristics Used by React

React makes three key assumptions to improve performance:

1. **Different element types produce different trees.**  
  Example: `<div>` vs `<span>` → treat as completely new subtree.

2. **Keys hint at stability in lists.**  
  Keys are used to track moved or updated elements.

3. **Component re-rendering is isolated.**  
  If a component doesn’t change, React doesn’t re-render its subtree.

---

## 📦 Tree Diff Example

**Previous Virtual DOM Tree:**
```jsx
<ul>
  <li key="A">Apple</li>
  <li key="B">Banana</li>
  <li key="C">Cherry</li>
</ul>
```

**Updated Virtual DOM Tree:**
```jsx
<ul>
  <li key="B">Banana</li>
  <li key="C">Cherry</li>
  <li key="D">Date</li>
</ul>
```

**React’s Diff Output:**
- `<li key="A">` is **removed**
- `<li key="D">` is **added**
- `<li key="B">` and `<li key="C">` are **reused (moved)**

React uses the `key` attribute to match list items between updates.  
Without keys, React uses index-based diffing, which can cause performance issues and bugs in dynamic lists.

---

## 🌳 Virtual DOM Tree Structure

```
ul
├── li (key="A") - "Apple"
├── li (key="B") - "Banana"
└── li (key="C") - "Cherry"
```

Each `<li>` is a child node of the `<ul>` parent. React builds this tree internally, attaching properties like:

- **Element type** (e.g., `li`)
- **Props** (like `key`)
- **Children** (text nodes or nested elements)

---

## 🔎 Detailed Representation (React-style)

```json
{
  "type": "ul",
  "props": {},
  "children": [
   {
    "type": "li",
    "key": "A",
    "props": { "children": "Apple" }
   },
   {
    "type": "li",
    "key": "B",
    "props": { "children": "Banana" }
   },
   {
    "type": "li",
    "key": "C",
    "props": { "children": "Cherry" }
   }
  ]
}
```
Each node in the virtual DOM tree is a plain JavaScript object representing a DOM element.

---

## ⏱️ Time Complexity

React’s optimized diffing algorithm has:

- **O(n) time complexity (linear)**, where _n_ = number of nodes in the tree

This is possible because:

- It avoids comparing subtrees if the node types differ
- It compares only siblings (not arbitrary nodes across the tree)

---

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



# Reactjs internal working(Refined Version)

React uses a **Fiber architecture** where each component or DOM element is represented by a *Fiber node* in a *Fiber tree*.

Each Fiber node contains:
- **type** (e.g., `div`, component)
- **props**, **state**, **effect list**
- **hooks info** (for functional components)
- **pointers**: to child, sibling, and return (parent)

---

## 🔁 React's Render Cycle — 3 Key Phases

### 1. 🧠 Render Phase (a.k.a. Reconciliation)
- React builds a **Work-In-Progress (WIP) Fiber tree**.
- It compares the WIP tree to the **Current Fiber tree** (previous).
- Based on this diff:
    - Marks fibers with `"placement"`, `"update"`, or `"deletion"`.
- ❌ **No DOM is updated here.**
- ✅ This phase **can be paused and resumed** (in concurrent rendering).

### 2. ⚙️ Commit Phase
- React takes the changes calculated in the render phase...
- And **performs DOM mutations** (insert, update, delete).
- Also runs:
    - `useEffect`
    - `componentDidMount`
    - ref attachment
- ❌ **Not interruptible** — must complete once started.

### 3. ⏳ Idle Phase / Scheduling
- Not an official "phase", but important in Concurrent Mode.
- React may:
    - **Yield rendering work** to allow the browser to remain responsive.
    - Use **scheduling priority** to manage urgent vs non-urgent updates.
- Internally uses a **scheduler** to decide when to re-render parts of the UI.



# 🔍 Does every Fiber node represent a React component?

**Mostly yes, but with important nuances:**

- Every React element in your component tree typically has a corresponding Fiber node.
- This includes both components and host elements (like `<div>`, `<span>`, etc.).

---

## 🧠 What is a Fiber Node?

A **Fiber node** is a JavaScript object that represents:

- A unit of work in React's render process.
- A node in the React virtual DOM tree.

---

## 🏗️ Structure of a Fiber Node

Each Fiber has:

- **type**: What to render (e.g., `MyComponent`, `'div'`)
- **tag**: Type of fiber (`FunctionComponent`, `HostComponent`, etc.)
- **return**: Pointer to the parent
- **child**, **sibling**: Tree structure
- **stateNode**: Actual instance (DOM node or class component)
- **memoizedProps**, **memoizedState**: Current props and state

---

## 🌳 Example

```jsx
function App() {
    return (
        <div>
            <Header />
            <Content />
        </div>
    );
}
```

This generates a fiber tree:

```
App (FunctionComponent)
└── div (HostComponent)
        ├── Header (FunctionComponent)
        └── Content (FunctionComponent)
```

Each of:

- `App`
- `div`
- `Header`
- `Content`

gets its own fiber node.


# How React Fiber Stores Hooks Internally

React Fiber architecture stores hook state (like `useState`, `useEffect`, `useMemo`, `useCallback`, and `useRef`) inside each component's Fiber node, specifically in a linked list attached to the `memoizedState` field.

---

### ⚛️ React Fiber Refresher

Each component instance is represented by a Fiber node:

```js
FiberNode = {
    type: FunctionComponent,
    stateNode: component instance,
    memoizedState: hook list (linked list),
    alternate: previous Fiber (for diffing),
    // ...other fields
}
```

- `memoizedState` holds a linked list of hook objects, each storing info for a specific hook (`useState`, `useEffect`, etc.).

---

### 🧠 Example: How Hooks Are Stored

Suppose you have a component using several hooks:

```jsx
function ExampleComponent() {
    const [count, setCount] = useState(0);                   // Hook 1
    const valueRef = useRef(null);                           // Hook 2
    const memoizedValue = useMemo(() => count * 2, [count]); // Hook 3
    const memoizedFn = useCallback(() => console.log(count), [count]); // Hook 4

    useEffect(() => {
        console.log("Effect ran");
    }, [count]);                                             // Hook 5

    return <div>{count}</div>;
}
```

#### Fiber Node Structure

The Fiber node for `ExampleComponent` will have its `memoizedState` field pointing to a linked list of hook objects:

```
FiberNode (type: ExampleComponent)
└─ memoizedState → Hook1 → Hook2 → Hook3 → Hook4 → Hook5 → null
```

#### Each Hook Object (Simplified)

1. **useState (Hook 1)**
        ```js
        {
            memoizedState: 0, // current state value
            queue: { pending: null, dispatch: setCount },
            next: Hook2
        }
        ```

2. **useRef (Hook 2)**
        ```js
        {
            memoizedState: { current: null }, // valueRef.current
            next: Hook3
        }
        ```

3. **useMemo (Hook 3)**
        ```js
        {
            memoizedState: count * 2, // computed value
            deps: [count],
            next: Hook4
        }
        ```

4. **useCallback (Hook 4)**
        ```js
        {
            memoizedState: () => console.log(count), // memoized function
            deps: [count],
            next: Hook5
        }
        ```

5. **useEffect (Hook 5)**
        ```js
        {
            tag: EffectTag,
            create: () => { console.log("Effect ran") }, // effect function
            deps: [count],
            destroy: undefined,
            next: null
        }
        ```

---

### 🔁 What Happens on Re-render?

- React creates a new "work-in-progress" Fiber node.
- It walks the previous `memoizedState` hook list.
- For each hook, it compares new dependencies (`deps`) with the previous ones.
- If dependencies haven't changed, it reuses the previous `memoizedState`.
- If dependencies changed, it recalculates and stores the new value.

---

### ⚠️ Why Hook Order Matters

- Hooks are stored by their order of invocation, not by name or variable.
- **Always call hooks in the same order**; never call hooks conditionally.
- Violating the "Rules of Hooks" can cause React to mismatch hook values, leading to bugs.

---

**Summary:**  
All React hooks' internal state is stored in a linked list on the Fiber node, in the order they are called. This is why the order and consistency of hook calls are critical in React function components.



# 🧠 Concept: What is a Work-In-Progress (WIP) Fiber Node?

When your React component re-renders (due to `setState`, props change, etc.), React **doesn’t immediately mutate the current Fiber tree**.

Instead, it:

1. **Clones the current Fiber tree**
2. **Builds a new work-in-progress (WIP) tree**
3. **Performs updates on the WIP tree**
4. **Commits the WIP tree when done**

This enables non-blocking rendering, error recovery, and more.

---

## 🔄 Fiber Tree Structure

React maintains **two trees** for each component:

```
+------------------------+           +------------------------+
| Current Fiber Tree     | ⇄ (linked)| Work-In-Progress Tree  |
+------------------------+   via     +------------------------+
| [rendered and shown]   | `alternate`| [updating in memory]  |
+------------------------+   field   +------------------------+
```

- Each `FiberNode` has an `.alternate` pointer linking the current and WIP nodes.
- This is known as **Double Buffering**.

---

## 🔧 How React Creates Work-In-Progress Fiber

Here’s a simplified implementation from React source:

```js
function createWorkInProgress(currentFiber, pendingProps) {
    let wip = currentFiber.alternate;

    if (wip === null) {
        // No alternate exists yet → create one
        wip = {
            ...currentFiber,         // shallow copy
            pendingProps,
            alternate: currentFiber, // link back
        };
        currentFiber.alternate = wip;
    } else {
        // Reuse existing WIP
        wip.pendingProps = pendingProps;
    }

    return wip;
}
```

**On each re-render:**

- React finds the current Fiber
- Uses `.alternate` to get or create the WIP Fiber
- Performs updates on the WIP
- At commit phase, the WIP becomes the current

---

## 🧪 Visualization: One Component Re-render

Suppose you start with:

```
Current Tree:
<App> (Fiber: A)
 └── <Counter> (Fiber: B)
```

Each node has:

- **Fiber B:**
    - `memoizedState: 0`
    - `alternate: null`

When `setCount(1)` is called:

- React clones Fiber B → creates Work-in-Progress Fiber B'
- WIP B' holds `memoizedState: 1`
- WIP B' points back to current B as `.alternate`
- Eventually, WIP B' becomes the new current

```
                 Current Tree                Work-In-Progress
                --------------             -------------------
<App>   [Fiber A]                  [Fiber A'] (copy)
 └──    [Fiber B] ←─────────────→ [Fiber B'] ← update here
                memoizedState: 0           memoizedState: 1
```

After the commit phase, this flips:

- **Fiber B' becomes current**
- **Fiber B becomes alternate**

---

## 🧠 Why This Is Powerful

- React can **discard the WIP tree mid-way** if needed (e.g., error, interruption)
- Enables **Concurrent Mode**, **Suspense**, **Time-Slicing**
- Helps React keep UI **responsive under heavy load**

---

## ✅ Summary

| Term                     | Meaning                                                      |
|--------------------------|--------------------------------------------------------------|
| **Current Fiber**        | The live, committed tree visible to the user                 |
| **Work-In-Progress Fiber** | A clone of the current used to apply changes                |
| **Alternate**            | Link between current and WIP Fibers                          |
| **Why**                  | Enables safe async updates, rollback, non-blocking UI        |