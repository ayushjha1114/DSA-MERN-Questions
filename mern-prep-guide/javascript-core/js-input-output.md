## Output of Code Snippets

### 1. What is the output of the following code?

```js
// console.log("console.log 1")
setTimeout(() => {
    console.log('setTimeout 1');
    Promise.resolve().then(() => {
        console.log('promise inside setTimeout');
    });
}, 0);
```

---

### 2. What is the output of the following code?

```js
setImmediate(() => {
    console.log('setimmediate');
});
Promise.resolve().then(() => {
    console.log('promise 1');
});
process.nextTick(() => {
    console.log('nextTick');
});
console.log('console log 2');
```

---

### 3. What is the output of the following code?

```js
// function test(){
let count = 0;
return function() {
    return count++;
}
}
let x = test();
console.log(x());
```

---

## Question

**Write a callback code & convert it to async/await & promises.**

---

### Using Callback

```js
function fetchData(callback) {
    setTimeout(() => {
        callback('DATA LOADED!');
    }, 3000);
}

fetchData(data => {
    console.log('Using callback', data);
});
```

---

### Using Promises

```js
function fetchData1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('DATA LOADED!');
        }, 3000);
    });
}

fetchData1()
    .then(data => {
        console.log('Using promise', data);
    })
    .catch(error => {
        console.log(error);
    });
```

---

### Using Async/Await

```js
function fetchData2() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('DATA LOADED!');
        }, 3000);
    });
}

async function main() {
    const data = await fetchData2();
    console.log('Using Async/await', data);
}

main();
```


```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
    .then(values => console.log(values)) // Output: [1, 2, 3]
    .catch(err => console.error(err));
```

🔍 **Explanation:**  
`Promise.all()` takes an array of promises and returns a new promise.  
- It resolves when **all** input promises resolve, and gives an array of results.
- If **any** one promise rejects, the whole thing rejects.

✅ **Output:**
```bash
[1, 2, 3]
```

---

```js
const p4 = Promise.resolve(1);
const p5 = Promise.resolve(2);
const p6 = Promise.reject('Something went wrong');

Promise.all([p4, p5, p6])
    .then(values => console.log('Resolved values:', values))
    .catch(err => console.error('Caught error:', err));
```

**Output:**
```bash
Caught error: Something went wrong
```



## 👩‍🏫 The Code

```js
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i + 1), 1000);
}
```

When it executed, looks like this-

```js
var i = undefined // due to hoisting
for (i = 0; i < 3; i++) {
    setTimeout(() => console.log(i + 1), 1000);
}
```


---

## 🧠 Key Concepts You Need to Know

- `var` is **not block scoped** – all loop iterations share the same `i`.
- `setTimeout` is **asynchronous** – it runs later, not immediately.
- By the time the timeout runs, the loop has already finished.

---

## 🪜 Step-by-Step Breakdown

### 🔁 Step 1: Loop Starts

| i value | What is scheduled (setTimeout)                |
|---------|-----------------------------------------------|
| 0       | Schedule `console.log(i + 1)` after 1 second  |
| 1       | Schedule `console.log(i + 1)` after 1 second  |
| 2       | Schedule `console.log(i + 1)` after 1 second  |

> None of those `console.log` statements run yet. They are scheduled to run later (after 1 second).

---

### 🛑 Step 2: Loop Ends

- After the 3rd loop:
  - `i` becomes 3
  - Loop stops
- Now `i` is 3, and it stays 3 when the timeout functions run.

---

### ⏱ Step 3: After 1 Second

All 3 `setTimeout()` callbacks now run — but they all use the same `i` (because `var` doesn't make a new `i` for each loop).

```js
console.log(i + 1) // → console.log(3 + 1) → 4
```
This happens 3 times.

---

## 🧾 Final Output

```
4
4
4
```

---

## 🧠 How to Remember It

- ✅ `var` is shared — it's like giving everyone the same note that says “check i later.”
- ❌ But no one saved what `i` was at the time.

> By the time they check the note (after 1 second), `i = 3`, so they all say `3 + 1 = 4`.

---

## ✅ Code with `let`

```js
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i + 1), 1000);
}
```

if you want let to perform have way like var to print 4 thrice

```js
let i = undefined;
for (i = 0; i < 3; i++) {
    setTimeout(() => console.log(i + 1), 1000);
}
```

---

### 🔍 Step-by-Step Explanation

#### 🧠 Key Concept

- `let` is **block-scoped**, meaning each loop gets its own copy of `i`.
- `setTimeout` runs the code after 1 second, not immediately.

---

#### 🪜 Step 1: Loop Starts

| Iteration | i value | What is scheduled         |
|-----------|---------|--------------------------|
| 1st       | 0       | Schedule `console.log(1)`|
| 2nd       | 1       | Schedule `console.log(2)`|
| 3rd       | 2       | Schedule `console.log(3)`|

> Thanks to `let`, each scheduled function remembers its own version of `i`.

---

#### ⏱ Step 2: After 1 Second

All three `console.log(i + 1)` functions now run:

1. First logs `1`
2. Second logs `2`
3. Third logs `3`

---

## 🧾 Final Output

```
1
2
3
```



```js
function mystery() {
    console.log(typeof a);
    var a = 42;
}

mystery();
```
👉 **What will be the output? Why?**

**✅ Correct Answer:** `undefined`  
**🔍 Explanation:**  
`var a` is hoisted to the top of the function scope, so the code behaves as if written:
```js
function mystery() {
    var a;
    console.log(typeof a); // 'undefined'
    a = 42;
}
```
`typeof undefined` → `"undefined"`

Many developers mix this up with `typeof null` (which is `'object'`).

**🧠 Side Tip:**
```js
typeof undefined       // 'undefined'
typeof null            // 'object'  ❗
typeof []              // 'object'
typeof {}              // 'object'
typeof function(){}    // 'function'
```

---

```js
function counter() {
    var count = 0;
    return {
        inc: function () {
            count++;
            console.log(count);
        },
        dec: function () {
            count--;
            console.log(count);
        }
    };
}

const c1 = counter();
const c2 = counter();

c1.inc(); // ?
c1.inc(); // ?
c2.dec(); // ?
```

❓ **Why does `c1.inc()` print 2 the second time?**  
Because both calls are using the same `counter()` closure instance, i.e., the same object `c1`.

```js
const c1 = counter();  // ✅ New closure: count = 0
c1.inc();              // count becomes 1 → prints 1
c1.inc();              // count becomes 2 → prints 2

const c2 = counter();  // ✅ Another closure: count = 0 (fresh)
c2.dec();              // count becomes -1 → prints -1
```

---

```js
var a = 10;

function outer() {
    console.log("Outer:", a);
    var a = 20;

    function inner() {
        console.log("Inner:", a);
    }

    return inner;
}

const fn = outer();
fn();
```
👉 **What will be the output and why?**

**✅ Final Output:**
```
Outer: undefined
Inner: 20
```

**🔍 Explanation:**  
- `var a` inside `outer` is hoisted, so at `console.log("Outer:", a)`, the local `a` exists but is `undefined`.
- After assignment, `a = 20`.
- `inner` closes over the local `a`, so logs `20`.

**🧠 Rule to Remember:**  
In JavaScript, `var` is hoisted and function-scoped. If you declare `var a` inside a function, it shadows any outer `a`, even before its line is executed.

---

```js
const obj = {
    value: 42,
    logLater: function () {
        for (var i = 0; i < 3; i++) {
            setTimeout(function () {
                console.log(i, this.value);
            }, i * 1000);
        }
    }
};

obj.logLater();
```
👉 **What will be printed and why?**  
(Explain both the value of `i` and `this.value` in the output.)

**✅ Actual Output:**
```
3 undefined
3 undefined
3 undefined
```

**🔍 Explanation:**  
- `i` is declared with `var`, so it's function-scoped. By the time the callbacks run, `i` is `3`.
- Inside `setTimeout(function () { ... })`, `this` is not bound to `obj` (it's `window` in non-strict mode, or `undefined` in strict mode).  
- So `this.value` is `undefined` unless `window.value` is set.

**🟢 Fixes:**
- Use `let i` for block scoping.
- Use arrow functions or `.bind(this)` to preserve `this`.


```js
console.log("begins");

setTimeout(() => {
    console.log("setTimeout 1");
    Promise.resolve().then(() => {
        console.log("promise 1");
    });
}, 0);

new Promise(function (resolve, reject) {
    console.log("promise 2");
    setTimeout(function () {
        console.log("setTimeout 2");
        resolve("resolve 1");
    }, 0);
}).then((res) => {
    console.log("dot then 1");
    setTimeout(() => {
        console.log(res);
    }, 0);
});
```

**Expected Output:**
```
begins
promise 2
setTimeout 1
promise 1
setTimeout 2
dot then 1
resolve 1
```


You want to implement a function that allows flexible currying and argument grouping, so that all of the following calls:

```js
b(1)(2, 3)
b(1, 2, 3)
b(1, 2)(3)
```

will ultimately invoke the callback `cb(x, y, z)` with the same arguments.

---

## Solution

```js
const a = (cb) => {
  const requiredArgs = 3;

  const collectArgs = (...argsSoFar) => {
    return (...newArgs) => {
      const allArgs = [...argsSoFar, ...newArgs];
      if (allArgs.length >= requiredArgs) {
        cb(...allArgs.slice(0, requiredArgs));
      } else {
        return collectArgs(...allArgs); // keep collecting
      }
    };
  };

  return collectArgs();
};

// Usage
const cb = (x, y, z) => {
  console.log('it is callbacl', x, y, z);
};

const b = a(cb);

b(1)(2, 3);      // it is callbacl 1 2 3
b(1, 2, 3);      // it is callbacl 1 2 3
b(1, 2)(3);      // it is callbacl 1 2 3
```

---

### How it works

- The outer function `a(cb)` sets up a closure to collect arguments.
- `collectArgs(...argsSoFar)` keeps accumulating arguments until we have 3.
- Once 3 or more arguments are collected, it calls the callback with only the first 3.
- If not enough arguments yet, it returns a new curried function expecting more.




## Classic Advanced JavaScript Closure and Currying Problem

You want a function such that:

```js
add(1)(2)(3)(4) // → 10
```

and it should dynamically handle any number of parameters:

```js
add(1)(2)(3)(4)(5)(6) // → 21
```

Let’s break it down and then write the final dynamic solution 👇

---

### ✅ Dynamic Curried Add Function

Here’s a clean and dynamic implementation:

```js
function add(a) {
    function inner(b) {
        if (b) return add(a + b);
        return a;
    }
    inner.toString = () => a;
    return inner;
}

console.log(add(1)(2)(3)(4)); // or use console.log(String(add(1)(2)(3)(4)));
```














































