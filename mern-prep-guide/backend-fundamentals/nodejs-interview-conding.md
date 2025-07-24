# RateLimiter Class Implementation

## Problem Statement

Design and implement a RateLimiter class in Node.js (or any language you're comfortable with). This class should help control concurrency by allowing only a specified number of concurrent function executions at any time. If the concurrent limit is reached, further function executions should wait until a slot becomes available.

Your implementation should be as generalized and reusable as possible so that the same RateLimiter class can be used across various scenarios requiring concurrency control.

## Requirements

The class should be initialized with a `maxConcurrency` count in the constructor.

Provide a method (e.g. `execute(fn)`) that:
- Accepts an asynchronous function `fn`
- If concurrency slots are available, immediately starts executing `fn`
- If the concurrency limit is reached, waits until a slot is freed before starting `fn`

The implementation must handle:
- High-concurrency usage
- Promise-based tasks of varying execution times
- Proper cleanup of completed tasks

## Example Usage

```javascript
const limiter = new RateLimiter(3);

for (let i = 0; i < 10; i++) {
  limiter.execute(async () => {
    console.log(`Starting task ${i}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async work
    console.log(`Finished task ${i}`);
  });
}
```

In the above example, at most 3 tasks should execute concurrently at any given time.

## Implementation

```javascript
class RateLimiter {
    constructor(maxConcurrency) {
        this.maxConcurrency = maxConcurrency;
        this.count = 0;
        this.queue = [];
    }
    
    async execute(fn) {
        if (this.count < this.maxConcurrency) {
            this.count++;
            try {
                await fn(); // Await the async function
            } finally {
                this.count--;
                this.runNext(); // Always try the next task, even on error
            }
        } else {
            this.queue.push(fn);
        }
    }

    runNext() {
        if (this.queue.length > 0 && this.count < this.maxConcurrency) {
            const nextFn = this.queue.shift();
            this.execute(nextFn);
        }
    }
}
```

## Usage Example

```javascript
const limiter = new RateLimiter(3);

for (let i = 0; i < 10; i++) {
    limiter.execute(async () => {
        console.log(`Starting task ${i}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async work
        console.log(`Finished task ${i}`);
    });
}
```

## How It Works

1. **Constructor**: Initializes the rate limiter with a maximum concurrency count, current count tracker, and a queue for pending tasks.

2. **execute(fn)**: 
   - If there are available slots (`count < maxConcurrency`), executes the function immediately
   - Increments the count before execution
   - Uses try/finally to ensure proper cleanup even if the function throws an error
   - Decrements the count and processes the next queued task in the finally block
   - If no slots are available, adds the function to the queue

3. **runNext()**: 
   - Checks if there are queued tasks and available slots
   - If both conditions are met, dequeues the next function and executes it

## Key Features

- ✅ **Concurrency Control**: Limits the number of simultaneously executing functions
- ✅ **Queue Management**: Queues excess functions when limit is reached
- ✅ **Error Handling**: Proper cleanup even when functions throw errors
- ✅ **Automatic Processing**: Automatically processes queued tasks as slots become available
- ✅ **Reusable**: Can be used across different scenarios requiring concurrency control

## Expected Output

With the example usage above, you would see output like:
```
Starting task 0
Starting task 1
Starting task 2
Finished task 0
Starting task 3
Finished task 1
Starting task 4
Finished task 2
Starting task 5
...
```

Only 3 tasks will run concurrently at any given time, with new tasks starting as previous ones complete.