import { Worker } from 'worker_threads';

function runWorker() {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker_threads/worker.js');
        
        worker.on('message', (message) => {
            console.log('Message from worker:', message);
            resolve(message);
        });
        worker.on('error', (error) => {
            console.error('Error from worker:', error);
            reject(error);
        });
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
                reject(new Error(`Worker stopped with exit code ${code}`));
            } else {
                console.log('Worker exited successfully');
            }
        });
    });
}

async function main() {
    console.log('starting worker thread...');
    const result = await runWorker();
    console.log('Worker result:', result);
}

main();

console.log('Main thread is running...');




/* 💡 Interview Q&A for worker_threads
Q1. Why not use cluster or child_process instead?
Answer:

cluster and child_process create new Node.js processes, each with their own memory heap.

worker_threads create true threads within the same process, allowing lower overhead and shared memory with SharedArrayBuffer.

Use cluster when you want true process isolation (e.g., HTTP server handling).

Use worker_threads when you want to offload CPU-heavy JS tasks without inter-process overhead.

Q2. How do you share memory between threads?
Answer:
Use SharedArrayBuffer and Atomics:

js
Copy
Edit
const shared = new SharedArrayBuffer(4);
const arr = new Int32Array(shared);
Atomics.add(arr, 0, 1);
This allows threads to read/write to the same memory region in a thread-safe way.

Q3. How do you control the number of worker threads to avoid CPU thrashing?
Answer:

Limit threads to os.cpus().length.

Use a worker pool (e.g., via Piscina, a popular worker pool library).

Avoid spawning too many threads at once. Queue tasks and reuse threads.

Q4. What are the trade-offs between worker_threads and message queues like RabbitMQ or Kafka?
Aspect	worker_threads	MQ (e.g. RabbitMQ)
Use case	Local CPU-bound work	Distributed async tasks
Overhead	Low	Medium–High (network, serialization)
Scaling	Limited to one machine	Can scale horizontally
Fault tolerance	Manual	Built-in retry, ack, dead letter queues
Example	Sum calc, image processing	Order processing, email queues

In general, use worker_threads for local performance; use MQs for distributed communication and decoupling. */