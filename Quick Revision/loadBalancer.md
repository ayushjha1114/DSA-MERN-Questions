# ⚖️ Load Balancing in System Design

## ✅ What is Load Balancing?

Load balancing is the process of distributing incoming network traffic across multiple servers to ensure no single server becomes overwhelmed. This improves performance, ensures high availability, and supports scalability.

---

## 🧠 Why Use Load Balancing?

- Distribute load across multiple servers.
- Increase availability and reliability.
- Improve fault tolerance (if one server fails, others can pick up the load).
- Ensure scalability by adding more servers as traffic grows.

---

## 📦 Types of Load Balancers

### 1. Layer 4 (Transport Layer) Load Balancer

- Operates at the TCP/UDP level (IP + port).
- Simply forwards requests to available servers based on algorithms like **Round Robin**, **Least Connections**, etc.

### 2. Layer 7 (Application Layer) Load Balancer

- Operates at the HTTP/HTTPS level.
- Makes decisions based on HTTP headers, cookies, URLs, etc.
- Handles complex routing (e.g., redirecting traffic to different services).

---

## 🧑‍💻 Load Balancing Algorithms

| **Algorithm**          | **Description**                                      | **Use Case**                                              |
|-------------------------|------------------------------------------------------|----------------------------------------------------------|
| **Round Robin**         | Distributes requests evenly to all servers.          | General use, if servers have similar capabilities.       |
| **Least Connections**   | Sends requests to the server with the least active connections. | High traffic apps where server load varies.             |
| **IP Hash**             | Routes requests from the same IP to the same server. | Useful for session persistence (sticky sessions).        |
| **Weighted Round Robin**| Sends more traffic to more powerful servers.         | Mixed hardware environments (some servers are stronger). |

---

## 📦 Types of Load Balancers

### 1. Hardware Load Balancer

- Physical appliances.
- Expensive but provide advanced features like **SSL termination**, **DDoS protection**, etc.
- Used in large-scale enterprise environments.

### 2. Software Load Balancer

- Runs on general-purpose servers or cloud infrastructure.
- Flexible and cost-effective (e.g., **Nginx**, **HAProxy**).

---

## 🖥️ Popular Load Balancers

- **Nginx**: Lightweight, popular open-source software for HTTP load balancing.
- **HAProxy**: High-performance load balancer often used for TCP and HTTP applications.
- **AWS Elastic Load Balancer (ELB)**: Managed service from AWS for automatic scaling and load balancing in the cloud.
- **NGINX Plus**: Premium version of Nginx with extra features like monitoring.

---

## 🚀 Scaling with Load Balancing

Horizontal scaling (adding more servers) works well with load balancing. Here’s an example of how it fits into a typical system:

```
Client → Load Balancer → Application Servers → Database
```

---

## 🛡️ Failover and Redundancy

- **Health checks**: Load balancers periodically check if servers are healthy (e.g., pinging `/health` endpoint).
- **Failover**: If one server fails, the load balancer reroutes traffic to healthy ones.

---

## 🧑‍💻 Example: Load Balancing with Nginx

### Nginx Configuration:

```nginx
http {
    upstream backend {
        server 192.168.1.1;
        server 192.168.1.2;
        server 192.168.1.3;
    }

    server {
        location / {
            proxy_pass http://backend;
        }
    }
}
```

In this configuration, requests to your app are distributed among `192.168.1.1`, `192.168.1.2`, and `192.168.1.3` based on the chosen algorithm.

---

## 🔄 How Do You Choose the Right Load Balancing Algorithm?

When choosing a load balancing algorithm, consider:

- **Request Type (Stateless vs. Stateful):**
  - Stateless: Round-robin (simple, evenly distributes load).
  - Stateful: Least connections (direct requests to servers with fewer active connections).

- **Performance Needs:**
  - Least Connections: Ideal for variable request duration, prevents overloading.
  - Weighted Round Robin: For servers with different capacities (e.g., powerful servers get more traffic).

- **Geo-distribution:**
  - Geographic Load Balancing: Route users to servers in their region to reduce latency.

🧠 **TL;DR**: Round Robin for basic traffic, Least Connections for varying request loads, Weighted Round Robin for capacity differences.

---

## 🛠️ How Do You Handle Server Failures in a Distributed System?

- **Health Checks**: Regularly monitor server health and mark failed servers as unavailable.
- **Auto-scaling**: Automatically add new servers when failures occur, or when the load increases.
- **Failover Mechanisms**: In case of failure, route traffic to healthy servers or use replication (e.g., database failover).
- **Graceful Shutdowns**: Ensure servers can handle traffic rerouting during maintenance or failures.
- **Redundancy**: Implement redundancy at multiple levels (e.g., multiple availability zones, database replicas).

🧠 **TL;DR**: Monitor servers, auto-scale, failover, and add redundancy.

---

## 📊 What Is the Difference Between Horizontal and Vertical Scaling?

| **Scaling Type**       | **Description**                                      | **When to Use**                                           |
|-------------------------|------------------------------------------------------|----------------------------------------------------------|
| **Horizontal Scaling**  | Add more machines (servers) to handle load.          | More traffic or high availability (e.g., cloud-native apps). |
| **Vertical Scaling**    | Add more resources (CPU/RAM) to a single machine.    | Limited infrastructure or non-distributed workloads (e.g., databases). |

🧠 **TL;DR**: Horizontal scaling adds servers; Vertical scaling adds power to one machine.

---

## 🌍 How Would You Set Up Load Balancing for a Multi-Region Application?

- **Global Load Balancer**:
  - Use a global load balancer (e.g., AWS Route 53, Cloudflare, Azure Traffic Manager) to direct traffic to the nearest region based on latency or geographic location.

- **Health Checks & Failover**:
  - If a region goes down, automatically route traffic to a backup region.

- **DNS-based Load Balancing**:
  - Use DNS-based methods for distributing requests based on user location or load.

- **CDN**:
  - Cache static content (images, videos) in a CDN so users get faster responses regardless of region.

🧠 **TL;DR**: Use global load balancers to route traffic to the nearest region for better performance and failover.

---

## 🔒 How Do You Ensure Session Persistence (Sticky Sessions) in a Load-Balanced System?

- **Session Cookies**:
  - Configure load balancers to use session cookies to remember which server to route traffic to for a user’s session.

- **IP Hashing**:
  - Route requests from the same IP address to the same server to maintain session continuity.

- **Sticky Sessions on Load Balancers**:
  - Use sticky sessions or session affinity on the load balancer (e.g., Nginx or AWS ELB) to ensure the same server handles all requests from a user in a session.

- **Distributed Caching**:
  - Use a distributed cache (e.g., Redis) to store session data so that multiple servers can access the same session state.

🧠 **TL;DR**: Use sticky sessions (cookies/IP hash) or distributed cache to ensure session consistency across servers.

---

## ⚡ Summary

| **Question**                     | **Key Focus**                                |
|-----------------------------------|----------------------------------------------|
| Choosing Load Balancer Algorithm | Request type, performance, server capacity   |
| Handling Server Failures         | Health checks, auto-scaling, redundancy, failover |
| Horizontal vs. Vertical Scaling  | Horizontal: More servers, Vertical: More power |
| Load Balancing for Multi-Region App | Global load balancing, health checks, DNS   |
| Session Persistence              | Sticky sessions, session cookies, distributed cache |