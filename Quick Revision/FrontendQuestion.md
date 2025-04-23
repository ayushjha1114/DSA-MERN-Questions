# 🔁 What is `useMemo`?

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

`useMemo` caches the result of a computation (`computeExpensiveValue`) until its dependencies (`[a, b]`) change. It’s used to prevent unnecessary recalculations and optimize performance.

---

## ⚙️ How `useMemo` Works Under the Hood

### 1. Component Fiber Stores Hook State
- React tracks hooks using the Fiber tree.
- Each component’s fiber node stores an array of hooks, including the result of `useMemo`.

### 2. During Initial Render
- React runs the `useMemo` hook.
- Executes the function (e.g., `computeExpensiveValue()`).
- Stores the returned value and the dependencies array `[a, b]`.

### 3. On Re-render
- React compares the new dependencies with the previous dependencies:
    - **If they’re equal (shallow comparison):** React reuses the cached value.
    - **If they’re not equal:** React recalculates the function and updates the stored value.

---

## 📌 Where is it Stored?
- The memoized value lives in memory (RAM).
- It’s stored in React’s internal hook state, not in browser storage (e.g., `localStorage`, `sessionStorage`, `IndexedDB`).
- It exists only for the lifecycle of the component in the current session.

---

## 🧠 Visual Mental Model

```
Component Fiber
 └── hooks[]
            ├── useState
            ├── useEffect
            └── useMemo
                     ├── dependencies: [a, b]
                     └── value: cachedResult
```

React keeps track of this state during each render cycle, using an internal pointer (`hookIndex`) to know which hook is which.

---

## ⚠️ Important Notes

| Myth                              | Truth                                                                 |
|-----------------------------------|-----------------------------------------------------------------------|
| `useMemo` stores in browser cache | ❌ No, only in component memory                                       |
| `useMemo` avoids all re-renders   | ❌ No, only avoids recomputing logic                                  |
| `useMemo` is like Redux or Context| ❌ No, it does not persist across unmounts                            |

---

## 🧠 When to Use `useMemo`

✅ Use it when:
- You’re running an expensive calculation (e.g., sorting, filtering, heavy loops).
- That calculation depends on props/state that don’t change often.
- You want to prevent unnecessary work, especially in render loops.

---

## 🚀 Bonus: Why Not `localStorage`?
- `localStorage` and others persist across sessions.
- `useMemo` is ephemeral—optimized only for within-the-same-render-cycle.
- Storing things in browser storage requires manual serialization, and access times are slower than in-memory cache.
