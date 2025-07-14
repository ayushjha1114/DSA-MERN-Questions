import { parentPort } from "worker_threads";

// Simulate a CPU-heavy task:
let total = 0;
for (let i = 0; i < 1e9; i++) {
    total += i;
}

parentPort.postMessage(`Total sum is: ${total}`);