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