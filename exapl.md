# Technical Interview Questions for a Full-Stack Developer (6.5 Years Experience)

---

## System Design & Architecture

1. **Scalable Architecture for PWA with Live Streaming**
    - How would you design a scalable architecture for a progressive web app that supports live video and audio streaming?
    - What components (e.g., signaling servers, media servers, load balancers) would you include and why?

2. **WebRTC Streaming Trade-offs**
    - Explain the trade-offs between peer-to-peer (WebRTC) streaming and server-mediated streaming in a multi-user video conference.
    - When would you choose one approach over the other?

3. **Signaling Mechanism for WebRTC**
    - How would you structure the signaling mechanism for establishing WebRTC connections?
    - What data would you exchange between client and server (e.g., SDP, ICE candidates)?

4. **Supporting Multiple Concurrent Video Streams**
    - Describe how you would support 5+ concurrent video streams in your system.
    - What considerations are there for bandwidth, CPU/GPU usage on client devices, and server resources?

5. **Architectural Patterns**
    - What design patterns or architectural principles (e.g., microservices vs monolith, pub/sub, event-driven design) would you apply in building the back-end for this streaming app?

6. **API Documentation**
    - How would you use Swagger (OpenAPI) documentation to design or communicate your RESTful APIs?
    - How does good API documentation help in a team setting?

7. **Fault Tolerance & High Availability**
    - What considerations are needed for fault tolerance and high availability in a real-time streaming platform?
    - How would you handle server or network failures gracefully?

8. **API Versioning & Backward Compatibility**
    - How would you implement versioning and backward compatibility for your APIs so that updates don’t break existing clients?

---

## Front-End (React.js, Redux, TypeScript, PWA)

1. **PWA Features & Service Workers**
    - What are the key features of a Progressive Web App (PWA)?
    - How would you implement service workers to enable offline support or caching in a streaming app?

2. **Integrating WebRTC in React**
    - How do you integrate a live WebRTC video stream into a React component?
    - Describe how you would manage the MediaStream and update the component lifecycle (mounting, cleanup).

3. **Redux for State Management**
    - Explain how you would use Redux to manage application state for video/audio streams and user sessions.
    - What actions, reducers, and middleware might you create?

4. **TypeScript in React/Redux**
    - Describe how TypeScript improves the development experience in a React/Redux project.
    - How do you define interfaces or types for component props, state, and Redux actions?

5. **Performance Optimization in React**
    - How would you optimize the performance of a React front-end that renders multiple video streams?
    - (e.g., minimizing re-renders, optimizing the virtual DOM)

6. **Debugging UI Issues**
    - What strategies would you use to debug UI issues in a React app?
    - Mention tools like React DevTools or browser console.

7. **React Hooks for State & Side Effects**
    - How do React hooks (such as `useEffect`, `useState`, `useRef`) help manage side effects and state in a streaming video component?
    - Can you give an example?

8. **PWA Manifest File**
    - What is the role of a manifest file in a PWA?
    - How do you use it to control app installability or icons?

9. **Cross-Browser Compatibility & Responsiveness**
    - How would you ensure cross-browser compatibility and responsiveness for video playback in a React app?
    - What CSS techniques or libraries might you use?

10. **Front-End Error Handling**
     - How would you approach error handling in the front-end (e.g., catching failures when starting a WebRTC stream or losing connectivity)?

---

## Back-End (Node.js, Express.js)

1. **Node.js Event Loop**
    - Explain how the Node.js event loop works.
    - How does its non-blocking nature affect handling multiple simultaneous WebSocket or API connections?

2. **WebSocket Server Implementation**
    - How would you implement a WebSocket server using Node.js (e.g., with Socket.io or ws)?
    - Describe how you would broadcast messages (or media signals) to clients.

3. **Express.js Application Structure**
    - What are best practices for structuring an Express.js application (routes, middleware, controllers)?
    - How do you handle errors and exceptions in Express?

4. **Signaling Server for WebRTC**
    - How would you design and implement a signaling server in Node/Express for coordinating WebRTC peer connections (exchange of SDP and ICE candidates)?

5. **API Security**
    - How do you secure your Express.js APIs?
    - What methods would you use for authentication (e.g., JWT, OAuth) and authorization?

6. **Handling Large Payloads**
    - In a Node.js streaming server, how would you handle large binary payloads or file uploads without blocking the event loop?

7. **Express Middleware**
    - What is middleware in Express?
    - Can you give an example of custom middleware you might write (e.g., for logging requests or validating tokens)?

8. **Memory Leak Detection**
    - How can you detect and prevent memory leaks in a Node.js service?
    - What tools or techniques would you use to profile memory usage?

9. **Configuration Management**
    - How do you handle configuration for different environments (development, staging, production) in a Node.js app?
    - (Consider environment variables or config files.)

10. **TypeScript on the Back-End**
     - Describe how you would use TypeScript on the Node.js back-end.
     - What are the benefits and how do you set it up (tsconfig, module resolution)?

11. **Scaling Node.js Servers**
     - How can you scale a Node.js server to handle high traffic (cluster module, load balancing)?
     - What challenges arise with stateful WebSocket connections when scaling horizontally?

12. **Logging & Monitoring**
     - What logging and monitoring strategies would you put in place on the server side to quickly identify and diagnose production issues?
     - (Mention logging libraries or APM tools.)

---

## Database (PostgreSQL)

1. **Schema Design**
    - How would you design a database schema in PostgreSQL to support user profiles, stream sessions, chat messages, and any other relevant data for this app?

2. **ORM vs Raw SQL**
    - What are the trade-offs between using an ORM (like Sequelize or TypeORM) versus writing raw SQL queries in a Node.js application?

3. **Transactions for Consistency**
    - How do you use database transactions in PostgreSQL to ensure data consistency (e.g., when creating or ending a streaming session involves multiple table updates)?

4. **Indexing Strategies**
    - What indexing strategies would you use to optimize query performance for large tables (such as logs or message history)?
    - How do you decide which columns to index?

5. **Query Optimization**
    - How would you analyze and optimize a slow SQL query in PostgreSQL?
    - What tools or commands (EXPLAIN, pg_stat_activity) might you use?

6. **Connection Pooling**
    - Explain how connection pooling works with PostgreSQL.
    - Why is connection pooling important in a Node.js application?

7. **Schema Migrations**
    - What are some ways to handle database schema migrations in a Node.js project?
    - Can you name tools or libraries that help with migrations?

8. **JSON/JSONB Columns**
    - How might you use JSON or JSONB columns in PostgreSQL for flexible data (e.g., storing metadata about streams)?
    - What are the advantages and disadvantages?

9. **High Availability & Fault Tolerance**
    - Discuss how you would ensure high availability or fault tolerance for the PostgreSQL database in production (e.g., replication, backups).

10. **Database Security**
     - How do you secure a PostgreSQL database?
     - Mention roles, permissions, and protecting against SQL injection.

11. **ACID Compliance**
     - What is ACID compliance and why is it important for a streaming app that tracks user sessions or billing?

12. **Batch Operations & Cleanup**
     - How would you perform batch operations or cleanup tasks (e.g., archiving old logs) without impacting database performance?

---

## Real-Time Communication (WebRTC, WebSocket, Networking)

1. **WebRTC Connection Steps**
    - Explain the basic steps involved in establishing a WebRTC connection between two browsers (signaling, ICE gathering, connectivity checks).

2. **STUN & TURN Servers**
    - What is the role of STUN and TURN servers in WebRTC?
    - Why are they necessary, and what happens if no TURN server is available?

3. **ICE Candidates**
    - How do ICE candidates work in WebRTC, and how are they exchanged between peers?

4. **SDP in WebRTC**
    - What is SDP (Session Description Protocol) in WebRTC, and what kind of information does it contain?

5. **WebRTC Security**
    - How does WebRTC ensure secure media transmission (encryption)?
    - What protocols are used (e.g., DTLS-SRTP)?

6. **WebRTC DataChannel vs WebSocket**
    - What is the difference between a WebRTC DataChannel and a WebSocket?
    - When would you use one over the other?

7. **WebSocket vs HTTP**
    - Explain how a WebSocket connection differs from a regular HTTP request.
    - What advantages do WebSockets offer for real-time applications?

8. **Keep-Alive Mechanisms**
    - How would you implement a keep-alive or ping/pong mechanism in WebSocket to detect broken connections?

9. **Reconnection Logic**
    - How do you handle reconnection logic on the client side if a WebSocket or WebRTC connection is lost?

10. **Codecs in WebRTC**
     - What are common codecs used in WebRTC for audio and video, and how do they affect quality or compatibility?

11. **Network Issues & Mitigation**
     - How can network issues like latency and jitter affect real-time video?
     - What strategies (buffering, adaptive bitrate) can mitigate these?

12. **SFU & MCU in WebRTC**
     - What is an SFU (Selective Forwarding Unit) or MCU (Multipoint Control Unit) in multi-party WebRTC, and why might you use one?

13. **Authorization for WebRTC Rooms**
     - How do you ensure only authorized users can join a WebRTC room?
     - What security checks would you implement on signaling or server side?

14. **Firewalls, NATs & ICE Traversal**
     - Explain how firewalls and NATs impact WebRTC connections and how ICE traversal addresses these issues.

---

## Testing and Quality Assurance

1. **Testing Frameworks**
    - What testing frameworks have you used for Node.js and React (e.g., Jest, Mocha, Jasmine)?
    - How do they differ?

2. **Unit Testing React Components**
    - How would you write a unit test for a React component that handles video playback?
    - What would you mock and what would you actually render?

3. **Testing Asynchronous Code**
    - Describe how to test asynchronous code in JavaScript/TypeScript.
    - How do you test async functions or Promises in your test framework?

4. **Mocks and Stubs**
    - What are mocks and stubs in testing?
    - Give an example of using a mock WebSocket or mock API in a unit test.

5. **Integration Testing APIs**
    - How would you perform integration testing on your Express API endpoints?
    - Which tools (like Supertest or Postman) might you use?

6. **End-to-End (E2E) Testing**
    - Can you explain end-to-end (E2E) testing and how you might test a feature that involves both front-end and back-end (e.g., user login followed by starting a video stream)?

7. **Test Coverage**
    - What is test coverage and how do you use coverage reports to improve your test suite?
    - What is an acceptable level of coverage?

8. **Testing Redux Layer**
    - How would you test the Redux layer (actions and reducers) in isolation?
    - What about middleware or asynchronous action creators?

9. **Testing WebRTC Functionality**
    - Describe how you might test WebRTC functionality.
    - Are there frameworks or strategies to simulate peer connections in tests?

10. **Handling Flaky Tests**
     - How do you handle flaky tests (tests that sometimes pass and sometimes fail) in your test suite?

11. **Cross-Browser/Device Testing**
     - How do you ensure cross-browser or cross-device compatibility in your tests for a PWA that uses WebRTC?

12. **Continuous Integration & Testing**
     - What is Continuous Integration in the context of testing (do not delve into tools)?
     - Why is it important to run automated tests on each code change?

13. **TypeScript & Compile-Time Bugs**
     - How can TypeScript help catch bugs at compile-time, and how does that complement your testing strategy?

---

## Debugging and Troubleshooting

1. **Debugging Node.js Backend**
    - What tools and techniques do you use to debug a Node.js backend (e.g., console logs, Node inspector, Chrome DevTools)?

2. **Debugging Memory Leaks**
    - How would you approach debugging a memory leak in a Node.js service or a browser application?
    - What steps would you take?

3. **Diagnosing Video Stream Issues**
    - If users report that the video stream occasionally freezes or desynchronizes, how would you diagnose the root cause?
    - Consider both client-side and network factors.

4. **Browser Development Tools**
    - Describe how you would use browser development tools (e.g., React DevTools, Network tab) to troubleshoot a problem in a React application.

5. **Debugging WebRTC Connections**
    - How do you debug WebRTC connections?
    - What browser tools or logs (such as `chrome://webrtc-internals`) can help you see ICE candidate exchange or media stats?

6. **Isolating Bugs Across the Stack**
    - How would you isolate whether a reported bug is coming from the front-end, back-end, or database?
    - Walk through your process.

7. **Logging Strategy**
    - What logging strategy would you employ on the client and server to help trace issues in production?
    - What kind of information would you log?

8. **Debugging API Errors**
    - If an API endpoint is returning an unexpected error, how would you debug it?
    - Which parts of the stack would you check (network calls, server logs, database)?

9. **Using Git for Debugging**
    - How do you use Git (or other version control) to help identify when a bug was introduced (e.g., using `git bisect`)?

10. **Bug Triage & Prioritization**
     - When a production bug is reported, how do you prioritize and triage it?
     - What information do you gather before attempting to fix it?

11. **Automated Tests for Debugging**
     - How can automated unit tests and integration tests assist you in debugging?
     - Give an example of a bug that tests helped catch or isolate.

12. **Debugging Performance Issues**
     - Describe how you might debug a performance issue (e.g., slow API response or high CPU usage).
     - What profiling tools or metrics would you look at?

---

## Code Review & Best Practices

1. **Code Review Focus Areas**
    - What are the key things you look for during a code review in a full-stack project?
    - (Think about correctness, readability, performance, and security.)

2. **Coding Standards & Linters**
    - How do coding standards, linters, and automated formatting (like ESLint or Prettier) contribute to code quality in a team?

3. **Common Anti-Patterns**
    - Can you give examples of common anti-patterns or pitfalls in JavaScript/TypeScript or React/Node code that you would flag in a review?

4. **Documentation Practices**
    - How do you ensure that new code is well-documented (e.g., updating Swagger for APIs or writing Confluence pages)?

5. **SOLID Principles**
    - What is the SOLID principle and how does it apply to writing maintainable JavaScript or TypeScript code?

6. **Reviewing Redux Code**
    - How would you review someone’s implementation of a Redux reducer or action?
    - What would you check for (immutability, side-effects, naming)?

7. **Performance vs Maintainability**
    - How do you balance performance optimization and code readability/maintainability in code you review?

8. **Error Handling Best Practices**
    - What best practices do you follow for handling errors and exceptions in code?
    - For example, how would you standardize error responses in an Express API?

9. **Security in Code Reviews**
    - How do you address security concerns in code reviews (e.g., checking for SQL injection, XSS, CSRF vulnerabilities)?

10. **Test Code Review**
     - Why is writing tests important, and what do you look for when reviewing test code?
     - (Consider coverage, test case clarity, avoiding brittle tests.)

11. **DRY Principle**
     - Explain the DRY (Don’t Repeat Yourself) principle.
     - Provide an example of refactoring code to eliminate duplication.

12. **Refactoring vs Rewriting**
     - How do you decide when to refactor legacy code versus rewriting it?
     - What factors influence this decision?

13. **Naming Conventions & Project Structure**
     - What naming conventions and project structure guidelines do you follow in JavaScript projects?

---

## Performance Optimization

1. **Profiling React Applications**
    - How would you profile and improve the performance of a React application that is slow or has high memory usage?
    - What tools would you use (e.g., React Profiler, Chrome DevTools)?

2. **Reducing Bundle Size**
    - Describe techniques to reduce the bundle size of a React/TypeScript application.
    - What strategies (like code splitting or tree shaking) can help?

3. **Lazy Loading in React**
    - How can you use lazy loading or dynamic imports in React to improve initial load time?
    - Give an example.

4. **Identifying Node.js Bottlenecks**
    - In a Node.js server, how would you identify a performance bottleneck in an API endpoint (e.g., slow database query, CPU-bound loop)?

5. **Caching Strategies**
    - What caching strategies might you use to improve performance (e.g., HTTP caching headers, in-memory caching like Redis, CDN for static assets)?

6. **Database Optimization**
    - How do you optimize database performance for high traffic?
    - Mention indexing, query optimization, or caching query results.

7. **Adaptive Bitrate Streaming**
    - Explain how adaptive bitrate streaming works to handle varying network conditions for video.
    - How might you implement it or use existing solutions?

8. **Reducing Latency in Real-Time Connections**
    - How would you reduce latency in a WebSocket or WebRTC connection (e.g., by adjusting heartbeat intervals, or using binary data efficiently)?

9. **Front-End Video Playback Optimization**
    - What are some front-end optimizations for smooth video playback (e.g., using `requestAnimationFrame` for animations, preloading critical assets)?

10. **Efficient CPU Usage in Node.js**
     - How do you ensure your Node.js application makes efficient use of CPU cores (consider clustering or worker threads)?

11. **Content Compression**
     - What role does content compression (like Gzip or Brotli) play in performance?
     - How would you enable compression in Express?

12. **Reducing Client Memory Usage**
     - How might you reduce memory usage when handling multiple video streams on the client side?
     - (Consider removing unused references, controlling video element dimensions.)

13. **Measuring & Improving TTI/FCP**
     - What steps would you take to measure and improve the Time to Interactive (TTI) or First Contentful Paint (FCP) of a PWA?

14. **Minimizing Redux Overhead**
     - How can you minimize Redux overhead when storing large state (e.g., video metadata)?
     - (Think about normalization or selective persistence.)