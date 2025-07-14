import http from 'http'

const app = http.createServer((req, res) => {
    if (req.url === '/health-check') {
        res.write('server is up and running from http server')
        res.end();
    }
});


app.listen(3050, () => {
    console.log("HTTP server running on port 3050");
})


// 🌐 http Server (Core Node.js)
// Built-in module in Node.js: require('http')
// Low-level API: You manually handle routing, headers, content type, status codes, etc.
// Very fast and lightweight — minimal abstraction.

/* const httpExample = require('http');
    
const httpServer = httpExample.createServer((req, res) => {
    if (req.url === "/") {
        res.write("Home Page");
        res.end();
    }
});

httpServer.listen(3000, () => {
    console.log("HTTP server running on port 3000");
}); */

// 🚀 Express Server
// Built on top of the native http module.
// Provides abstraction and convenience:
// - Middleware support
// - Routing with app.get/post
// - JSON parsing
// - Error handling
// Internally uses http.createServer.

/* const express = require('express');
const expressApp = express();

expressApp.get('/', (req, res) => {
    res.send('Home Page');
});

expressApp.listen(3000, () => {
    console.log("Express server running on port 3000");
}); */

// ⚙️ 3. Are They Mutually Exclusive?
// No. Express uses http.createServer() under the hood.
// In fact, this works:

/* const expressApp2 = express();
const server = httpExample.createServer(expressApp2); */

// 📈 4. How Many Requests Can Each Handle?
// This depends on:
// - Machine capacity (CPU, RAM)
// - Async/non-blocking I/O
// - App logic and database latency
// - Use of load balancers or clustering

// 🧪 Benchmarks (approx):
// Server         Typical RPS (requests/sec) on 4-core VM
// Node.js http   35,000 – 50,000
// Express.js     20,000 – 30,000

// ✅ Express is ~15–30% slower, but gains a lot in developer productivity and middleware support.

// 🧠 If performance is critical, use:
// - http server
// - Or a faster framework like Fastify (which is faster than Express)
