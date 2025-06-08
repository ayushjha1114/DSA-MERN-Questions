# Interview Questions & Quick Revision Links

---

## AWS Lambda

- [AWS Lambda Official Docs](https://www.serverless.com/aws-lambda/)
- [Pros and Cons of AWS Lambda (DZone)](https://dzone.com/articles/the-pros-and-cons-of-aws-lambda#:~:text=Con%3A%20More%20Complex%20Call%20Patterns&text=AWS%20Lambda%20functions%20are%20timeboxed,distributed%20fashion%20on%20your%20data.)
- [Pros & Cons of AWS Lambda (LinkedIn)](https://www.linkedin.com/pulse/pros-cons-aws-lambda-ashish-saxena/)

---

## Node.js

- [Node.js Child Process (Docs)](https://nodejs.org/api/child_process.html)
- [Node.js Child Process (GeeksforGeeks)](https://www.geeksforgeeks.org/node-js-child-process/)
- [Node.js Cluster](https://nodejs.org/api/cluster.html)
https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
https://www.google.com/amp/s/www.geeksforgeeks.org/what-is-web-socket-and-how-it-is-different-from-the-http/amp/

Consistent hashing
https://www.toptal.com/big-data/consistent-hashing#:~:text=according%20to%20Wikipedia).-,Consistent%20Hashing%20is%20a%20distributed%20hashing%20scheme%20that%20operates%20independently,without%20affecting%20the%20overall%20system.




Database sharding
https://www.digitalocean.com/community/tutorials/understanding-database-sharding
https://www.google.com/amp/s/www.geeksforgeeks.org/database-sharding-a-system-design-concept/amp/

https://www.mongodb.com/docs/manual/sharding/

Cdn

https://www.akamai.com/our-thinking/cdn/what-is-a-cdn#:~:text=A%20CDN%20is%20a%20network,and%20stored%20elsewhere%20as%20needed.



Server side cache
https://edgemesh.com/blog/difference-between-server-side-caching-and-client-side-caching-and-which-is-good-for-your-website

Eventual consistency
https://en.m.wikipedia.org/wiki/Eventual_consistency

Communication in microservice architecture 
https://learn.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/communication-in-microservice-architecture

Network protocol
https://www.tutorialspoint.com/communication_technologies/communication_technologies_network_protocols.htm



https://nodejs.org/api/cluster.html

https://www.google.com/amp/s/www.geeksforgeeks.org/reactjs-lifecycle-components/amp/

https://blog.logrocket.com/what-are-react-pure-functional-components/#:~:text=A%20React%20component%20is%20considered,are%20treated%20as%20pure%20components.


https://legacy.reactjs.org/docs/faq-internals.html

https://www.google.com/amp/s/www.geeksforgeeks.org/difference-between-stateless-and-stateful-protocol/amp/

https://www.freecodecamp.org/news/server-side-rendering-your-react-app-in-three-simple-steps-7a82b95db82e/amp/

https://asperbrothers.com/blog/server-side-rendering-in-react/#:~:text=What%20is%20Server%2DSide%20Rendering,with%20all%20the%20static%20elements.

https://blog.bitsrc.io/5-ways-to-avoid-react-component-re-renderings-90241e775b8c

https://github.com/InterviewReady/Low-Level-Design

https://blog.logrocket.com/methods-for-microservice-communication/

https://betterprogramming.pub/execution-context-lexical-environment-and-closures-in-javascript-b57c979341a5

https://exploringjs.com/es6/ch_variables.html#sec_temporal-dead-zone

https://github.com/shubham-thakare/javascript-developer-roadmap#basic-concepts

https://www.geeksforgeeks.org/what-is-web-socket-and-how-it-is-different-from-the-http/

https://chartio.com/learn/databases/how-does-indexing-work/#:~:text=Indexing%20is%20the%20way%20to,search%20through%20the%20rows%20linearly.


https://javascript.info/intro


https://github.com/learning-zone/nodejs-basics#table-of-contents

https://github.com/learning-zone/nodejs-basics/blob/master/nodejs-api.md

https://github.com/learning-zone/javascript-basics?tab=readme-ov-file#-9-functions

https://github.com/learning-zone/mongodb-basics

https://github.com/sudheerj/reactjs-interview-questions


https://www.javatpoint.com/redis-tutorial

https://www.freecodecamp.org/news/node-js-child-processes-everything-you-need-to-know-e69498fe970a/

https://www.interviewbit.com/mongodb-interview-questions/

https://medium.com/@rsk.saikrishna/when-to-use-mongodb-rather-than-mysql-d03ceff2e922

https://www.datacamp.com/blog/top-postgresql-interview-questions-for-all-levels

https://dev.to/oahehc/redux-data-flow-and-react-component-life-cycle-11n

–when promise and async await task executed at same time then how event loop decide which go first

Event Loop Phases and Order:
Phase 1: Execution of synchronous code — The JavaScript engine runs the synchronous code, which could include the creation of Promises and async functions.
Phase 2: Microtasks — After the synchronous code completes, all microtasks are executed. This includes:
.then() handlers of resolved Promises.
Continuation of async functions after await (since await essentially resolves to a microtask).
Note: Microtasks are executed before I/O callbacks (like setTimeout, or fs.readFile) are processed, even if those callbacks were scheduled earlier.
Phase 3: I/O callbacks and timers — Only after the microtask queue is empty does the event loop move on to process I/O callbacks, timers, and other tasks in the callback queue.


https://tr.javascript.info/microtask-queue

https://konghq.com/learning-center/api-gateway/what-is-restful-api

https://saturncloud.io/blog/why-is-an-options-request-sent-and-can-i-disable-it/#:~:text=As%20a%20software%20engineer%2C%20you,supported%20by%20a%20particular%20server.

https://chartio.com/learn/databases/how-does-indexing-work/#:~:text=Indexing%20is%20the%20way%20to,search%20through%20the%20rows%20linearly.

https://javascript.info/event-loop

https://javascript.info/microtask-queue

https://dev.to/jeetvora331/difference-between-microtask-and-macrotask-queue-in-the-event-loop-4i4i


https://www.geeksforgeeks.org/what-is-react-fiber/

Reactjs hooks and their working

https://www.linkedin.com/pulse/hoisting-javascript-what-every-developer-should-know-adekola-olawale-f3y5f/

https://www.youtube.com/watch?v=8aGhZQkoFbQ    — event loop explanation

https://developer.mozilla.org/en-US/docs/Glossary/Polyfill 

https://omken.medium.com/polyfills-for-filter-caf6a243dcfb#:~:text=filter()%20has%20only%20one,a%20polyfill%20for%20filter().


Mongodb aggregation 
Aggregation lookups, facets


Transition lock in sql

https://www.tutorialspoint.com/sql/sql-transactions.htm
useMemo() and UseCallback() 


How to create custom hook



https://medium.com/agora-io/how-does-webrtc-work-996748603141

https://medium.com/@ecosmobtechnologies/webrtc-best-practices-understanding-stun-turn-and-ice-servers-4836109904ec

https://omken.medium.com/polyfills-for-filter-caf6a243dcfb#:~:text=filter()%20has%20only%20one,a%20polyfill%20for%20filter().


create polyfill of filter function in js


https://developer.mozilla.org/en-US/docs/Glossary/Polyfill

https://javascript.info/polyfills


monkey patching


incremental rendering

hot module replacement


react fiber

https://www.geeksforgeeks.org/what-is-react-fiber/

dense array vs sparse array

https://www.geeksforgeeks.org/variable-shadowing-in-javascript/

https://community.aws/content/2dZeMFOYlghxDkKofCNFXY4ZDKi/sqs-vs-sns-vs-ses?lang=en

Use of AWS SQS vs SES

https://aws.amazon.com/compare/the-difference-between-graphql-and-rest/


 IAM is focused on controlling access to AWS resources within an AWS account, whereas Cognito is focused on user authentication and authorization for web and mobile applications.

Authentication confirms that users are who they say they are. Authorization gives those users permission to access a resource. 


Clusters in nodejs
https://www.youtube.com/watch?v=JoPZ9gEvpz8

loadbalancer

Batch processing in nodejs

https://www.mongodb.com/docs/manual/core/views/join-collections-with-view/

setImmediate vs nextTick function in nodejs

https://dev.to/jeetvora331/difference-between-microtask-and-macrotask-queue-in-the-event-loop-4i4i

Impact of multiple indexes in mongodb

how to secure rest api

Types of indexes in mongodb 


What is layers in aws lambda?
https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html

How service worker works in PWA

https://mongoosejs.com/docs/populate.html

https://www.geeksforgeeks.org/difference-between-local-storage-session-storage-and-cookies/

Find second last element in table which has second highest salary

https://www.geeksforgeeks.org/sql-query-to-find-second-largest-salary/

https://portswigger.net/web-security/ssrf

Security issues in web app and how to resolve them
https://www.geeksforgeeks.org/web-security-considerations/
https://www.geeksforgeeks.org/top-10-security-risks-in-web-applications/
https://www.geeksforgeeks.org/securing-web-applications/
https://www.geeksforgeeks.org/best-practices-for-secure-coding-in-web-applications/
https://www.geeksforgeeks.org/owasp-top-10-vulnerabilities-and-preventions/
https://www.geeksforgeeks.org/top-common-frontend-security-attacks/
https://www.geeksforgeeks.org/web-server-and-its-types-of-attacks/





memory leak in node js and how to avoid it

https://betterstack.com/community/guides/scaling-nodejs/high-performance-nodejs/nodejs-memory-leaks/


https://www.geeksforgeeks.org/data-access-layer/


How to sso works explain with aws congnito

Redux how redux works dispatch action and store middleware thunk saga

How indexing works internally


Reactjs new feature and server side component

Which design pattern have you worked on
Module pattern
Singleton pattern

What is IIFE and its use.


triggers in sql
stored procedures in sql




TimSort, the ninja-level hybrid sorting algorithm that powers array.sort() in JavaScript (V8), Python, and Java. We'll also compare it to QuickSort so you can see why it's used in production.

🧠 What is TimSort?
TimSort is a hybrid algorithm combining the best parts of:
Merge Sort (stable, good in worst-case)


Insertion Sort (fast on small or sorted data)


Why use both?
Because:
Insertion Sort is blazing fast on small or nearly sorted arrays


Merge Sort is consistent and stable (guaranteed O(n log n))



📦 Real-Life Analogy
Imagine you're organizing a big pile of slightly sorted files:
First, you split them into small sections that are mostly in order.


You fine-tune each section with Insertion Sort 🧹.


Then you merge those sections together efficiently.


What is a Stable Sorting Algorithm?
A stable sort preserves the relative order of equal elements in the original array.
✅ Stable Example:
Imagine you have a list of people sorted by age:
js
CopyEdit
[
  { name: "Alice", age: 25 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 30 }
]

If you sort this list by age, a stable sort will keep Alice before Bob — because Alice came first in the original list and their ages are equal.

❌ Unstable Sorting Algorithm
An unstable sort might reorder equal elements, meaning Bob could appear before Alice, even though they had the same age and Alice came first.


- **If you delete `package.json` and your project only exists locally, you can recover it as follows:**

    1. **Re-initialize the project:**
         ```bash
         npm init -y
         ```
         This creates a new `package.json` with default values.

    2. **Restore dependencies from `package-lock.json`:**
         - Install production dependencies:
             ```bash
             npm install $(jq -r '.dependencies | to_entries[] | "\(.key)@\(.value)"' package-lock.json)
             ```
         - Install development dependencies:
             ```bash
             npm install --save-dev $(jq -r '.devDependencies | to_entries[] | "\(.key)@\(.value)"' package-lock.json)
             ```
         - These commands use `jq` (a command-line JSON parser) to extract and install dependencies listed in `package-lock.json`.

    3. **Note:**  
         - Make sure you have `jq` installed on your system.
         - This approach works if your `package-lock.json` is up to date and not corrupted.


- **How to identify unused modules/packages in a Node.js app:**
    - Use `depcheck`, a CLI tool that scans your project and reports:
        - Unused packages in your dependencies.
        - Missing packages that are used in code but not listed in dependencies.
        - Ignored or dynamically required packages.

How currying works implement it ? using closure?

If i want to perform heavy computation task how can perform it in nodejs? Worker_threads

How you manage high traffic of request in nodejs?

Db has low throughput means user can’t perform thousands of operations(read/write in db) OPS(operations per second)




Kafka use pub/sub or queue data strcture
rabbitMQ/AWS SQS use queue data structure





Simulate mock interview in chatgpt for practice








What are the middlewares you have used in node app-

Csurf middleware can be used in nodejs for CSRF protection(https://www.npmjs.com/package/csurf)

Express-rate-limit middleware can be used in nodejs for rate limiting the request made by user per minute (https://www.npmjs.com/package/express-rate-limit) –(to prevent brute-force attack on login page / to prevent server to exhaust by requests made by single user)

How Rate Limiting and Throttling Saves Your API Server From CRASHING! - https://www.youtube.com/watch?v=_qNHROq0pGk&list=WL&index=7

XSS Attacks Explained – How HACKERS steal data with one line of code(❌ XSS Attacks Explained – How HACKERS steal data with one line of code) 

Install dompurify in js to sanitize the input text to prevent XSS attacks



How hash map function like get set has - have O(1) time complexity


### Difference between REST API vs GraphQL
https://aws.amazon.com/compare/the-difference-between-graphql-and-rest/






























