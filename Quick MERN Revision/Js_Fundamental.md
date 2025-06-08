## 🧠 What is a Closure?

A **closure** is a function that remembers variables from its outer (enclosing) scope, even after that outer function has finished executing.

---

### ✅ Real-World Use Cases of Closures

- **Data privacy (encapsulation)**
- **Memoization (caching results)**
- **Event handlers (preserve state)**
- **Currying**

---

### 1. Data Privacy / Encapsulation

```js
function createCounter() {
    let count = 0; // private variable

    return {
        increment() {
            count++;
            return count;
        },
        decrement() {
            count--;
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
```

> **🔒 Why this works:**  
> `increment` and `decrement` form closures over the `count` variable.

---

```js
function createBankAccount(owner) {
    let balance = 0;

    return {
        deposit(amount) {
            if (amount > 0) balance += amount;
        },
        withdraw(amount) {
            if (amount <= balance) balance -= amount;
            else console.log("Insufficient funds");
        },
        getBalance() {
            return balance;
        },
        getOwner() {
            return owner;
        }
    };
}

const account = createBankAccount("Alice");
account.deposit(500);
account.withdraw(100);
console.log(account.getBalance()); // 400

console.log(account.balance); // undefined (private)
```

> **Why it matters:**  
> `balance` and `owner` are inaccessible directly — they are truly private via closure.

---

```js
function configManager(initialConfig) {
    const config = { ...initialConfig };

    return {
        get(key) {
            return config[key];
        },
        set(key, value) {
            config[key] = value;
        }
    };
}

const config = configManager({ env: "dev", debug: true });

console.log(config.get("env")); // dev
config.set("env", "prod");
console.log(config.get("env")); // prod

console.log(config.config); // undefined – config is private
```

---

## ✅ What is the Event Loop?

The **event loop** in JavaScript enables non-blocking I/O by offloading async operations (like `setTimeout`, network requests, or promises) to the Node.js runtime or browser APIs.

Once these tasks complete, their callbacks are placed in queues, and the event loop coordinates execution.

---

### ✅ Task Queues

- **Call Stack:** Where JS code is executed, line by line.
- **Microtask Queue (High Priority):**
    - Includes: Promises, async/await, `queueMicrotask`
- **Macrotask Queue (Lower Priority):**
    - Includes: `setTimeout`, `setInterval`, `setImmediate`

---

### 🔄 How It Works

1. JS runs sync code in the call stack.
2. Async tasks are offloaded.
3. When stack is empty, event loop:
     - First checks the microtask queue (runs all of them)
     - Then picks one macrotask

---

### 🧪 Example

```js
console.log('Start');

setTimeout(() => console.log('Timeout'), 0);

Promise.resolve().then(() => console.log('Promise'));

console.log('End');
```

**Output:**
```
Start
End
Promise
Timeout
```
✔️ Promise runs before timeout due to microtask priority.


## ✅ What is Hoisting?

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope before code execution.  
> Only declarations are hoisted—not initializations.

---

### 🔎 How It Works

#### `var`
- **Hoisted and initialized as `undefined`**

```js
console.log(x); // undefined
var x = 10;
```

#### `let` / `const`
- **Hoisted but _not_ initialized**
- Exist in a _Temporal Dead Zone (TDZ)_ from the start of the block until the declaration is evaluated

```js
console.log(y); // ReferenceError
let y = 20;
```

#### Function Declarations
- **Fully hoisted** (both name and body)

```js
sayHi(); // "Hi"
function sayHi() {
    console.log('Hi');
}
```

#### Function Expressions
- **Only variable name is hoisted** (as `undefined`)

```js
greet(); // TypeError: greet is not a function
var greet = function () {
    console.log('Hello');
};
```



## 🔐 What is `#` in JavaScript?

The `#` symbol is used to declare **truly private fields or methods** inside a class. These members are inaccessible from outside the class—not even via `this`, and not by accident.

Introduced in ES2022 (ES Next), and now widely supported in modern JavaScript engines.

---

### ✅ Example: Private Field with `#`

```js
class Counter {
    #count = 0; // private field

    increment() {
        this.#count++;
    }

    getCount() {
        return this.#count;
    }
}

const c = new Counter();
c.increment();
console.log(c.getCount()); // 1

console.log(c.#count); // ❌ SyntaxError: Private field '#count' must be declared in an enclosing class
```

---

### 🆚 Public vs Private in Class

```js
class User {
    name = "Public Name";     // public
    #password = "secret123";  // private

    getPassword() {
        return this.#password;
    }
}

const u = new User();
console.log(u.name);          // ✅ "Public Name"
console.log(u.getPassword()); // ✅ "secret123"
console.log(u.#password);     // ❌ SyntaxError
```

---

### 🔧 Private Methods

You can also define private methods:

```js
class Bank {
    #validateAmount(amount) {
        return typeof amount === 'number' && amount > 0;
    }

    deposit(amount) {
        if (this.#validateAmount(amount)) {
            console.log("Deposited:", amount);
        } else {
            console.log("Invalid amount");
        }
    }
}

const b = new Bank();
b.deposit(100);        // ✅ Deposited: 100
b.#validateAmount(100); // ❌ Error
```

---

### 🧠 Why Use `#`?

| Reason                | Explanation                                      |
|-----------------------|--------------------------------------------------|
| True privacy          | Fields and methods are inaccessible from outside |
| Better encapsulation  | Prevent accidental access or modification        |
| Safer APIs            | Only expose what’s necessary                     |
| Avoid naming conflicts| Private fields are isolated to the class         |

---

### ⚠️ Notes and Caveats

- Must declare private fields at the top of the class.
- Can't access them dynamically (e.g., `this['#field']` doesn't work).
- Not the same as `_field`, which is just a naming convention (still public).
- Not usable outside a class—closures are still better for functional modules.

---

### ✅ Real Use Case: Auth Token Handler

```js
class AuthToken {
    #token;

    constructor(token) {
        this.#token = token;
    }

    getToken() {
        return this.#token;
    }
}

const session = new AuthToken("abc123");
console.log(session.getToken()); // ✅ "abc123"
console.log(session.#token);     // ❌ Error: Private field
```

---

### 🧪 Browser / Runtime Support

- ✅ Supported in modern browsers (Chrome, Edge, Firefox, Safari)
- ✅ Node.js v12+
- ❌ Not supported in older browsers without transpilation

> Use Babel or TypeScript with appropriate plugins if you need backwards compatibility.



## 🔍 What is `this` in JavaScript?

`this` refers to the execution context of a function — the object that is “calling” or “owning” the function at runtime.

---

### 🧠 How `this` is Determined — Rules by Context

#### 1. **Global Context (Outside Any Function)**

```js
console.log(this); 
// In browsers: Window
// In Node.js: {}
```

---

#### 2. **Inside a Regular Function**

```js
function show() {
    console.log(this);
}
show(); 
// Non-strict mode: global object (window or global)
// Strict mode: undefined
```

---

#### 3. **Inside an Object Method**

```js
const obj = {
    name: 'Alice',
    greet() {
        console.log(this.name);
    }
};
obj.greet(); // this → obj → "Alice"
```

---

#### 4. **Inside a Function Assigned from Outside**

```js
function greet() {
    console.log(this.name);
}
const user = { name: 'Bob', greet };
user.greet(); // this → user

const ref = user.greet;
ref(); // this → undefined (strict mode), or global (non-strict)
```

---

#### 5. **Constructor Function**

```js
function User(name) {
    this.name = name;
}
const u = new User('Alice');
console.log(u.name); // "Alice"
// When using `new`, `this` refers to the newly created object.
```

---

#### 6. **Arrow Functions (Lexical `this`)**

```js
const obj = {
    name: 'Alice',
    greet: () => {
        console.log(this.name);
    }
};
obj.greet(); // undefined, because arrow functions don’t have their own `this`
```
> ⚠️ Arrow functions do **not** bind their own `this` — they inherit it from the surrounding lexical scope.

---

#### 7. **Event Listeners in Browser**

```js
document.querySelector('button').addEventListener('click', function () {
    console.log(this); // The button element
});
```

If you use an arrow function:

```js
document.querySelector('button').addEventListener('click', () => {
    console.log(this); // `this` is inherited, likely `window`
});
```

---

### 🔧 **Explicit Binding with `call`, `apply`, `bind`**

- **`call` and `apply`** — invoke immediately with specified `this`:

```js
function sayHello() {
    console.log(this.name);
}

const person = { name: 'Charlie' };
sayHello.call(person);  // Charlie
sayHello.apply(person); // Charlie
```

- **`bind`** — returns a new function with bound `this`:

```js
const boundFn = sayHello.bind(person);
boundFn(); // Charlie
```

---

### 🚨 **Common Mistakes**

#### ❌ Losing `this` in Callbacks

```js
const obj = {
    name: 'Nina',
    greet() {
        setTimeout(function () {
            console.log(this.name); // undefined
        }, 1000);
    }
};
```

#### ✅ Fix with Arrow Function (Lexical `this`)

```js
const obj = {
    name: 'Nina',
    greet() {
        setTimeout(() => {
            console.log(this.name); // Nina
        }, 1000);
    }
};
```

---

### 🧪 **In Node.js Context**

- In Node.js, the global object is `global`, not `window`.

```js
console.log(this); // {} (module scope)

function show() {
    console.log(this); // undefined (in strict mode)
}
show();
```


## ✅ What is a Promise in JavaScript?

A **Promise** is a built-in JavaScript object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.

---

### 🌀 Promise Lifecycle

- **Pending:** Initial state; the operation hasn't completed yet.
- **Fulfilled:** Operation completed successfully.
- **Rejected:** Operation failed with an error.

A Promise can only transition from _pending_ → _fulfilled_ or _pending_ → _rejected_. Once settled, its state is immutable.

---

### 🧩 Syntax Example

```js
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Data received");
    }, 1000);
});

promise
    .then(data => console.log(data))        // runs if resolved
    .catch(error => console.error(error))   // runs if rejected
    .finally(() => console.log("Done"));    // runs no matter what
```

```js
// Polyfill for Array.prototype.includes

if (!Array.prototype.myIncludes) {
    Array.prototype.myIncludes = function (searchElement, fromIndex) {
        // Uncomment the next line to throw if array is null or undefined
        // if (this == null) throw new TypeError("this array is null or undefined");

        let arr = this;
        let length = arr.length;

        if (length === 0) return false;

        let currentIndex = fromIndex | 0;

        while (currentIndex < length) {
            let current = arr[currentIndex];
            if (
                current === searchElement ||
                (typeof current === 'number' &&
                    typeof searchElement === 'number' &&
                    isNaN(current) &&
                    isNaN(searchElement))
            ) {
                return true;
            }
            currentIndex++;
        }
        return false;
    };
}

let arr = [1, 2, 3];

console.log(arr.myIncludes(2)); // true
```



# Understanding `call`, `apply`, and `bind` in JavaScript/Node.js

These three methods are used to control the context (`this`) in which a function executes.

---

## 🔹 `call()`

Immediately invokes the function with a given `this` context and arguments provided individually.

```js
function greet(greeting) {
    console.log(`${greeting}, my name is ${this.name}`);
}

const person = { name: "Alice" };

greet.call(person, "Hello"); // Hello, my name is Alice
```

---

## 🔹 `apply()`

Same as `call()`, but arguments are passed as an array.

```js
greet.apply(person, ["Hi"]); // Hi, my name is Alice
```

---

## 🔹 `bind()`

Returns a new function with a bound `this` context. It does **not** execute immediately.

```js
const boundGreet = greet.bind(person);
boundGreet("Hey"); // Hey, my name is Alice
```

---

## 🧠 Mental Model

Think of `this` as the owner of data.

- `call`, `apply`, and `bind` let you borrow functions and control `this`.

---

# Real-World Node.js Examples

## 1. `call()` — Logging Middleware with Custom Context

Imagine a logging utility function you want to reuse with multiple modules.

```js
function log(level, message) {
    console.log(`[${level}] [${this.moduleName}]: ${message}`);
}

const authModule = { moduleName: "Auth" };
const paymentModule = { moduleName: "Payment" };

log.call(authModule, "INFO", "User login success");
log.call(paymentModule, "ERROR", "Payment failed");
```

**Why is this real-world?**

- Centralize logging, but need different module names (`this.moduleName`).
- Avoid hard-coding context.

---

## 2. `apply()` — Calling with Dynamic Arguments

Suppose you’re building an analytics tracker and receive arguments as an array from an API.

```js
function track(event, userId, timestamp) {
    console.log(`[${this.system}] Tracking: ${event}, User: ${userId}, Time: ${timestamp}`);
}

const trackerContext = { system: "AnalyticsService" };
const argsFromRequest = ["login_attempt", "u123", "2025-06-03T12:00:00Z"];

track.apply(trackerContext, argsFromRequest);
```

**Why is this real-world?**

- Dynamic data often comes as arrays from APIs or logs.
- `apply()` lets you unpack arrays to function arguments easily.

---

## 3. `bind()` — Preserve Context in Functional Callbacks

Suppose you're writing a mail-sending service and want to bind a function reused in callbacks like `setTimeout`, event handlers, or async loops.

```js
function sendEmail() {
    console.log(`Sending email to ${this.email}`);
}

const user = { email: "user@example.com" };

// Delayed send, but `this` would be lost without `bind`
const delayedSend = sendEmail.bind(user);

setTimeout(delayedSend, 1000);
```

> **Key Point:**  
> `bind` is functional: it returns a new function with `this` pre-attached. Useful in higher-order functions, retry logic, etc.

---

## 🎯 Bonus Memory Tip

Think of these like you're "hiring" a function to work for a different object:

- **call:** "Come work for me now (I’ll tell you your tools one-by-one)."
- **apply:** "Come work for me now (I’ll give you your tools in a backpack)."
- **bind:** "Here’s a job offer — come later, and remember you work for me."

---

## When Should You Use `.bind()`?

You only need `bind()` in specific real-world situations where:

1. You can’t (or don’t want to) pass arguments manually  
     _Example: Passing the function as a reference to `setTimeout`, `EventEmitter`, `Promise.then()`, etc., but can’t pass arguments there._

**🔑 Rule of Thumb:**  
Use `bind()` only if your function uses `this` internally and you can’t (or shouldn’t) pass an argument manually.








## More Examples of `bind()`

### 1. Understanding `bind` with Function Context

```js
function f() {
    console.log(this);
}

const user = {
    g: f.bind(null)
};

user.g();
```

**What’s the output?**

- **Output:** `null` (or the global object in non-strict mode)
- **Explanation:** `bind(null)` sets `this` to `null`, so when `g` is called, `this` is `null`.

---

### 2. Partial Application with `bind`

```js
function multiply(a, b) {
    return a * b;
}

const double = multiply.bind(null, 2);
console.log(double(5));
```

**What’s the output?**

- **Output:** `10`
- **Explanation:** `bind` creates a new function `double` where `a` is fixed to `2`. Calling `double(5)` multiplies `2` and `5`.





