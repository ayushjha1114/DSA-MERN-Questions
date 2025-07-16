## Question 1

### What are the key features of a Progressive Web App (PWA), and how would you implement service workers to enable offline support or caching in a streaming app?

---

### 1. What is a PWA?

A **Progressive Web App (PWA)** is a web application that leverages modern web capabilities to deliver an app-like experience. PWAs are:

- **Reliable:** Load instantly and work offline or on poor networks.
- **Fast:** Respond quickly to user interactions.
- **Engaging:** Feel like a native app with app-like navigation and interactions.

---

### 2. Key Features of a PWA

- **Responsive:** Works on any device screen size (desktop, mobile, tablet).
- **Offline Support:** Uses service workers to cache resources and serve content when offline.
- **App Installable:** Users can “install” the PWA to their home screen via a web manifest.
- **Push Notifications:** Enables engagement through push notifications.
- **Secure:** Served over HTTPS to prevent man-in-the-middle attacks.
- **Linkable:** Easily shareable URLs, no app store installation needed.

---

### 3. How Service Workers Enable Offline Support and Caching

A **Service Worker** is a script that the browser runs in the background, separate from the web page. It:

- Intercepts network requests and can serve cached responses or fetch new data from the network.
- Enables caching strategies like **cache-first**, **network-first**, or **stale-while-revalidate** to optimize offline behavior.

---

### 4. Implementing Service Worker in a Streaming App (Basic Example)

For a streaming app, cache static assets and metadata, but avoid caching large video/audio streams due to size.

**Minimal service worker example:**

```js
// service-worker.js

const CACHE_NAME = 'streaming-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/static/css/main.css',
    // Add other static assets or API response URLs
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request);
            })
            .catch(() => {
                if (event.request.destination === 'document') {
                    return caches.match('/offline.html');
                }
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});
```

---

### 5. Registering the Service Worker in React

In your React app entry point (e.g., `index.tsx`):

```ts
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
```

---

### 6. Caching Strategies in Streaming Context

- **Static assets:** Cache with cache-first strategy.
- **API data:** Use network-first for freshness, fallback to cache if offline.
- **Media streams:** Usually streamed live without caching; adaptive bitrate streaming buffers small chunks locally.

---

### 7. Benefits for Your Streaming App

- Faster load times after initial visit.
- Playback UI and controls available offline or on flaky networks.
- Reduced data usage by caching static resources.
- Ability to “install” app on user devices for better engagement.

---

## Service Worker Lifecycle

Service workers have a well-defined lifecycle:

### Install Event

- Triggered when the service worker is first registered.
- Ideal place to cache essential app assets.

```js
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('cache-v1').then(cache => cache.addAll(['/index.html', '/app.js']))
    );
});
```

### Activate Event

- Fired once the service worker is installed and takes control.
- Used to clean up old caches or perform upgrades.

```js
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== 'cache-v1').map(name => caches.delete(name))
            );
        })
    );
});
```

### Fetch Event

- Fires every time the controlled page makes a network request.
- Service worker intercepts these requests and decides whether to serve cached content or fetch from network.

```js
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});
```

---

## Importance of HTTPS for Service Worker Support

- Service workers require secure contexts (HTTPS or localhost).
- Ensures data integrity, confidentiality, and trust.
- Browsers enforce this strictly—PWAs won’t register service workers over HTTP.

---

## Limitations of Caching Large Video/Audio Files in PWAs

- **Storage limits:** Browsers limit cache size per origin.
- **Performance:** Caching large media can slow installation and fill user storage.
- **Streaming nature:** Live streaming data is constantly changing.

**Best practices:**

- Cache UI assets, small API responses, and metadata.
- Stream media live; use adaptive streaming (e.g., HLS/DASH) to buffer small chunks.
- Optionally cache small segments for offline playback, but avoid full-length video caching.

---

## Role of `manifest.json` in PWA App Metadata and Installability

The Web App Manifest is a JSON file that provides metadata about your PWA:

- **name** and **short_name**
- **icons** for different resolutions
- **theme_color** and **background_color**
- **display** mode (standalone, fullscreen, etc.)
- **start_url**

**Example:**

```json
{
    "name": "Streaming App",
    "short_name": "StreamApp",
    "start_url": "/index.html",
    "display": "standalone",
    "background_color": "#000000",
    "theme_color": "#1db954",
    "icons": [
        {
            "src": "/icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```



## Integrating a Live WebRTC Video Stream in a React Component

Integrating a live WebRTC video stream into a React component involves managing the `MediaStream` object and handling the component lifecycle for setup and cleanup.

### Key Steps

1. **Create or Receive a MediaStream**
    - Use `getUserMedia()` for local camera/mic, or receive a remote stream from a peer connection.

2. **Attach MediaStream to a `<video>` Element**
    - Set the `srcObject` property of the video element to the `MediaStream`.

3. **Manage Component Lifecycle**
    - On mount: Request the media stream and assign it to the video element.
    - On unmount: Stop all media tracks to release resources.

### Example React Component

```tsx
import React, { useEffect, useRef, useState } from 'react';

const LiveVideoStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
     let stream: MediaStream;

     async function startStream() {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
             videoRef.current.srcObject = stream;
          }
        } catch (err) {
          setError('Failed to access camera or microphone');
          console.error(err);
        }
     }

     startStream();

     return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
     };
  }, []);

  return (
     <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: 'auto' }} />
     </div>
  );
};

export default LiveVideoStream;
```

**Explanation:**
- `useRef` holds the video element for direct assignment of `srcObject`.
- `useEffect` handles setup and cleanup.
- On mount, requests the media stream and sets it to the video element.
- On unmount, stops all tracks to free resources.
- Handles errors and provides user feedback.

**Remote Streams:**  
For remote WebRTC streams, set the received `MediaStream` to the video element's `srcObject` in a similar way, typically in response to the `ontrack` event.

---

## Managing Video/Audio Streams and User Sessions with Redux

Redux centralizes application state, making it easier to manage video/audio streams and user sessions in a streaming app.

### State Shape Example

```ts
interface AppState {
  user: {
     id: string;
     name: string;
     isAuthenticated: boolean;
  };
  streams: {
     [streamId: string]: {
        id: string;
        status: 'loading' | 'active' | 'error' | 'ended';
        mediaStream?: MediaStream;
     };
  };
  currentStreamId?: string;
  error?: string;
}
```

### Actions

```ts
const START_STREAM = 'START_STREAM';
const STOP_STREAM = 'STOP_STREAM';
const SET_STREAM_STATUS = 'SET_STREAM_STATUS';
const USER_LOGIN = 'USER_LOGIN';
const USER_LOGOUT = 'USER_LOGOUT';
const SET_ERROR = 'SET_ERROR';
```

### Action Creators

```ts
const startStream = (streamId: string) => ({
  type: START_STREAM,
  payload: { streamId }
});

const setStreamStatus = (streamId: string, status: string) => ({
  type: SET_STREAM_STATUS,
  payload: { streamId, status }
});

const userLogin = (userData: {id: string; name: string}) => ({
  type: USER_LOGIN,
  payload: userData
});
```

### Reducers

```ts
const streamsReducer = (state = {}, action) => {
  switch(action.type) {
     case START_STREAM:
        return {
          ...state,
          [action.payload.streamId]: {
             id: action.payload.streamId,
             status: 'loading',
          }
        };
     case SET_STREAM_STATUS:
        return {
          ...state,
          [action.payload.streamId]: {
             ...state[action.payload.streamId],
             status: action.payload.status,
          }
        };
     case STOP_STREAM:
        const newState = { ...state };
        delete newState[action.payload.streamId];
        return newState;
     default:
        return state;
  }
};
```

### Middleware

- Use Redux Thunk for async actions (e.g., signaling, fetching metadata).
- Custom middleware for logging or handling socket messages.

**Example Thunk:**

```ts
const startStreamAsync = (streamId) => async (dispatch) => {
  dispatch(startStream(streamId));
  try {
     await signalingService.startStream(streamId);
     dispatch(setStreamStatus(streamId, 'active'));
  } catch (error) {
     dispatch(setStreamStatus(streamId, 'error'));
     dispatch(setError(error.message));
  }
};
```

**Benefits:**
- Centralized, predictable state.
- Easier UI synchronization and debugging.
- Testable reducers and actions.

---

## TypeScript in React/Redux Projects

TypeScript adds static typing, improving code quality and maintainability.

### Benefits

- **Type safety:** Catch errors at compile time.
- **IDE support:** Better autocomplete and refactoring.
- **Clear contracts:** Define shapes for props, state, and actions.

### Defining Types/Interfaces

**Component Props:**

```ts
interface VideoPlayerProps {
  streamUrl: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}
```

**Component State:**

```ts
interface PlayerState {
  volume: number;
  muted: boolean;
}

const [playerState, setPlayerState] = React.useState<PlayerState>({
  volume: 50,
  muted: false,
});
```

**Redux Actions:**

```ts
const START_STREAM = 'START_STREAM';

interface StartStreamAction {
  type: typeof START_STREAM;
  payload: { streamId: string };
}

type StreamActionTypes = StartStreamAction | StopStreamAction;
```

**Redux State:**

```ts
interface StreamState {
  streams: {
     [streamId: string]: {
        status: 'loading' | 'active' | 'error' | 'ended';
        mediaStream?: MediaStream;
     };
  };
}
```

**Summary:**  
TypeScript enforces contracts, improves safety, and enhances tooling for React/Redux projects.

---

## Optimizing React Performance for Multiple Video Streams

Rendering many video streams can be resource-intensive. Optimize with these strategies:

1. **React.memo:** Prevents unnecessary re-renders of components if props don't change.

    ```tsx
    const VideoStream = React.memo(({ stream }: { stream: MediaStream }) => {
      return <video autoPlay playsInline ref={videoRef => {
         if (videoRef && videoRef.srcObject !== stream) {
            videoRef.srcObject = stream;
         }
      }} />;
    });
    ```

2. **useCallback and useMemo:** Memoize callbacks and derived data.

    ```tsx
    const onPlay = useCallback(() => { /* ... */ }, []);
    const processedStreams = useMemo(() => streams.map(s => processStream(s)), [streams]);
    ```

3. **Stable Keys:** Use unique keys when rendering lists.

    ```tsx
    streams.map(stream => (
      <VideoStream key={stream.id} stream={stream.mediaStream} />
    ));
    ```

4. **Avoid Inline Functions/Objects:** Use memoized handlers to avoid triggering re-renders.

5. **Direct MediaStream Assignment:** Use refs to assign `srcObject` directly.

    ```tsx
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
      if (videoRef.current) {
         videoRef.current.srcObject = stream;
      }
    }, [stream]);
    ```

6. **Batch State Updates:** Debounce or throttle updates when many streams change.

7. **Virtualization:** For large lists, use `react-window` or `react-virtualized`.

8. **CSS/DOM Optimization:** Use GPU-accelerated CSS, avoid heavy effects.

9. **Redux State:** Keep only essential data in Redux, use selectors for derived data.

**Summary:**  
Memoize components and handlers, use refs for video elements, batch updates, and virtualize large lists for optimal performance.

---

## Role of Manifest File in a PWA

The manifest file (`manifest.json`) provides metadata for PWAs, enabling installability and native-like behavior.

### Key Roles

- **App Metadata:** Name, description, language, etc.
- **Installability:** Allows "Add to Home Screen" prompts.
- **Icons:** Specifies icons for various device resolutions.
- **Display Mode:** Controls app launch mode (standalone, fullscreen, etc.).
- **Theme/Background Colors:** Sets UI and splash screen colors.
- **Orientation:** Locks screen orientation.

### Example `manifest.json`

```json
{
  "name": "My Streaming PWA",
  "short_name": "StreamApp",
  "description": "Watch live and recorded video streams seamlessly",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#1e90ff",
  "orientation": "portrait",
  "icons": [
     {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
     },
     {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
     }
  ]
}
```

**How It Works:**
- Linked in HTML: `<link rel="manifest" href="/manifest.json" />`
- Browser checks for HTTPS, valid manifest, and service worker for installability.
- Controls app icon, splash screen, and launch behavior.

**Summary:**  
The manifest file is essential for PWA installability, appearance, and native-like experience.

---

## Implementing a WebSocket Server in Node.js

WebSocket servers enable real-time communication, essential for signaling in WebRTC apps.

### Using `ws` Library

**Install:**
```bash
npm install ws
```

**Server Example:**
```js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
     // Broadcast to all other clients
     wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
     });
  });
});
```

### Using `socket.io`

**Install:**
```bash
npm install socket.io
```

**Server Example:**
```js
const { Server } = require("socket.io");
const io = new Server(3000);

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
     socket.broadcast.emit("message", msg);
  });
});
```

### Broadcasting Media Signals

For WebRTC, signaling messages (SDP, ICE) are sent over WebSocket:

```js
socket.on("signal", (data) => {
  io.to(data.to).emit("signal", {
     from: socket.id,
     signalData: data.signalData,
  });
});
```

**Summary:**  
Use `ws` for simple servers or `socket.io` for advanced features. Broadcast by iterating clients or using `broadcast.emit`. WebSocket is commonly used for WebRTC signaling.

---

## Designing a WebRTC Signaling Server with Node/Express

A signaling server coordinates the exchange of SDP and ICE candidates between WebRTC peers.

### Responsibilities

- Manage peer discovery and rooms.
- Forward SDP offers/answers and ICE candidates.
- Handle connection states and cleanup.

### Example Implementation (Node.js + Express + ws)

```js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
     try {
        const data = JSON.parse(message);
        switch (data.type) {
          case 'join':
             joinRoom(ws, data.roomId);
             break;
          case 'offer':
          case 'answer':
          case 'ice-candidate':
             broadcastToRoom(ws, data.roomId, data);
             break;
        }
     } catch (err) {
        console.error('Invalid message', err);
     }
  });

  ws.on('close', () => {
     leaveAllRooms(ws);
  });
});

function joinRoom(ws, roomId) {
  if (!rooms[roomId]) rooms[roomId] = new Set();
  rooms[roomId].add(ws);
  ws.roomId = roomId;
  ws.send(JSON.stringify({ type: 'joined', roomId }));
}

function broadcastToRoom(sender, roomId, message) {
  if (!rooms[roomId]) return;
  rooms[roomId].forEach((client) => {
     if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
     }
  });
}

function leaveAllRooms(ws) {
  const roomId = ws.roomId;
  if (roomId && rooms[roomId]) {
     rooms[roomId].delete(ws);
     if (rooms[roomId].size === 0) delete rooms[roomId];
  }
}

server.listen(8080, () => {
  console.log('Signaling server running on port 8080');
});
```

### How It Works

- Clients connect and join a room.
- Offers, answers, and ICE candidates are broadcast to other peers in the room.
- On disconnect, clients are removed from rooms.

**Summary:**  
A signaling server enables peer discovery and message exchange for WebRTC. Use WebSocket for real-time messaging and manage rooms for group signaling.











## Handling Large Binary Payloads or File Uploads in Node.js Without Blocking the Event Loop

### Problem Overview

Node.js operates on a single-threaded event loop. Inefficient handling of large files or binary data can block this loop, causing delays and degrading server performance.

### Strategies for Efficient Handling

#### 1. Use Streams

- **Streams** process data in chunks, avoiding loading the entire payload into memory.
- They are event-driven and non-blocking.

**Example: File Upload with Streams**

```js
const fs = require('fs');
const express = require('express');
const app = express();

app.post('/upload', (req, res) => {
    const writeStream = fs.createWriteStream('./uploads/large-file');
    req.pipe(writeStream);

    writeStream.on('finish', () => {
        res.send('File uploaded successfully!');
    });

    writeStream.on('error', (err) => {
        console.error(err);
        res.status(500).send('Upload error');
    });
});
```

#### 2. Use Multipart Parsing Libraries

- Libraries like **multer**, **busboy**, or **formidable** efficiently parse file uploads using streams internally.

**Example with multer:**

```js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('video'), (req, res) => {
    res.send('File received');
});
```

#### 3. Avoid Buffering Entire Payloads

- Do **not** buffer all chunks into a single variable for large files.
- This leads to high memory usage and event loop blocking.

#### 4. Handle Backpressure

- Streams support backpressure, signaling when the destination can't handle more data.
- Prevents overwhelming memory or CPU.

#### 5. Offload Heavy Processing

- Offload CPU-bound tasks (e.g., video encoding) to worker threads or external services.
- Use queues (RabbitMQ, Kafka) to decouple upload from processing.

#### 6. Binary WebSocket Streams

- For binary data over WebSocket, use `Buffer` objects and process data in chunks.
- Avoid concatenating large buffers; process or forward as data arrives.

**Summary:**  
Use streams and libraries like multer for efficient file uploads. Avoid buffering large payloads, handle backpressure, and offload heavy tasks to prevent blocking the Node.js event loop.

---

## Detecting and Preventing Memory Leaks in Node.js

### What is a Memory Leak?

A memory leak occurs when your application retains references to objects that are no longer needed, preventing garbage collection and causing memory usage to grow over time.

### Common Causes

- Unintentional global variables.
- Closures holding onto variables.
- Unremoved event listeners.
- Unbounded caching.
- Unclosed resources (file handles, DB connections).
- Large objects retained in memory.

### Detection Techniques

#### 1. Monitoring Tools

- `process.memoryUsage()`: Programmatically check heap and RSS sizes.
- **Node.js Inspector & Chrome DevTools**: Start with `node --inspect your-app.js`, then open `chrome://inspect` in Chrome.
- **Heap Snapshots**: Take and compare snapshots over time.
- **clinic.js**: Use `clinic doctor` or `clinic heap` for profiling.
- **heapdump**: Generate heap snapshots programmatically.
- **Logging**: Log memory usage at intervals to spot gradual growth.

**Example: Log Memory Usage**

```js
setInterval(() => {
    const used = process.memoryUsage();
    console.log(`Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}, 60000);
```

#### 2. Heap Snapshot Analysis

- Run with `--inspect`, open Chrome DevTools → Memory tab.
- Take snapshots at intervals and compare for growing objects.

### Prevention Techniques

- Remove event listeners when not needed.
- Avoid unnecessary global variables.
- Limit cache size and implement eviction.
- Release references to large objects.
- Properly close file handles and DB connections.
- Use weak references or `FinalizationRegistry` for advanced cleanup.

**Summary:**  
Detect leaks by monitoring memory, taking heap snapshots, and profiling. Prevent leaks by cleaning up listeners, limiting caches, and closing resources. Use tools like Chrome DevTools, clinic.js, and heapdump for analysis.

---

## Scaling Node.js Servers and Handling Stateful WebSocket Connections

### Scaling Node.js for High Traffic

#### 1. Node.js Single Thread Limitation

- Node.js runs on a single thread per process.
- To utilize multi-core CPUs, run multiple processes.

#### 2. Cluster Module

- Use Node.js `cluster` module to fork worker processes sharing the same server port.

**Example:**

```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) cluster.fork();
    cluster.on('exit', (worker) => cluster.fork());
} else {
    http.createServer((req, res) => {
        res.end('Hello from worker ' + process.pid);
    }).listen(3000);
}
```

#### 3. External Load Balancer

- Use Nginx, HAProxy, or cloud load balancers to distribute traffic across multiple servers or containers.

### Challenges with Stateful WebSocket Connections

- WebSockets are stateful and long-lived.
- HTTP is stateless; WebSocket connections must be routed to the same backend instance.

#### Key Challenges

- **Sticky Sessions**: Ensure all messages for a client go to the same server.
- **Connection State Sharing**: If a client reconnects to a different instance, state may be lost.
- **Broadcasting**: Messages must be shared across all instances.

### Solutions

#### 1. Sticky Sessions

- Configure the load balancer for session affinity (by IP or cookie).
- Ensures a client always connects to the same backend.

#### 2. External Session Store

- Use Redis or similar for shared state and pub/sub.
- Servers subscribe to Redis channels to broadcast messages.

**Example with socket.io and Redis:**

```js
const io = require('socket.io')(server);
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));
```

#### 3. Stateless Design / SFUs

- Use SFU (Selective Forwarding Unit) servers for media routing in video streaming.
- Reduces load on Node.js app servers.

### Summary Table

| Aspect                  | Solution                        |
|-------------------------|---------------------------------|
| Multi-core CPU          | Node.js cluster module          |
| Multiple servers        | Load balancer (Nginx, AWS ELB)  |
| Stateful WebSocket      | Sticky sessions or Redis pub/sub|
| Broadcasting messages   | Redis or message bus            |
| Video streaming scaling | SFU/media server                |

**Summary:**  
Scale Node.js with the cluster module and load balancers. For stateful WebSockets, use sticky sessions or Redis for shared state and broadcasting. Use SFUs for scalable media streaming.





## Database Design and Real-Time Communication

### Designing a PostgreSQL Schema for a Streaming App

A robust schema for a streaming app should be normalized, scalable, and efficient. Here’s a typical design covering user profiles, stream sessions, chat messages, and related data:

#### Key Entities

- **Users**: Stores user info and authentication.
- **Streams**: Represents each streaming session, with metadata and host.
- **Stream Participants**: Maps users to streams (many-to-many).
- **Chat Messages**: Stores messages linked to streams and users.

#### Example Schema

```sql
-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Streams table
CREATE TABLE streams (
    stream_id SERIAL PRIMARY KEY,
    host_user_id INT REFERENCES users(user_id),
    title VARCHAR(255),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) -- e.g., 'live', 'ended'
);

-- Stream participants
CREATE TABLE stream_participants (
    stream_id INT REFERENCES streams(stream_id),
    user_id INT REFERENCES users(user_id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (stream_id, user_id)
);

-- Chat messages
CREATE TABLE chat_messages (
    message_id SERIAL PRIMARY KEY,
    stream_id INT REFERENCES streams(stream_id),
    user_id INT REFERENCES users(user_id),
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Notes:**
- Use foreign keys for integrity.
- Add indexes on frequently queried columns.
- Consider partitioning large tables (e.g., `chat_messages`).
- Use `JSONB` columns for flexible metadata if needed.
- Use UUIDs for global uniqueness if required.

**Sample Query:** Get active streams with participant counts:

```sql
SELECT s.stream_id, s.title, s.status, COUNT(sp.user_id) AS participant_count
FROM streams s
LEFT JOIN stream_participants sp ON s.stream_id = sp.stream_id
WHERE s.status = 'live'
GROUP BY s.stream_id;
```

---

### ORM vs. Raw SQL in Node.js

**ORMs (e.g., Sequelize, TypeORM):**

**Pros:**
- Higher productivity and abstraction.
- Cross-database compatibility.
- Model definitions with validation and relations.
- Built-in migrations, transactions, and query builders.
- Safer parameter binding (prevents SQL injection).

**Cons:**
- Performance overhead for complex queries.
- Learning curve and abstraction leakage.
- Limited flexibility for advanced SQL features.

**Raw SQL:**

**Pros:**
- Full control and optimization.
- Easier to use advanced SQL features.
- No abstraction overhead.

**Cons:**
- More boilerplate and manual parameter handling.
- Higher risk of SQL injection if not careful.
- Harder to maintain and less type safety.

**Practical Approach:**  
Use ORM for most CRUD and simple queries; use raw SQL for performance-critical or complex operations.

**Example:**

_Sequelize ORM:_
```js
const users = await User.findAll({
  where: { active: true },
  order: [['createdAt', 'DESC']],
  limit: 10
});
```

_Raw SQL (pg):_
```js
const res = await client.query(
  'SELECT * FROM users WHERE active = $1 ORDER BY created_at DESC LIMIT 10',
  [true]
);
const users = res.rows;
```

---

### Using Transactions in PostgreSQL

Transactions ensure atomicity: all operations succeed or none do.

**Example (Node.js with `pg`):**

```js
const { Client } = require('pg');
const client = new Client();

async function createStreamingSession(userId, streamData) {
  try {
    await client.connect();
    await client.query('BEGIN');

    const res = await client.query(
      `INSERT INTO streaming_sessions(user_id, stream_url, status)
       VALUES ($1, $2, 'active') RETURNING id`,
      [userId, streamData.url]
    );
    const sessionId = res.rows[0].id;

    await client.query(
      `UPDATE users SET streaming_status = 'active' WHERE id = $1`,
      [userId]
    );

    await client.query(
      `INSERT INTO activity_logs(user_id, activity)
       VALUES ($1, 'Started streaming session: ' || $2)`,
      [userId, sessionId]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}
```

**Notes:**
- Always rollback on error.
- Keep transactions short to avoid locks.
- Use savepoints for partial rollbacks if needed.

---

### Connection Pooling with PostgreSQL

**What:**  
Connection pooling reuses a set of open database connections, reducing overhead and resource usage.

**Why:**  
- Prevents exhausting PostgreSQL’s connection limits.
- Reduces latency from frequent connection setup/teardown.
- Handles concurrent requests efficiently.

**Example (Node.js `pg`):**

```ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'dbuser',
  host: 'localhost',
  database: 'streaming_app',
  password: 'secretpassword',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function getUserById(userId: number) {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    return res.rows[0];
  } finally {
    client.release();
  }
}
```

**Tips:**
- Tune pool size for your workload.
- Always release connections after use.

---

### Using JSON/JSONB Columns for Flexible Data

**When:**  
Store semi-structured or evolving metadata (e.g., stream settings, analytics).

**How:**

```sql
CREATE TABLE streams (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT now()
);

-- Insert
INSERT INTO streams (user_id, metadata)
VALUES (1, '{"codec": "H264", "resolution": "1080p", "bitrate": 5000}');

-- Query
SELECT metadata->>'codec' AS codec
FROM streams
WHERE metadata->>'resolution' = '1080p';
```

**Advantages:**
- Flexible schema.
- Efficient querying and indexing (with JSONB and GIN indexes).

**Disadvantages:**
- No strict schema enforcement.
- More complex queries.
- Slightly higher storage and write overhead.

**Indexing Example:**
```sql
CREATE INDEX idx_streams_metadata ON streams USING GIN (metadata);
```

---

### High Availability and Fault Tolerance for PostgreSQL

**Key Strategies:**

1. **Replication**
   - Streaming replication (asynchronous/synchronous) for redundancy.
   - Logical replication for selective data sync.
   - Failover and promotion for standby servers.

2. **Backups**
   - Regular base backups (e.g., `pg_basebackup`).
   - WAL archiving for point-in-time recovery.
   - Use tools like pgBackRest, Barman, or managed cloud backups.

3. **Connection Pooling**
   - Use PgBouncer or similar to manage connections.

4. **Load Balancing**
   - Distribute reads to replicas (e.g., Pgpool-II).

5. **Monitoring**
   - Monitor replication lag, health, and performance (Prometheus, Grafana).

6. **HA Architectures**
   - Active-passive (primary + hot standby).
   - Multi-primary (sharding, e.g., Citus) for advanced scaling.

**Summary:**  
Combine replication, backups, pooling, and monitoring for resilient PostgreSQL deployments.

---

### ACID Compliance and Its Importance

**ACID Principles:**
- **Atomicity:** All-or-nothing transactions.
- **Consistency:** Database remains valid after transactions.
- **Isolation:** Concurrent transactions don’t interfere.
- **Durability:** Committed data survives crashes.

**Why Important for Streaming Apps:**
- Ensures accurate session tracking and billing.
- Prevents partial updates or data corruption.
- Guarantees reliable multi-step operations.

**Example:**

```sql
BEGIN;
INSERT INTO sessions (user_id, start_time) VALUES (123, NOW());
UPDATE billing SET amount_due = amount_due + 5.00 WHERE user_id = 123;
COMMIT;
```

---

### Efficient Batch Operations and Cleanup

**Best Practices:**
- Break large tasks into small batches (e.g., 1000 rows at a time).
- Schedule during off-peak hours.
- Archive old data instead of immediate deletion.
- Use partitioning for large tables.
- Run cleanup as background jobs (e.g., with Bull, RabbitMQ).
- Use `VACUUM` and `ANALYZE` after cleanup.

**Example: Archive Old Logs**

```sql
-- Move old logs to archive
INSERT INTO logs_archive
SELECT * FROM logs WHERE created_at < NOW() - INTERVAL '6 months' LIMIT 1000;

-- Delete archived logs from main table
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '6 months' LIMIT 1000;
```

**Automate in Node.js:**
```ts
async function archiveOldLogs() {
  const batchSize = 1000;
  let rowsAffected = 0;
  do {
    await client.query('BEGIN');
    try {
      const insertRes = await client.query(
        `INSERT INTO logs_archive
         SELECT * FROM logs
         WHERE created_at < NOW() - INTERVAL '6 months'
         LIMIT $1 RETURNING id`, [batchSize]
      );
      const ids = insertRes.rows.map(r => r.id);
      if (ids.length === 0) {
        rowsAffected = 0;
        await client.query('COMMIT');
        break;
      }
      await client.query('DELETE FROM logs WHERE id = ANY($1)', [ids]);
      await client.query('COMMIT');
      rowsAffected = ids.length;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } while (rowsAffected === batchSize);
}
```

---

## Real-Time Communication: WebRTC Connection Steps

Establishing a WebRTC connection between two browsers involves:

1. **Signaling**  
   Exchange SDP offers/answers and ICE candidates via a signaling server (e.g., WebSocket).

2. **Create PeerConnections**  
   Each browser creates an `RTCPeerConnection` with STUN/TURN config.

   ```js
   const peer = new RTCPeerConnection(config);
   ```

3. **Offer/Answer Model (SDP)**
   - Caller creates and sends an SDP offer.
   - Callee sets remote description, creates and sends an SDP answer.
   - Caller sets answer as remote description.

4. **ICE Candidate Gathering**
   - Each peer gathers ICE candidates and sends them via signaling.

   ```js
   peer.onicecandidate = (event) => {
     if (event.candidate) {
       sendToPeerViaSignaling(event.candidate);
     }
   };
   ```

5. **Connectivity Checks**
   - WebRTC tests network paths and establishes the best route.

6. **Media/Data Exchange**
   - Once connected, peers exchange media streams or data channels.

   ```js
   peer.addTrack(localAudioTrack);
   peer.ontrack = (event) => { /* render remote stream */ };
   ```

**Summary Table:**

| Step                | Purpose                        |
|---------------------|-------------------------------|
| Signaling           | Exchange SDP + ICE info        |
| RTCPeerConnection   | Initialize peer connection     |
| Offer/Answer        | Negotiate media capabilities   |
| ICE Gathering       | Discover network paths         |
| Connectivity Checks | Find viable route              |
| Media/Data Transfer | Stream video/audio/data        |

**Flow Diagram:**

```
Peer A                    Signaling Server                  Peer B
------                    ------------------                ------
Create RTCPeerConnection                               Create RTCPeerConnection
Create Offer --------->                               
                       --> Send Offer -->
                                                     <-- Set Remote Description
                                                     <-- Create Answer
                       <-- Receive Answer <--
Set Remote Description <--

ICE Gathering & Exchange <--> ICE Gathering & Exchange

Connection Established ✅
```




## WebRTC: STUN, TURN, ICE, and SDP Explained

### What is the role of STUN and TURN servers in WebRTC?

WebRTC enables peer-to-peer (P2P) communication between browsers, but direct connections are often blocked by NATs and firewalls. To overcome this, WebRTC uses ICE (Interactive Connectivity Establishment), which leverages STUN and TURN servers:

#### STUN (Session Traversal Utilities for NAT)
- **Purpose:** Helps a peer discover its public IP address and port as seen from the internet.
- **How it works:** The client sends a request to a STUN server, which replies with the public-facing IP and port.
- **Use case:** Enables direct P2P connections when NAT/firewall allows.
- **Example:**
    ```js
    const peer = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    ```

#### TURN (Traversal Using Relays around NAT)
- **Purpose:** Relays data between peers when direct connection is not possible (e.g., symmetric NATs, strict firewalls).
- **How it works:** The TURN server relays all media/data between peers.
- **Use case:** Ensures connection reliability as a fallback.
- **Example:**
    ```js
    const peer = new RTCPeerConnection({
        iceServers: [{
            urls: 'turn:turn.example.com:3478',
            username: 'user',
            credential: 'pass'
        }]
    });
    ```

#### Why are they necessary?
| Server | Use Case                        | Pros                        | Cons                        |
|--------|---------------------------------|-----------------------------|-----------------------------|
| STUN   | NAT traversal, direct discovery | Low latency, direct         | Fails in strict networks    |
| TURN   | Relay fallback                  | Works in all cases          | High bandwidth, adds latency|

**If no TURN server is available:**  
If STUN fails (due to strict NAT/firewall) and TURN is not configured, the WebRTC connection will fail—no media or data will be exchanged.

**Summary Table:**
| Feature   | STUN                | TURN                       |
|-----------|---------------------|----------------------------|
| Purpose   | Discover public IP  | Relay traffic              |
| Data Path | Peer-to-peer        | Peer → TURN → Peer         |
| Required? | Optional (default)  | Recommended for fallback   |
| Performance | High              | Medium/Low (relaying)      |
| Cost      | Free/Public         | Often paid/hosted          |

---

### How do ICE candidates work in WebRTC, and how are they exchanged?

#### What is ICE?
ICE (Interactive Connectivity Establishment) is a framework for discovering the best network path between two peers, even behind NATs/firewalls.

#### What are ICE candidates?
An ICE candidate is a possible network address (IP + port) for communication. Types:
- **Host:** Local machine (LAN IPs)
- **Server Reflexive:** Public IP/port via STUN
- **Relay:** Public relay via TURN

#### ICE Process Overview
1. **Gathering Candidates:**  
     Each peer collects all possible candidates (host, STUN, TURN).
     ```js
     peer.onicecandidate = (event) => {
         if (event.candidate) {
             sendToRemotePeer({ type: "ice-candidate", candidate: event.candidate });
         }
     };
     ```
2. **Exchange via Signaling:**  
     Candidates are exchanged using a signaling server (e.g., WebSocket).
     ```js
     // Sending
     peer.onicecandidate = ({ candidate }) => {
         if (candidate) signalingChannel.send({ type: "ice-candidate", candidate });
     };
     // Receiving
     signalingChannel.onmessage = (msg) => {
         if (msg.type === "ice-candidate") {
             peer.addIceCandidate(new RTCIceCandidate(msg.candidate));
         }
     };
     ```
3. **Pairing & Connectivity Checks:**  
     Peers test candidate pairs to find a working path.
4. **Selection:**  
     The best (usually lowest-latency) path is chosen.

**Why is ICE important?**  
It enables WebRTC to work across diverse network conditions, NATs, and firewalls, ensuring optimal, low-latency connections.

---

### What is SDP (Session Description Protocol) in WebRTC?

#### What is SDP?

SDP (Session Description Protocol) is a text-based format used to describe multimedia communication sessions, such as audio and video streams. In WebRTC, SDP is exchanged between peers to negotiate media capabilities, codecs, IP addresses, ports, encryption, and other session parameters.

#### When is SDP Used?

SDP is used during the connection setup phase, following the Offer/Answer model:

- **Peer A** creates an SDP offer using `createOffer()`.
- **Peer B** responds with an SDP answer using `createAnswer()`.
- These are exchanged via a signaling server (e.g., WebSocket).

#### Example SDP Snippet

```plaintext
v=0
o=- 20518 0 IN IP4 192.168.1.2
s=-
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000
m=video 51372 RTP/AVP 31
a=rtpmap:31 H261/90000
```

#### What Information Does SDP Contain?

| Field         | Description                                      |
|---------------|--------------------------------------------------|
| `v=`          | Version of SDP (always 0)                        |
| `o=`          | Origin: username, session ID, version, IP        |
| `s=`          | Session name                                     |
| `t=`          | Timing (start and stop times)                    |
| `m=`          | Media description (type, port, transport, format)|
| `a=`          | Attributes (codecs, direction, ICE info, etc.)   |
| `c=`          | Connection information (IP address)              |
| `ice-ufrag`, `ice-pwd` | ICE credentials for connectivity        |
| `fingerprint` | DTLS fingerprint for encryption                  |
| `rtcp-mux`    | Indicates RTP and RTCP are multiplexed           |

#### How Is SDP Used in WebRTC?

```js
const peer = new RTCPeerConnection();

// Create offer
peer.createOffer().then(offer => {
    return peer.setLocalDescription(offer); // stores it locally
    // Send offer.sdp to remote peer via signaling
});

// On the remote peer:
peer.setRemoteDescription(new RTCSessionDescription(offer));
peer.createAnswer().then(answer => {
    return peer.setLocalDescription(answer);
    // Send answer.sdp back via signaling
});
```

**Key Notes:**
- SDP is not encrypted, but is exchanged over a secure signaling channel (e.g., WebSocket over HTTPS).
- Contains all media negotiation parameters.
- Manual editing of SDP is rare and only for advanced use cases.

---

## Reducing Bundle Size in React/TypeScript Applications

A smaller bundle leads to faster page loads, better Time to Interactive (TTI), and reduced bandwidth usage—especially important for low-end devices or slow networks.

### Techniques to Reduce Bundle Size

#### 1. Tree Shaking

- Removes unused code during bundling.
- Works best with ES Modules (ESM).
- Use libraries that support ESM (avoid CommonJS where possible).

#### 2. Code Splitting

- Breaks the bundle into smaller chunks loaded on-demand.
- In React, use `React.lazy()` and `<Suspense>`:

```tsx
const Component = React.lazy(() => import('./Component'));
// ...
<Suspense fallback={<div>Loading...</div>}>
    <Component />
</Suspense>
```

#### 3. Dynamic Imports

- Load only what’s needed for a specific route/component.
- Works well with routing (e.g., React Router, Next.js `dynamic()`).

#### 4. Remove Dead Code

- Avoid leaving test/debug logic in production.
- Use tools like `babel-plugin-transform-remove-console` to remove `console.log` in production.

#### 5. Use Lightweight Libraries

- Replace bulky libraries (e.g., use `date-fns` instead of `moment`).
- Use `lodash-es` with tree shaking instead of full `lodash`.

#### 6. Bundle Analyzer

- Use `webpack-bundle-analyzer` or `source-map-explorer` to visualize and reduce bundle size.

```bash
npm run build && npx source-map-explorer 'build/static/js/*.js'
```

#### 7. Optimize Webpack Config

- Enable production mode (`mode: 'production'`).
- Use `TerserPlugin` for minification.

#### 8. Avoid Unnecessary Polyfills

- Don’t include full polyfills unless targeting legacy browsers.

---

## Lazy Loading in React

### What is Lazy Loading?

Lazy loading means loading components or assets only when needed, rather than at initial page load. This reduces the initial bundle size and improves performance, especially Time to Interactive (TTI).

### How to Lazy Load Components in React

React provides built-in support via `React.lazy()` and `Suspense`.

**Example:**

```tsx
import React, { Suspense } from 'react';

const VideoPlayer = React.lazy(() => import('./VideoPlayer'));

function App() {
    return (
        <div>
            <h1>My App</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <VideoPlayer />
            </Suspense>
        </div>
    );
}
```

#### Best Practices

- Split routes/components: Use lazy loading for routes, modals, tabs, or feature-heavy components.
- **React Router Example:**

```tsx
const Home = React.lazy(() => import('./Home'));
const About = React.lazy(() => import('./About'));

<Routes>
    <Route path="/" element={
        <Suspense fallback={<div>Loading...</div>}>
            <Home />
        </Suspense>
    } />
    <Route path="/about" element={
        <Suspense fallback={<div>Loading...</div>}>
            <About />
        </Suspense>
    } />
</Routes>
```

- **Next.js Example:**

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});
```

- Preload important assets: Use `rel="preload"` in HTML or preload critical chunks for perceived speed.

---

## Caching Strategies for Performance

### 1. HTTP Caching Headers

Use HTTP headers to instruct browsers or proxies to cache responses.

- **Cache-Control:** e.g., `max-age=3600, public` to cache for 1 hour.
- **ETag:** Allows clients to validate if a resource has changed.
- **Expires:** Time after which resource is stale.

*Benefits:* Reduces server load and speeds up repeated requests.

### 2. In-memory Caching

Use Redis or Memcached for storing frequently accessed data or results.

- Cache DB query results to avoid expensive calls.
- Store user sessions or tokens.
- Set TTL (time to live) to expire stale data.

**Example in Node.js using Redis:**

```js
const redis = require('redis');
const client = redis.createClient();

async function getUser(userId) {
    const cachedUser = await client.get(`user:${userId}`);
    if (cachedUser) {
        return JSON.parse(cachedUser);
    }
    const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    await client.setEx(`user:${userId}`, 3600, JSON.stringify(user));
    return user;
}
```

### 3. Content Delivery Network (CDN)

Use CDNs (e.g., Cloudflare, AWS CloudFront, Akamai) for caching static assets globally.

- Reduces latency by serving assets from edge locations near users.
- Useful for videos, images, JS, CSS, and other static content.

### 4. Application-level Cache

Cache computed results or API responses inside the app memory (e.g., LRU cache).

- Suitable for short-lived, frequently accessed data.
- Beware of memory leaks or excessive memory consumption.

---
