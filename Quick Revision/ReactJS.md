# ReactJS Quick Revision

## Q&A

### Q: What is the virtual DOM?
**A:** The virtual DOM is an in-memory representation of the real DOM. When a component’s state or props change, React renders the virtual DOM first, then efficiently updates the real DOM to match. This minimizes expensive direct DOM manipulations. React’s diffing algorithm compares old and new virtual DOM trees to apply only necessary updates, making rendering more performant for dynamic UIs.

---

### Q: What are controlled and uncontrolled components in forms?
**A:** In a controlled component, form data is handled by React state (e.g., input value set via state and updated via `onChange`). In an uncontrolled component, form data is handled by the DOM itself; you read the value with a ref when needed. Controlled components are more common because they give you full control over form data and validation via state.

---

### Q: What are actions, reducers, and the store in Redux?
**A:**  
- **Actions:** Plain JS objects describing “what happened” (e.g., `{ type: 'INCREMENT' }`).
- **Reducers:** Pure functions that take current state and an action, and return a new state (no mutation).
- **Store:** Holds the application’s state tree. Created via `createStore` or `configureStore`. Exposes methods like `getState()` and `dispatch(action)`. Dispatching runs the reducer to compute new state. Components subscribe to the store for updates. Data flow: dispatch action → reducer updates state → store notifies views.

---

### Q: What are custom hooks? Give an example use case.
**A:** Custom hooks are functions whose names start with `use` and can call other hooks inside. They extract and reuse stateful logic across components.  
**Example:**

```js
function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => localStorage.getItem(key) || initialValue);
    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);
    return [value, setValue];
}
```
Usage:  
```js
const [name, setName] = useLocalStorage('name', '');
```
This hook encapsulates logic for syncing state to localStorage.

---

### Q: What is React.memo, and when do you use it?
**A:** `React.memo` is a higher-order component that memoizes a functional component. If the props do not change, React skips re-rendering. Use it for pure functional components with expensive renders.  
**Example:**

```js
const ExpensiveTree = React.memo(function ExpensiveTree({ data }) {
    // renders complex tree
});
```
`<ExpensiveTree data={...} />` only re-renders if `data` changes.

---

### Q: Explain `useCallback` and `useMemo`.
**A:**  
- `useCallback(fn, deps)`: Memoizes a function so it only changes if dependencies change. Prevents unnecessary re-renders of child components.
- `useMemo(() => computeExpensiveValue(), deps)`: Memoizes a computed value, only recalculating if dependencies change.  
Use both for expensive computations or when passing stable references is important.

---

### Q: How do you avoid performance pitfalls with lists?
**A:**  
- Always provide stable `key` props on list items.
- Use pagination or virtualization (e.g., `react-window`) for long lists.
- Avoid heavy computation inside render loops; use `useMemo` if needed.
- Memoize event handlers/functions passed as props with `useCallback`.

---

### Q: How do you debug performance problems in React?
**A:**  
- Use React DevTools Profiler to record renders and identify slow components.
- Check for unnecessary updates (e.g., "why did this render" feature).
- Use `console.log` or custom hooks to trace renders.
- Analyze bundle size with tools like Source Map Explorer.
- Use `React.memo`, `shouldComponentUpdate`, or `useMemo` to avoid excessive re-renders.
- Consider code-splitting.

---

### Q: What are React 18’s concurrent features and how do they work?
**A:**  
- **Concurrent rendering:** React can interrupt and resume renders to keep the app responsive.
- **Automatic batching:** Groups multiple state updates into one render, even in async callbacks.
- **Transitions:** Use `useTransition` or `startTransition` to mark updates as non-urgent.
- **Suspense improvements:** Better support for data fetching and SSR.

---

### Q: What is `useTransition` vs. `startTransition`?
**A:**  
- `useTransition`: Hook returning `[isPending, startTransition]`.
- `startTransition`: Function to wrap updates.
Both mark updates as non-urgent, letting React prioritize urgent UI updates.

---

### Q: What is Suspense for data fetching?
**A:** Suspense lets components “suspend” rendering until async operations finish, showing a fallback UI.  
**Example:**
```jsx
<Suspense fallback={<Loading />}>
    <MyComponent />
</Suspense>
```
If `MyComponent` throws a Promise (internally), React shows `<Loading />` until data is ready.

---

### Q: What are React Server Components (RSC) and why use them?
**A:**  
- Render components on the server and send the result to the client, reducing JS sent to the client.
- Split app into “server-only” and “client-only” parts.
- Server components fetch data and render HTML on the server.
- Used with frameworks like Next.js.

---

### Q: What is Streaming SSR and how does React 18 improve SSR?
**A:**  
- **Streaming SSR:** Server sends HTML in chunks before the whole page is rendered.
- **React 18:** Supports streaming with `pipeToNodeWritable` or `pipeToWebWritable`.  
- **Selective hydration:** Interactive components hydrate as they arrive, improving startup performance.

---

### Q: How does automatic batching work?
**A:**  
- In React 18, multiple state updates inside any event handler or async callback are batched into a single render.
- Reduces unnecessary renders and improves performance.

---

### Q: How do you handle real-time data (e.g., WebSockets) in React?
**A:**  
- Use `useEffect` to establish a WebSocket/subscription on mount, and clean up on unmount.
- For larger apps, use context or a store to share real-time data.
- Libraries like Socket.IO or Pusher can help.
- Throttle or debounce updates to avoid excessive rendering.

---

### Q: What emerging React features or libraries are you excited about?
**A:**  
- React 19 and beyond (new SSR, hooks, etc.)
- Server Components / Next.js 13 app router
- React Hook Form, React Query (TanStack Query), RTK Query
- Jotai, Recoil (atom-based state)
- Module Federation (Webpack 5)
- Suspense for Data Fetching
- Turborepo for monorepo management

---

## Modern React Tools & Patterns

### 1. Webpack in React.js: How & Why

**What is Webpack?**  
A module bundler that takes your app’s assets (JS, CSS, images, etc.) and produces optimized bundles for the browser.

**Why Use Webpack with React?**
- **Bundling & Code Splitting:** Combines modules, reduces HTTP requests, splits code per route.
- **Transpilation:** Integrates with Babel to transpile JSX and modern JS.
- **Asset Management:** Handles CSS, images, fonts, optimization, and inlining.
- **Development Features:** Dev server, hot-module replacement, source maps.

**How It Works**
- **Entry & Dependency Graph:** Specify entry point (e.g., `src/index.js`), Webpack builds dependency graph.
- **Loaders:** Transform files (e.g., Babel loader for JSX, CSS loader).
- **Plugins:** Hook into build process (e.g., HtmlWebpackPlugin).
- **Output:** Emits optimized bundles.

**Example `webpack.config.js` for React:**
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    resolve: { extensions: ['.js', '.jsx'] },
    module: {
        rules: [
            { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(png|svg|jpg)$/, type: 'asset' },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html' }),
    ],
    devServer: { hot: true, port: 3000 },
};
```

---

### 2. Jotai & Recoil: Atom-Based State Libraries

**What Does “Atom-Based” Mean?**  
Atoms are independent units of state you can read/write, without a single global store.

#### Jotai

- **Core:** Each atom is a primitive piece of state, created via `atom(initialValue)`.
- **Usage:**
    ```js
    // atoms.js
    import { atom } from 'jotai';
    export const countAtom = atom(0);

    // Counter.jsx
    import { useAtom } from 'jotai';
    import { countAtom } from './atoms';

    function Counter() {
        const [count, setCount] = useAtom(countAtom);
        return (
            <button onClick={() => setCount(c => c + 1)}>
                Count: {count}
            </button>
        );
    }
    ```
- **Why Jotai?** Minimal API, fine-grained subscriptions, easy derived atoms.

#### Recoil

- **Core:** Uses atoms and selectors for derived state.
- **Usage:**
    ```js
    // state.js
    import { atom, selector } from 'recoil';

    export const textAtom = atom({ key: 'text', default: '' });
    export const charCountSelector = selector({
        key: 'charCount',
        get: ({ get }) => get(textAtom).length,
    });

    // TextInput.jsx
    import { useRecoilState, useRecoilValue } from 'recoil';
    import { textAtom, charCountSelector } from './state';

    function TextInput() {
        const [text, setText] = useRecoilState(textAtom);
        const count = useRecoilValue(charCountSelector);
        return (
            <div>
                <input value={text} onChange={e => setText(e.target.value)} />
                <p>Length: {count}</p>
            </div>
        );
    }
    ```
- **Why Recoil?** Built by Facebook, selectors for derived state, supports async selectors.

---

### 3. Module Federation (Webpack 5): Microfrontend Magic

**What Is Module Federation?**  
Allows multiple build artifacts (apps/microfrontends) to share code at runtime, loading modules from one another without bundling everything together at build time.

**Why Use Module Federation?**
- Independent deployments
- Shared dependencies (e.g., React, lodash)
- Incremental migration from monolith to microfrontends

**How It Works**
- **Host & Remote:** Host configures remotes to load at runtime; remotes expose modules.
- **Webpack Config Example:**

    **Host:**
    ```js
    new ModuleFederationPlugin({
        name: 'shell',
        remotes: {
            mfe1: 'mfe1@https://mfe1.example.com/remoteEntry.js',
        },
        shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    });
    ```

    **Remote:**
    ```js
    new ModuleFederationPlugin({
        name: 'mfe1',
        filename: 'remoteEntry.js',
        exposes: { './Widget': './src/Widget' },
        shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    });
    ```

- **Runtime Loading:**
    ```js
    import('mfe1/Widget').then(({ default: Widget }) => {
        // use <Widget /> in your app
    });
    ```

---

## Everyday Analogies

### 1. Webpack: Your “Project Tidy” Helper
- Gathers, transforms, and bundles all your code/assets.
- Splits large bundles into smaller chunks.
- Watches files and applies changes instantly during development.

### 2. Jotai & Recoil: Tiny “State” Building Blocks
- State is broken into small, independent jars (atoms).
- Components only re-render when the atoms they use change.
- Recoil adds selectors (recipes) for derived state.

### 3. Module Federation: Sharing Code Between “Mini-Apps”
- Mini-apps (microfrontends) can expose and borrow code at runtime.
- Teams can update their mini-apps independently.
- Shared libraries are downloaded once.

---

## Microfrontends & Module Federation

**Analogy:**  
A large web app is like a big department store. Microfrontends break it into smaller “shops” (features/sections) that operate independently.

**What Are Microfrontends?**
- Small, focused apps (e.g., shopping cart, user profile)
- Owned and deployed by independent teams
- Can use different tech stacks

**Why Use Microfrontends?**
- Team autonomy and speed
- Scalability
- Independent deployments

**Where Module Federation Comes In**
- Webpack 5’s Module Federation lets microfrontends share code at runtime.
- Expose and consume widgets/utilities between remotes and hosts.
- Shared libraries are deduplicated.
- Each microfrontend ships its own bundle; host loads them on demand.

**Why Module Federation Was Developed**
- Avoid monolith rebuilds
- Keep teams independent
- Optimize loading (only download what’s needed)

**Simple Analogy:**  
- Without microfrontends: One giant cookbook, every chef edits the same recipe.
- With microfrontends: Separate recipe cards, each chef owns their card and borrows common ingredients from a shared pantry.

**Bottom line:**  
Microfrontends split your frontend into independently built and deployed pieces. Module Federation ties them together—sharing code and loading features on demand for maintainable, performant, and team-friendly big apps.
