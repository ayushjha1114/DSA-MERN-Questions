## ❓ Where does Redux store state?

Redux does **not** store state in the browser (like `localStorage`, `sessionStorage`, or browser memory by default), nor in React’s fiber tree.

**✅ Redux stores state in JavaScript memory, in a centralized object called the _store_.**

---

### 🔹 What is the store?

When you call:

```js
const store = createStore(reducer);
```

Redux creates a plain JavaScript object in memory that holds your state tree. For example:

```js
{
    user: { name: 'Zeus' },
    cart: [ { id: 1, quantity: 2 } ],
}
```

This state is stored in RAM as long as your app is running. It's **not** tied to the DOM, browser storage, or React’s internal Fiber tree.

---

### 🔄 How does Redux interact with React?

- React components **subscribe** to the Redux store.
- When the store state updates, the connected components **re-render** using the new state.
- React is still responsible for rendering the UI using the state from Redux.
- The React Fiber tree manages how React renders and updates the DOM, but it **doesn't own Redux state**.

---

### 🧠 So, to clarify:

| Aspect                | Where it lives                              |
|-----------------------|---------------------------------------------|
| Redux State           | JavaScript memory (in the Redux store)      |
| React Component State | Inside React (managed by Fiber)             |
| Browser Storage       | Only if you persist Redux state manually    |
| DOM / UI Rendering    | Managed by React Fiber                      |

---

### 🔄 Redux by default

- State is stored in memory.
- When you refresh the browser, memory is cleared → **Redux state is lost.**

---

### ✅ Solution: Use `redux-persist`

[`redux-persist`](https://github.com/rt2zz/redux-persist) is a library that automatically saves Redux state to persistent storage (like `localStorage` or `sessionStorage`) and rehydrates it when the app reloads.

---

### 📦 Step-by-step: How redux-persist works

1. **Persist the Redux store:**  
     It saves a serialized version of your Redux state into `localStorage` (or another storage engine) whenever the state changes.

2. **Rehydrate on app startup:**  
     When your app reloads, redux-persist reads from storage and re-initializes the Redux store with the saved state.

---

### 🔧 Code Example

#### 1. Install packages

```bash
npm install redux-persist
```

#### 2. Configure your store

```js
// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import rootReducer from './reducers';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
```

#### 3. Wrap your app with `PersistGate`

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);
```


# 🔹 Part 1: How Redux Internally Works

Redux is a predictable state container for JavaScript apps, especially popular with React. Internally, Redux follows a unidirectional data flow pattern and is based on three core principles:

### ✅ Core Principles

- **Single source of truth:** All app state is stored in one object tree inside a single store.
- **State is read-only:** The only way to change the state is by dispatching an action.
- **Changes are made with pure functions:** Reducers describe how the state is transformed in response to actions.

---

### 🔁 Redux Internal Workflow (Step-by-step)

#### 1. Store Creation

```js
import { createStore } from 'redux';
const store = createStore(reducer);
```

Internally, `createStore` sets up:

- The current state
- The reducer function
- A subscriber list (to notify listeners on state change)

#### 2. Dispatching Actions

```js
store.dispatch({ type: 'INCREMENT' });
```

- `dispatch` is a core method of the Redux store.
- When an action is dispatched:
    - The action goes into the reducer.
    - Reducer returns a new state object based on action type and payload.
    - Store updates its internal state.
    - All subscribers (`store.subscribe`) are notified.

#### 3. Reducer Function

```js
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT': return state + 1;
        case 'DECREMENT': return state - 1;
        default: return state;
    }
}
```

- **Pure function:** No side effects, returns the same output for the same input.

---

## 🔌 Part 2: Redux Middleware (Thunk & Saga)

Middleware in Redux sits between `dispatch()` and the reducer. They are used to handle side effects like async calls, logging, or conditional dispatch.

### ✅ How Redux Middleware Works Internally

When you apply middleware:

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));
```

- The `applyMiddleware` function enhances the dispatch method.

Internally:

```js
const middlewareAPI = {
    getState: store.getState,
    dispatch: (action) => store.dispatch(action),
};

const chain = middlewares.map(middleware => middleware(middlewareAPI));
const enhancedDispatch = compose(...chain)(store.dispatch);
```

- Each middleware receives the store’s `dispatch` and `getState`, and returns a new function that wraps around dispatch.

---

### 🧠 Redux Thunk (Simple, Logic-based)

**What it does:**  
Allows action creators to return functions, instead of plain action objects.

**Example:**

```js
const fetchData = () => {
    return async (dispatch, getState) => {
        dispatch({ type: 'LOADING' });
        const data = await fetch('/api/data').then(res => res.json());
        dispatch({ type: 'SUCCESS', payload: data });
    };
};
```

**Internals of redux-thunk:**

```js
const thunk = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState); // this is your async logic
    }
    return next(action); // otherwise pass it to reducer
};
```

> **Key point:** Enables basic async logic inside actions. Ideal for small to medium apps.

---

### 🧠 Redux Saga (Advanced, Generator-based)

**What it does:**  
Uses generator functions to handle side effects in a more controlled, testable way.

- Follows "sagas" — long-running background processes that react to dispatched actions.

**Example:**

```js
function* fetchDataSaga() {
    yield takeEvery('FETCH_DATA', function* () {
        try {
            const data = yield call(fetch, '/api/data');
            const json = yield data.json();
            yield put({ type: 'SUCCESS', payload: json });
        } catch (err) {
            yield put({ type: 'ERROR', error: err });
        }
    });
}
```

**How it works:**

- `takeEvery` listens for every dispatched action of a given type.
- `call` and `put` are saga effects:
    - `call(fn, ...args)` = call a function like `await`
    - `put(action)` = dispatch an action

**Internals (Simplified):**

Redux-Saga creates a middleware function that runs generator functions (sagas).  
These functions yield side effects (`call`, `put`, `take`) which are interpreted by the saga middleware.

```js
function sagaMiddleware({ dispatch, getState }) {
    return next => action => {
        // run the saga if needed
        return next(action); // pass to reducer
    };
}
```

> **Key point:** Great for complex workflows, like cancelation, retries, debouncing, sequences, or background sync.

---

## 🔄 Comparison: Thunk vs Saga

| Feature            | Thunk                        | Saga (redux-saga)                |
|--------------------|-----------------------------|----------------------------------|
| Syntax             | Functions (async/await)      | Generator functions (`function*`)|
| Learning Curve     | Low                          | High                             |
| Debuggability      | Harder to trace complex flows| Easier due to step-by-step yielding |
| Code Structure     | Imperative                   | Declarative                      |
| Control over Flow  | Basic                        | Advanced (cancel, debounce, race)|
| Best For           | Simple to medium async logic | Complex, long-running effects    |

---

## 🔚 Summary

- **Redux:** Predictable, unidirectional state container.
- **Middleware:** Lets you intercept or augment the dispatch.
- **Thunk:** Simpler, function-based async logic.
- **Saga:** Advanced, generator-based, powerful for complex async workflows.


### Note- redux stores it states in memory not in browser or reactjs fiber or dom. if you want to persist the data use `react-persist` it will store the data in localstorage and in logout, session-expiry and tab/browser close manually clear the state from localstorage.