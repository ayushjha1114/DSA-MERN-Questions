# Debouncing in React - Complete Guide

***SANDBOX LINK***- https://codesandbox.io/p/sandbox/wonderful-moon-mz8zrc

## ✅ What is **Debouncing**?

**Debouncing** is a programming technique used to **limit the rate** at which a function is executed. It's commonly used in scenarios where a function is **triggered frequently** — such as on `input`, `scroll`, or `resize` events — to improve performance and reduce unnecessary operations (like API calls or heavy DOM updates).

### 🔧 Example Use Case in React:

You're building a search bar that makes an API call with every keystroke. Without debouncing, every keystroke triggers a new request. With debouncing, the API call is only made **after the user stops typing for X milliseconds**.

## ✅ How Debouncing Works:

* When the event is fired, set a timer.
* If the event fires again before the timer finishes, **reset the timer**.
* Only execute the function if the timer finishes (i.e., user has paused).

## 💡 Debouncing in **ReactJS** (using `useEffect` and `setTimeout`)

```jsx
import React, { useState, useEffect } from "react";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // wait 500ms after user stops typing

    // cleanup timer if query changes before 500ms
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      console.log("Calling API with:", debouncedQuery);
      // call API here with debouncedQuery
    }
  }, [debouncedQuery]);

  return (
    <input
      type="text"
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

## ✅ Custom `useDebounce` Hook (Reusable)

```jsx
import { useEffect, useState } from "react";

function useDebounce(value, delay = 500) {
  const [debouncedVal, setDebouncedVal] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedVal(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedVal;
}
```

### Usage in component:

```jsx
import "./styles.css";
import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";

export default function App() {
  const [input, setInput] = useState("");

  const res = useDebounce(input, 500);
  return (
    <>
      <div className="App">
        <h2>Debounce demo</h2>
        <h3>After debounced value is - {res}</h3>
        <input
          type="text"
          value={input}
          placeholder="type your name"
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </>
  );
}
```

## Key Benefits:

- **Performance Optimization**: Reduces unnecessary API calls and computations
- **Better User Experience**: Prevents flickering or rapid updates
- **Resource Management**: Saves bandwidth and server resources
- **Responsive UI**: Keeps the interface smooth during frequent events


# Throttling Complete Guide with React Implementation

## 🧠 What is Throttling?

**Throttling** ensures that a **function is called at most once every X milliseconds**, no matter how many times the event is triggered.

## 🔁 How it Works

Imagine a user is scrolling or resizing the window, and you want to run a function at most **once every 1000ms**, even if the event fires 100 times.

Internally, throttling:
* Uses a **timestamp or a timeout**
* Waits for the next "allowed" time slot before executing the function again

## 🧰 Use Cases of Throttling

| Use Case | Why Use Throttling? |
|----------|---------------------|
| Scroll event | Avoid running logic on every pixel scroll |
| Resize event | Optimize reflows on window resize |
| Button clicks (e.g. API calls) | Prevent accidental double submissions |
| Mouse move tracking | Reduce processing on high-frequency events |

## 🔧 React Implementation

### Custom Throttle Hook

```javascript
import { useState, useEffect, useRef } from "react";

const useThrottle = (value, delay = 1000) => {
  const [throttleVal, setThrottleVal] = useState(value);
  const timerRef = useRef(null);
  const lastValueRef = useRef(value);

  useEffect(() => {
    lastValueRef.current = value;

    if (!timerRef.current) {
      setThrottleVal(value);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;

        if (lastValueRef.current !== throttleVal) {
          setThrottleVal(lastValueRef.current);
        }
      }, delay);
    }
  }, [value, delay, throttleVal]);

  return throttleVal;
};

export default useThrottle;
```

### Demo Application

```javascript
import "./styles.css";
import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";
import useThrottle from "./useThrottle";

export default function App() {
  const [input, setInput] = useState("");
  const [isThrottleOpen, setIsThrottleOpen] = useState(false);
  const [throttleInput, setThrottleInput] = useState("");

  const res = useDebounce(input, 500);
  let throttleRes = useThrottle(throttleInput, 1000);

  return (
    <>
      <button onClick={() => setIsThrottleOpen(!isThrottleOpen)}>
        For Throttle
      </button>
      
      <div className="App">
        <h2>Debounce demo</h2>
        <h3>After debounced value is - {res}</h3>
        <input
          type="text"
          value={input}
          placeholder="type your name"
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      
      {isThrottleOpen && (
        <div className="App">
          <h2>Throttling demo</h2>
          <h3>After throttling value is - {throttleRes}</h3>
          <input
            type="text"
            value={throttleInput}
            placeholder="type something...."
            onChange={(e) => setThrottleInput(e.target.value)}
          />
        </div>
      )}
    </>
  );
}
```

## 🔍 How the Hook Works

1. **Initial State**: Sets the throttled value to the initial input value
2. **Timer Check**: If no timer is running, immediately update the throttled value
3. **Timer Setup**: Creates a timeout for the specified delay
4. **Last Value Tracking**: Keeps track of the most recent input value
5. **Timer Completion**: When timer expires, checks if there's a newer value to update

## 🎯 Key Benefits

- **Performance Optimization**: Reduces function calls significantly
- **User Experience**: Prevents laggy interfaces during high-frequency events
- **Resource Management**: Saves CPU and memory by limiting execution frequency
- **Predictable Behavior**: Ensures consistent timing intervals

## 🆚 Throttling vs Debouncing

| Aspect | Throttling | Debouncing |
|--------|------------|------------|
| **Execution** | At regular intervals | Only after delay with no new events |
| **Use Case** | Scroll, resize, mouse move | Search input, form validation |
| **Behavior** | Executes periodically | Waits for pause in events |

This implementation provides a robust throttling mechanism that can be easily integrated into any React application for performance optimization.