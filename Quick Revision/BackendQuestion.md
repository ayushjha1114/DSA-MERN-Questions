# Handling Multiple Requests

Here’s a breakdown of how it can handle it, and what you should be careful about:

🧠 By Default: Node.js Server Behavior
Node.js can handle many concurrent requests thanks to its non-blocking I/O.

But CPU-heavy or memory-heavy tasks, like parsing a 100MB CSV, can block the event loop, delaying other requests.

😬 What Can Go Wrong?
If you directly read and parse a 100MB CSV file synchronously or in one big chunk:

🛑 You’ll block the event loop.

🐌 Other incoming requests get delayed or even time out.

💥 If memory use spikes, the server might crash under high load.

✅ Best Practices to Handle It
Stream the CSV file

Use fs.createReadStream() instead of fs.readFile().

Combine with a CSV parser like csv-parser or fast-csv.

js
Copy
Edit
const fs = require('fs');
const csv = require('csv-parser');

app.post('/process-csv', (req, res) => {
  const results = [];
  fs.createReadStream('file.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json({ message: 'File processed', rows: results.length });
    });
});
Offload heavy processing to a Worker Thread

Node.js worker_threads module lets you run CPU-bound code in separate threads.

Use a Job Queue (e.g., Bull, RabbitMQ)

Offload the request into a job queue.

Return a response like “Your file is being processed,” and notify the client later (e.g., via WebSocket or polling).

Limit concurrency

Add rate-limiting or queue requests server-side to avoid overload.

Scale horizontally

Use a load balancer and spawn multiple Node.js instances if you're expecting high concurrency.

🔁 Scenario: What if 50 users upload 100MB at once?
You must not read all 100MB files into memory at once.

Use streams to keep memory usage low.

Add a processing queue or throttle the requests if necessary.