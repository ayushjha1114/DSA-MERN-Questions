const cb = (x, y, z) => {console.log('it is callbacl', x, y, z)}
const b = a(cb)

b(1)(2, 3)
b(1, 2, 3)
b(1, 2)(3)

complete the code so it can we call in difference pattern but it prints the same output


ChatGPT said:
You're trying to implement a function currying + flexible argument grouping pattern, where different calls like:

js
Copy
Edit
b(1)(2, 3)
b(1, 2, 3)
b(1, 2)(3)
...all eventually invoke the callback cb(x, y, z) with the same arguments.

✅ Goal:
js
Copy
Edit
cb(1, 2, 3) → "it is callbacl 1 2 3"
and allow flexible partial calls until all 3 args are collected.

✅ Working Solution:
js
Copy
Edit
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

// ✅ Usage
const cb = (x, y, z) => {
  console.log('it is callbacl', x, y, z);
};

const b = a(cb);

b(1)(2, 3);      // ✅ it is callbacl 1 2 3
b(1, 2, 3);      // ✅ it is callbacl 1 2 3
b(1, 2)(3);      // ✅ it is callbacl 1 2 3
🔍 How it works:
The outer function a(cb) sets up a closure to collect arguments.

collectArgs(...argsSoFar) keeps accumulating arguments until we have 3.

Once we reach 3 or more arguments, it calls the callback with only the first 3.

If not enough arguments yet, it returns a new curried function expecting more.