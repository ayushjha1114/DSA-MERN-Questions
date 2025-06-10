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