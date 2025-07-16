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


















































# ---------------------SQL Interview Queries ----------------------------

## Employees Table

```sql
CREATE TABLE Employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department VARCHAR(100),
  salary INT,
  join_date DATE
);
```

**Query:** Find the top 3 highest-paid employees in the 'Engineering' department, ordered by salary descending.

```sql
SELECT id, name, salary
FROM Employees
WHERE department = 'Engineering'
ORDER BY salary DESC
LIMIT 3;
```

---

## Orders and Customers Tables

```sql
CREATE TABLE Orders (
  id INT PRIMARY KEY,
  customer_id INT,
  order_date DATE,
  amount DECIMAL
);

CREATE TABLE Customers (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  region VARCHAR(50)
);
```

**Query:** Find the total order amount for each customer in the 'West' region.  
Return: `customer_name`, `total_amount` — order by total descending.

```sql
SELECT c.name AS customer_name, SUM(o.amount) AS total_amount
FROM Customers c
JOIN Orders o ON c.id = o.customer_id
WHERE c.region = 'West'
GROUP BY c.name
ORDER BY total_amount DESC;
```



## Get the 5th Highest Salary from an Employee Table

To retrieve only the 5th highest **distinct** salary from an `employee` table, you can use the following SQL queries:

### Query 1

```sql
SELECT DISTINCT salary
FROM employee
ORDER BY salary DESC
LIMIT 1 OFFSET 4;
```

**Explanation:**
- `ORDER BY salary DESC`: Sorts salaries from highest to lowest.
- `DISTINCT`: Removes duplicates (important if multiple employees have the same salary).
- `LIMIT 1 OFFSET 4`: Skips the top 4 and returns the 5th one.

**Example:**  
If salaries are: `100k, 90k, 90k, 80k, 70k, 60k`,  
then the 5th distinct highest salary is **70k**.

---

### Query 2

```sql
SELECT MIN(salary) AS fifth_highest_salary
FROM (
    SELECT DISTINCT salary
    FROM employee
    ORDER BY salary DESC
    LIMIT 5
) AS top5;
```

**Explanation:**
- **Inner query:** Fetches the top 5 distinct salaries in descending order.
- **Outer query:** Picks the smallest one out of those — i.e., the 5th highest.



## ✅ General SQL Query to Find Duplicates

```sql
SELECT column1, column2, COUNT(*)
FROM table_name
GROUP BY column1, column2
HAVING COUNT(*) > 1;
```
> Replace `column1, column2` with the columns that should be unique together.

---

### 🔍 Example: Find Duplicate Emails in `users` Table

```sql
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

---

### 🧾 Example: Find Full Duplicate Rows

If you want to find all columns duplicated (entire row repeated):

```sql
SELECT *, COUNT(*)
FROM users
GROUP BY id, name, email -- or all columns
HAVING COUNT(*) > 1;
```

---

## ✅ 1. Using LIMIT and OFFSET (MySQL, PostgreSQL)

```sql
-- 3rd highest salary (N = 3)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;
```
- `OFFSET N-1`: Skips the top N−1 salaries  
- `LIMIT 1`: Picks the N-th salary




## Employee Salary Data

| EMPID | SAL  | Month | Year |
|-------|------|-------|------|
| 1     | 1000 | 1     | 2024 |
| 1     | 3000 | 2     | 2024 |
| 1     | 2000 | 3     | 2024 |
| 1     | 1000 | 4     | 2024 |
| 2     | 2000 | 1     | 2024 |
| 2     | 500  | 2     | 2024 |
| 2     | 400  | 3     | 2024 |
| 2     | 1000 | 4     | 2024 |
| 3     | 700  | 1     | 2024 |
| 3     | 500  | 2     | 2024 |
| 3     | 400  | 3     | 2024 |
| 3     | 2000 | 4     | 2024 |

---

### Question

**Which employee receives the maximum salary for the first quarter (Q1) of 2024?**

- **Q1 months:** January, February, March (Month 1, 2, 3)

---

### SQL Query

```sql
SELECT EMPID, SUM(SAL) AS total_q1_salary
FROM Employee
WHERE Month IN (1, 2, 3) AND Year = 2024
GROUP BY EMPID
ORDER BY total_q1_salary DESC
LIMIT 1;
```

---

### Step-by-step Calculation

| EMPID | Month 1 | Month 2 | Month 3 | Q1 Total |
|-------|---------|---------|---------|----------|
| 1     | 1000    | 3000    | 2000    | 6000     |
| 2     | 2000    | 500     | 400     | 2900     |
| 3     | 700     | 500     | 400     | 1600     |

**Employee 1 receives the maximum salary in Q1 2024 (₹6000).**




Let's analyze your two tables and show the output of different types of joins (`LEFT JOIN`, `RIGHT JOIN`, and `INNER JOIN`) using the condition `T1.A = T2.A`.

## Tables

**T1**

| A | B | C |
|---|---|---|
| 1 | 2 | 4 |
| 2 | 3 | 5 |

**T2**

| A    | B | C |
|------|---|---|
| 1    | 4 | 3 |
| NULL | 3 | 4 |

---

## 🔗 Join on `T1.A = T2.A`

### 1. INNER JOIN

```sql
SELECT * FROM T1 INNER JOIN T2 ON T1.A = T2.A;
```
✅ Only matching rows from both tables (where `T1.A = T2.A`):

| T1.A | T1.B | T1.C | T2.A | T2.B | T2.C |
|------|------|------|------|------|------|
| 1    | 2    | 4    | 1    | 4    | 3    |

---

### 2. LEFT JOIN

```sql
SELECT * FROM T1 LEFT JOIN T2 ON T1.A = T2.A;
```
✅ All rows from T1, matched rows from T2, `NULL` if no match:

| T1.A | T1.B | T1.C | T2.A | T2.B | T2.C |
|------|------|------|------|------|------|
| 1    | 2    | 4    | 1    | 4    | 3    |
| 2    | 3    | 5    | NULL | NULL | NULL |

---

### 3. RIGHT JOIN

```sql
SELECT * FROM T1 RIGHT JOIN T2 ON T1.A = T2.A;
```
✅ All rows from T2, matched rows from T1, `NULL` if no match:

| T1.A | T1.B | T1.C | T2.A | T2.B | T2.C |
|------|------|------|------|------|------|
| 1    | 2    | 4    | 1    | 4    | 3    |
| NULL | NULL | NULL | NULL | 3    | 4    |

---

## Selecting Rows Where `T2.A IS NULL`

If you want to select the row where `T2.A IS NULL`, use:

```sql
SELECT * FROM T2 WHERE A IS NULL;
```
✅ Output:

| A    | B | C |
|------|---|---|
| NULL | 3 | 4 |


To find artists who released more than 2 albums, where each album has an average song duration of more than 200 seconds, you can use the following SQL queries:

---

### 1. Get Albums with Average Song Duration > 200 Seconds

```sql
SELECT artist_id
FROM albums a
JOIN songs s ON a.album_id = s.album_id
GROUP BY a.album_id, a.artist_id
HAVING AVG(s.duration) > 200;
```

This query gets all albums where the average song duration is greater than 200 seconds, grouped by album.

---

### 2. Get Artists with More Than 2 Such Albums

```sql
SELECT artist_id
FROM (
    SELECT a.album_id, a.artist_id
    FROM albums a
    JOIN songs s ON a.album_id = s.album_id
    GROUP BY a.album_id, a.artist_id
    HAVING AVG(s.duration) > 200
) AS album_stats
GROUP BY artist_id
HAVING COUNT(DISTINCT album_id) > 2;
```

---

### 3. Get Artist Names (Optional)

If you want to return artist names, join with the `artists` table:

```sql
SELECT ar.name
FROM (
    SELECT a.album_id, a.artist_id
    FROM albums a
    JOIN songs s ON a.album_id = s.album_id
    GROUP BY a.album_id, a.artist_id
    HAVING AVG(s.duration) > 200
) AS album_stats
JOIN artists ar ON album_stats.artist_id = ar.artist_id
GROUP BY ar.artist_id, ar.name
HAVING COUNT(DISTINCT album_stats.album_id) > 2;
```

---

### Explanation

- **albums**: Contains album-level info (`album_id`, `artist_id`).
- **songs**: Contains individual songs (`song_id`, `album_id`, `duration` in seconds).
- The subquery filters albums where the average duration of songs is > 200 seconds.
- The outer query groups by `artist_id` and counts how many such albums they have.
- `HAVING COUNT(...) > 2` ensures only artists with more than 2 such albums are returned.

Let me know if your schema is different (e.g., table or column names).