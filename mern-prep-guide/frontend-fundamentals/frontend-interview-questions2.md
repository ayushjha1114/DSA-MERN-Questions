# Debouncing in React - Complete Guide

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
const query = useDebounce(inputValue, 300);
```

## Key Benefits:

- **Performance Optimization**: Reduces unnecessary API calls and computations
- **Better User Experience**: Prevents flickering or rapid updates
- **Resource Management**: Saves bandwidth and server resources
- **Responsive UI**: Keeps the interface smooth during frequent events


# Event Coupling in Software Architecture

## What is Event Coupling?

Event coupling refers to how tightly or loosely two parts of a system (typically components, services, or modules) are linked through events—meaning, how they interact or communicate based on emitted events rather than direct calls.

🔹 **Simple Definition:**
Event coupling is a design concept where components communicate by emitting and listening to events rather than calling each other directly.

## 🔧 Types of Coupling in Context of Events

| Type | Description |
|------|-------------|
| **Tight Coupling** | Components know about each other and call each other directly. |
| **Loose Coupling (via Events)** | Components emit/listen to events without knowing each other's details. |

## Examples

### Example of Tightly Coupled Components

**In Node.js (Tight Coupling):**

```javascript
// userController.js
const emailService = require('./emailService');

function createUser(userData) {
  // save user to DB
  emailService.sendWelcomeEmail(userData.email); // directly calling another module
}
```

Here, `userController` is tightly coupled to `emailService`. If the email logic changes, it can directly impact the controller.

### Example of Loosely Coupled Components

**In Node.js (Loose Coupling using events):**

```javascript
// eventBus.js
const EventEmitter = require('events');
module.exports = new EventEmitter();

// userController.js
const eventBus = require('./eventBus');

function createUser(userData) {
  // save user
  eventBus.emit('userCreated', userData);
}

// emailService.js
const eventBus = require('./eventBus');

eventBus.on('userCreated', (user) => {
  console.log('Sending welcome email to', user.email);
});
```

`userController` and `emailService` are now loosely coupled. They communicate via events without direct dependency.

## Benefits of Loose Coupling via Events

- **Maintainability**: Changes in one component don't directly affect others
- **Scalability**: Easy to add new event listeners without modifying existing code
- **Testability**: Components can be tested independently
- **Flexibility**: Components can be easily replaced or modified
- **Decoupling**: Reduces dependencies between different parts of the system