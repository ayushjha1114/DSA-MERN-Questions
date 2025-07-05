# Types of Deployments

Here are the most widely used deployment strategies:

---

## 1. Recreate Deployment (Big Bang)

**How it works:**  
- Stop the old version of the application  
- Deploy the new version

**Pros:**  
- Simple and fast for small apps  
- No version conflict

**Cons:**  
- Downtime during deployment  
- High risk if deployment fails

**Use when:**  
- Early-stage projects or internal tools  
- High availability is not required

---

## 2. Rolling Deployment

**How it works:**  
- Gradually replace old app instances with new ones  
- Update a few servers at a time (e.g., 10%, 20%, etc.)

**Pros:**  
- No downtime  
- Controlled, progressive rollout

**Cons:**  
- Harder to roll back quickly  
- Users may see a mix of old and new versions

**Use when:**  
- Zero-downtime deployment with minimal risk is desired

---

## 3. Blue-Green Deployment

**How it works:**  
- Two identical environments: Blue (live) and Green (staging)  
- Deploy new version to Green, test it  
- Switch traffic from Blue to Green

**Pros:**  
- Instant rollback (just route back to Blue)  
- No downtime

**Cons:**  
- Requires double infrastructure  
- More complex setup

**Use when:**  
- Safe rollbacks and high availability are needed

---

## 4. Canary Deployment

**How it works:**  
- Release new version to a small subset of users  
- Gradually increase traffic if it works well

**Pros:**  
- Monitor in production with real users  
- Safer rollouts

**Cons:**  
- Requires metrics and alerting  
- Logic needed to manage who gets new version

**Use when:**  
- Real-world testing with minimal risk is needed

---

## 5. Shadow Deployment

**How it works:**  
- Send a copy of live traffic to the new version, but don’t affect actual users

**Pros:**  
- Observe new version in real-time  
- No impact on users

**Cons:**  
- Requires infrastructure to duplicate traffic  
- Doesn’t test user interface

**Use when:**  
- Testing critical or experimental backend components

---

## 6. A/B Testing Deployment

**How it works:**  
- Different users get different app versions for comparison  
- Often used for UI changes, feature flags

**Pros:**  
- Measure effectiveness of changes  
- Targeted testing

**Cons:**  
- Adds complexity  
- Requires analytics setup

**Use when:**  
- Data-driven feature rollout decisions are needed

---

## 7. Red-Black Deployment

- Similar to Blue-Green but involves additional safety checks like draining traffic and warm-up.

---

## ⚙️ Other Related Concepts

| Term                    | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| Zero Downtime Deployment| Ensures the app is always up during deployment (rolling, blue-green, canary)|
| Immutable Deployment    | Spin up new instances and kill old ones instead of modifying existing servers|
| Feature Flags           | Toggle features on/off at runtime without deploying                         |
| CI/CD Pipelines         | Automate code build → test → deploy using tools like GitHub Actions, Jenkins|

---

## 🏗️ Typical Tools & Platforms

| Environment         | Tools/Platforms                                              |
|---------------------|-------------------------------------------------------------|
| Kubernetes          | Rolling, Canary, Blue-Green via Helm/ArgoCD                 |
| AWS                 | Elastic Beanstalk, ECS blue/green, Lambda versions/aliases  |
| Vercel/Netlify      | Atomic deploys (similar to blue-green)                      |
| GitHub Actions/Docker| DIY pipelines for any strategy                             |
| Spinnaker, Argo Rollouts | Advanced deployment management                         |



# Production-Grade Node.js Microservices Architecture

A detailed blueprint for implementing a Node.js microservices architecture using multi-repo, GitHub Actions, Docker, and AWS ECS.

---

## 🔧 Architecture Overview

### 📁 Multi-Repo Structure Example

Each service lives in its own repository:

```
repo-user-service
repo-order-service
repo-inventory-service
repo-api-gateway
repo-shared-libs         # (optional, for common utilities)
repo-infra-monitoring    # (Prometheus + Grafana)
```

Each repo contains:

```
.
├── Dockerfile
├── .github/workflows/
│   ├── dev-deploy.yml
│   └── prod-deploy.yml
├── ecs-task-def.json
└── src/
```

---

## 🚀 Pipeline Strategy

### 🧭 GitHub Actions for Each Repo

| Workflow File     | Trigger          | Description                                 |
|-------------------|------------------|---------------------------------------------|
| `dev-deploy.yml`  | Push to `develop`| Build image → Push to ECR → Deploy to ECS Dev|
| `prod-deploy.yml` | Push to `main`   | Build image → Push to ECR → Deploy to ECS Prod|

---

## 🐳 Docker + ECS Setup

### 🔹 Dockerfile (in each microservice repo)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
```

### 🔹 GitHub Actions Example: `dev-deploy.yml`

```yaml
name: Dev Deploy

on:
    push:
        branches: [develop]

env:
    AWS_REGION: ap-south-1
    ECR_REPO: your-ecr-repo-name
    ECS_CLUSTER: dev-cluster
    ECS_SERVICE: dev-your-service
    CONTAINER_NAME: your-container-name

jobs:
    deploy:
        runs-on: ubuntu-latest

        steps:
        - name: Checkout
            uses: actions/checkout@v3

        - name: Configure AWS Credentials
            uses: aws-actions/configure-aws-credentials@v2
            with:
                aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
                aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
                aws-region: ${{ env.AWS_REGION }}

        - name: Login to Amazon ECR
            id: login-ecr
            uses: aws-actions/amazon-ecr-login@v1

        - name: Build and Push Docker Image
            run: |
                IMAGE_URI=${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPO }}:dev-${{ github.sha }}
                docker build -t $IMAGE_URI .
                docker push $IMAGE_URI
                echo "IMAGE_URI=$IMAGE_URI" >> $GITHUB_ENV

        - name: Deploy to ECS
            uses: aws-actions/amazon-ecs-deploy-task-definition@v1
            with:
                task-definition: ecs-task-def.json
                service: ${{ env.ECS_SERVICE }}
                cluster: ${{ env.ECS_CLUSTER }}
                image: ${{ env.CONTAINER_NAME }}=${{ env.IMAGE_URI }}
```

> Copy and adjust for `prod-deploy.yml` (change to `main` branch, prod service/cluster).

---

## 📊 Monitoring Setup

### 🔸 Repo: `infra-monitoring`

Contains:

```
infra-monitoring/
├── docker-compose.yml
├── prometheus/
│   └── prometheus.yml
├── grafana/
│   └── dashboards/
```

### 🔸 Prometheus Setup

`prometheus/prometheus.yml`:

```yaml
global:
    scrape_interval: 15s

scrape_configs:
    - job_name: 'user-service'
        metrics_path: /metrics
        static_configs:
            - targets: ['user-service-url:3000']

    - job_name: 'order-service'
        metrics_path: /metrics
        static_configs:
            - targets: ['order-service-url:3000']
```

### 🔸 Node.js Service (metrics endpoint)

Use [`prom-client`](https://github.com/siimon/prom-client):

```js
import client from 'prom-client';
client.collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});
```

---

## 🧭 Optional Enhancements

| Tool                | Use Case                                 |
|---------------------|------------------------------------------|
| Slack Webhooks      | Notify on CI/CD success/fail             |
| Sentry              | Error reporting (runtime)                |
| Grafana Alerts      | Notify on high error rate / CPU          |
| Terraform/CloudFormation | Infrastructure as code              |

---

## ✅ Summary

- Each microservice repo has independent build + ECS deploy pipelines for dev and prod.
- Docker + GitHub Actions + AWS ECS are used for scalable, production-grade deployment.
- Prometheus + Grafana monitor per-service health and metrics.
- Central monitoring repo simplifies ops and can deploy infra to ECS/Fargate/EC2.



# Implementation of repo-api-gateway, repo-shared-libs, repo-infra-monitoring
---

In a production-grade Node.js microservices setup, certain repositories serve as shared infrastructure, gateways, and libraries, supporting individual microservices like `user-service`, `order-service`, etc.

---

### 1. **repo-api-gateway – Central Entry Point**

**Purpose:**  
Acts as the gateway to route external requests to the correct microservice, handling:

- Reverse proxy (e.g., NGINX or Express)
- Authentication/authorization
- Rate limiting / CORS
- Logging

**Example Routing:**

| Endpoint           | Routes to         |
|--------------------|------------------|
| `/api/v1/users`    | `user-service`   |
| `/api/v1/orders`   | `order-service`  |

**Express Implementation Example:**

```js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use('/api/v1/users', createProxyMiddleware({
    target: 'http://user-service:3000',
    changeOrigin: true,
}));

app.use('/api/v1/orders', createProxyMiddleware({
    target: 'http://order-service:3000',
    changeOrigin: true,
}));

app.listen(8080, () => console.log('API Gateway running on 8080'));
```

> **Deployment:**  
> Deploy like any other service (e.g., to ECS). Only the gateway is exposed publicly; other services remain internal.

---

### 2. **repo-shared-libs – Shared Utility Code**

**Purpose:**  
Houses reusable modules to avoid code duplication across microservices.

**Example Structure:**

```
repo-shared-libs/
├── auth/
│   └── verifyJwt.ts
├── logger/
│   └── index.ts
├── middlewares/
│   └── errorHandler.ts
├── config/
│   └── constants.ts
├── package.json
```

**Usage in Microservices:**

In `repo-user-service/package.json`:

```json
"dependencies": {
    "@org/shared-libs": "git+https://github.com/your-org/repo-shared-libs.git#v1.0.3"
}
```

In code:

```ts
import { verifyJwt } from '@org/shared-libs/auth';
import { logger } from '@org/shared-libs/logger';
```

> **Versioning:**  
> Use Git tags or a private npm registry (e.g., GitHub Packages) for version control.

---

### 3. **repo-infra-monitoring – Monitoring Stack**

**Purpose:**  
Centralized configuration and Dockerized infrastructure for:

- Prometheus (metrics scraping)
- Grafana (visualization)
- Alertmanager (optional)
- Dashboards

**Prometheus Config Example:**

```yaml
scrape_configs:
    - job_name: 'user-service'
        static_configs:
            - targets: ['user-service:3000']
```

**docker-compose.yml Example:**

```yaml
services:
    prometheus:
        image: prom/prometheus
        volumes:
            - ./prometheus.yml:/etc/prometheus/prometheus.yml
        ports:
            - "9090:9090"

    grafana:
        image: grafana/grafana
        ports:
            - "3001:3000"
```

> All services should expose a `/metrics` endpoint using `prom-client`.

---

### ✅ What to Store in `repo-shared-libs`

| Folder      | Purpose                                         |
|-------------|-------------------------------------------------|
| `auth/`     | JWT decode, session validation, RBAC helpers    |
| `logger/`   | Winston or pino logger, ECS format              |
| `middlewares/` | Error handler, 404, rate-limiting middleware |
| `config/`   | Common env config, constants                    |
| `types/`    | TypeScript types/interfaces for shared models   |
| `utils/`    | Date helpers, string formatting, etc.           |
| `kafka/` (optional) | Kafka producers/consumers boilerplate   |

> Each microservice imports only what it needs.

---

### 🧠 Best Practices

- Tag releases in the shared-libs repo (e.g., `v1.0.0`, `v1.1.0`) to avoid accidental breakage.
- Use GitHub Packages or Verdaccio (private npm registry) for better version control than git-based imports.
- Keep the shared-libs repo small and focused. Start with just `auth` and `logger` if needed—avoid over-engineering.






# Why You Don’t Need `http-proxy-middleware` with AWS API Gateway

If you're using **AWS API Gateway**, you do **not** need to use `http-proxy-middleware` or write a custom Express.js-based gateway in your `repo-api-gateway`.

`http-proxy-middleware` is typically used when building your own API Gateway with Express.js (e.g., in a Node.js monolith or a self-managed gateway container). However, **AWS API Gateway** is a fully managed reverse proxy that handles:

- **Routing**
- **Authentication** (via AWS Cognito / JWTs)
- **Rate limiting**
- **CORS**
- **Integration** with Lambda, ECS, or HTTP services

So, in your case, the `repo-api-gateway` will not contain any Node.js code. Instead, it should focus on infrastructure configuration.

---

## What Should Be in `repo-api-gateway` (When Using AWS API Gateway)

Instead of application code, this repository should contain:

### 1. Infrastructure as Code (IaC)

For example:

- `gateway.tf` for **Terraform**
- `gateway.yaml` for **CloudFormation**
- `api.yml` for **AWS SAM**
- `apigateway.json` for **OpenAPI/Swagger spec**

---

### Example: OpenAPI Spec (`api-spec.yaml`)

```yaml
openapi: 3.0.1
info:
    title: Microservices Gateway
    version: 1.0.0
paths:
    /users:
        get:
            x-amazon-apigateway-integration:
                uri: http://user-service.yourdomain.com
                httpMethod: GET
                type: http_proxy

    /orders:
        post:
            x-amazon-apigateway-integration:
                uri: http://order-service.yourdomain.com
                httpMethod: POST
                type: http_proxy
```

You can deploy this using the **AWS Console**, **AWS CLI**, or your chosen **IaC** tool.









# Using Prometheus and Grafana

Let's understand the use of Prometheus and Grafana with a practical example.

## Scenario: Node.js E-commerce Website

Without monitoring, you're flying blind:

- Your website suddenly becomes slow — you don't know why.
- Users complain they can't checkout — you don't know when it started.
- Your server crashes at 3 AM — you only find out when customers email you.
- You don't know how many people are using your site right now.

---

## What Prometheus Does (Data Collector)

Think of Prometheus as a security guard who checks your building every minute, writing down what he sees:

- "10 people entered the store this minute"
- "Checkout process took 2 seconds"
- "Server memory is 70% full"
- "3 errors happened in the payment system"

Prometheus automatically collects this information from your Node.js app and stores it.

---

## What Grafana Does (Dashboard)

Grafana takes all that data and creates visual charts, such as:

- A line graph showing "Number of visitors per hour"
- A gauge showing "Server memory usage"
- An alert that turns red when "Error rate goes above 5%"

---

## Real-World Example

Your e-commerce site starts getting slow. Instead of guessing:

- **Grafana dashboard shows:** Response time jumped from 200ms to 5 seconds at 2:15 PM.
- **You can see:** Memory usage spiked to 95% at the same time.
- **You discover:** A specific API endpoint is causing the problem.
- **You get alerted:** Before customers start complaining.

---

## In Simple Terms

- **Prometheus:** Your app's health monitor (collects data)
- **Grafana:** Your dashboard (shows charts and alerts)
- **Together:** See what's happening in real-time and fix problems before they become disasters

It's like having a doctor constantly checking your app's vital signs and showing you the results on a screen.


# AWS CloudWatch

AWS CloudWatch is AWS's built-in monitoring and observability service. Here's how it relates to Prometheus and Grafana:

## What CloudWatch Does

CloudWatch is like a built-in health monitor for all your AWS services. It automatically collects data about your AWS resources without setup.

### Automatic Monitoring (No Setup Required)

- **EC2 instances:** CPU usage, memory, disk I/O, network traffic
- **Lambda functions:** Execution duration, error rates, invocation counts
- **ECS containers:** CPU and memory utilization
- **Load balancers:** Request counts, response times, error rates
- **Databases (RDS):** Connection counts, query performance

---

## CloudWatch vs Prometheus + Grafana

### CloudWatch Advantages

- **Zero setup:** Works automatically with AWS services
- **Integrated:** Native AWS service, no extra infrastructure needed
- **Cost-effective:** Pay only for what you use
- **AWS-optimized:** Deep integration with all AWS services

### Prometheus + Grafana Advantages

- **More detailed:** Can track custom application metrics
- **Vendor-neutral:** Works with any cloud provider or on-premises
- **More flexible:** Highly customizable dashboards and alerting
- **Open source:** Free and community-driven

---

## Real Example for Your Node.js App

**CloudWatch automatically shows you:**

- Your ECS container is using 80% CPU
- Your Lambda function failed 5 times in the last hour
- Your load balancer received 1000 requests per minute

**Prometheus would additionally show you:**

- How many users are currently logged in to your app
- Which specific API endpoint is slow
- Custom business metrics like "checkout success rate"

---

## When to Use What

**Use CloudWatch when:**

- You want basic monitoring with minimal setup
- You're primarily using AWS services
- You need infrastructure-level monitoring
- You want cost-effective monitoring

**Use Prometheus + Grafana when:**

- You need detailed application-level monitoring
- You want custom business metrics
- You're using multiple cloud providers
- You need highly customizable dashboards

---

**Best Practice:**  
Many companies use both together — CloudWatch for AWS infrastructure monitoring and Prometheus + Grafana for detailed application monitoring.




# Production-Grade React.js Microfrontend App with Webpack Module Federation, AWS S3 + CloudFront, GitHub Actions, and Sentry

---

## ✅ Folder Structure (Scalable Microfrontend Pattern)

Organize each microfrontend as a separate app (e.g., `shell`, `dashboard`, `auth`, etc.):

```
/microfrontend-root/
│
├── apps/
│   ├── shell/             # Host App
│   │   ├── public/
│   │   ├── src/
│   │   ├── webpack.config.js
│   │   └── package.json
│   │
│   ├── dashboard/         # Remote App (exposed to shell)
│   ├── auth/              # Remote App (exposed to shell)
│   └── shared/            # Shared libraries (e.g., design system)
│
├── .github/
│   └── workflows/
│       ├── deploy-dev.yml
│       └── deploy-prod.yml
│
├── package.json
├── README.md
└── .nvmrc
```

Each app contains its own:

- Webpack config (with module federation)
- Sentry init
- CI/CD steps

---

## 🛠️ Webpack Module Federation (Basic Setup)

**In `shell/webpack.config.js`:**

```js
new ModuleFederationPlugin({
    name: 'shell',
    remotes: {
        dashboard: 'dashboard@https://<cloudfront-url>/dashboard/remoteEntry.js',
        auth: 'auth@https://<cloudfront-url>/auth/remoteEntry.js',
    },
    shared: ['react', 'react-dom'],
})
```

**In `dashboard/webpack.config.js`:**

```js
new ModuleFederationPlugin({
    name: 'dashboard',
    filename: 'remoteEntry.js',
    exposes: {
        './DashboardApp': './src/bootstrap',
    },
    shared: ['react', 'react-dom'],
})
```

> Use dynamic loading via `React.lazy()` + `Suspense`.

---

## 🚀 GitHub Actions Pipelines (Dev + Prod)

### `deploy-dev.yml`

```yaml
name: Deploy Dev

on:
    push:
        branches: [dev]

jobs:
    deploy:
        runs-on: ubuntu-latest
        strategy:
            matrix:
                app: [shell, dashboard, auth]
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
                with:
                    node-version: 18
            - run: cd apps/${{ matrix.app }} && npm ci && npm run build
            - name: Upload to S3 (Dev)
                uses: jakejarvis/s3-sync-action@master
                with:
                    args: --acl public-read --delete
                env:
                    AWS_S3_BUCKET: your-dev-bucket-name
                    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
                    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
                    AWS_REGION: your-region
                    SOURCE_DIR: "apps/${{ matrix.app }}/build"
```

### `deploy-prod.yml` (Trigger only on tag or main branch)

```yaml
name: Deploy Prod

on:
    push:
        branches: [main]

jobs:
    deploy:
        runs-on: ubuntu-latest
        strategy:
            matrix:
                app: [shell, dashboard, auth]
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
                with:
                    node-version: 18
            - run: cd apps/${{ matrix.app }} && npm ci && npm run build
            - name: Upload to S3 (Prod)
                uses: jakejarvis/s3-sync-action@master
                with:
                    args: --acl public-read --delete
                env:
                    AWS_S3_BUCKET: your-prod-bucket-name
                    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
                    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
                    AWS_REGION: your-region
                    SOURCE_DIR: "apps/${{ matrix.app }}/build"
```

> **CloudFront** should be configured to point to your S3 bucket, with separate distributions for dev and prod if needed.

---

## 📊 Monitoring with Sentry

**Install Sentry SDK:**

```bash
npm install @sentry/react @sentry/tracing
```

**Add to each app (e.g., in `src/sentry.ts`):**

```ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
    dsn: 'https://<your-dsn>.ingest.sentry.io/project_id',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
});
```

**Inject Source Maps in GitHub Actions:**

```yaml
- name: Upload Source Maps to Sentry
    run: |
        export SENTRY_AUTH_TOKEN=${{ secrets.SENTRY_AUTH_TOKEN }}
        npx sentry-cli releases new $GITHUB_SHA
        npx sentry-cli releases files $GITHUB_SHA upload-sourcemaps ./build --rewrite
        npx sentry-cli releases finalize $GITHUB_SHA
```

---

## 🧠 Extras for Production-Grade Setup

| Concern         | Tool / Best Practice                        |
|-----------------|--------------------------------------------|
| Lint & Format   | ESLint + Prettier + Husky + Lint-Staged    |
| Testing         | Jest + React Testing Library                |
| Code Splitting  | Webpack dynamic imports                     |
| Bundle Analyzer | webpack-bundle-analyzer                     |
| S3 Cache Inval  | Add CloudFront invalidation step in Actions |
| Envs            | .env.production, .env.development           |
| Versioning      | Use Git tag or commit SHA                   |




# Using a `shared/` Folder in Microfrontend Architectures

The `shared/` folder in a microfrontend architecture is used to house common code or shared components that are reused across multiple remote apps and the shell.

---

## ✅ Common Use Cases for `shared/` Folder

| Type         | Examples                                                      |
|--------------|---------------------------------------------------------------|
| **UI Components** | `Button`, `Modal`, `FormInput`, `Spinner`, `Toast`           |
| **Utilities**     | Date formatter, currency converter, debounce, throttle       |
| **Hooks**         | `useAuth`, `useDebounce`, `useFetch`                         |
| **Constants**     | App-wide enums, error codes, config values                   |
| **Theme / Styles**| Tailwind config, theme tokens, styled-components theme       |
| **Types**         | TypeScript interfaces shared across apps                     |
| **API clients**   | Axios instance with interceptors, GraphQL client setup       |
| **Localization**  | i18n config or language JSON files                           |

---

## 📦 Example `shared/` Folder Structure

```
/shared/
│
├── components/
│   ├── Button.tsx
│   └── Modal.tsx
│
├── hooks/
│   ├── useAuth.ts
│   └── useDebounce.ts
│
├── utils/
│   ├── formatDate.ts
│   └── currency.ts
│
├── constants/
│   └── roles.ts
│
├── types/
│   └── user.ts
│
├── api/
│   └── axiosInstance.ts
│
└── package.json
```

---

## 🔧 How to Use Shared Code Across Microfrontends

### 1. ✅ Treat `shared/` as a Local Package

Each remote app imports from it via relative path or workspace alias.

**Option A: Use a Monorepo with Yarn Workspaces / npm Workspaces**

At root `package.json`:

```json
{
    "private": true,
    "workspaces": ["apps/*", "shared"]
}
```

Then in each app (e.g., `apps/dashboard/package.json`):

```json
{
    "dependencies": {
        "shared": "*"
    }
}
```

Now you can import shared code:

```tsx
import { Button } from 'shared/components/Button';
```

---

### 2. ✅ Build `shared/` as a Remote via Module Federation (Advanced)

If the shared library is updated frequently or is large, consider exposing it as a remote.

In `shared/webpack.config.js`:

```js
new ModuleFederationPlugin({
    name: 'shared',
    filename: 'remoteEntry.js',
    exposes: {
        './Button': './components/Button',
        './useAuth': './hooks/useAuth',
    },
    shared: ['react', 'react-dom'],
});
```

Build and deploy `shared/` to its own S3 bucket. Then in consuming apps:

In `dashboard/webpack.config.js`:

```js
new ModuleFederationPlugin({
    name: 'dashboard',
    remotes: {
        shared: 'shared@https://cdn.yourdomain.com/shared/remoteEntry.js',
    },
});
```

Usage:

```tsx
const Button = React.lazy(() => import('shared/Button'));
```

> ⚠️ This adds runtime coupling. Prefer monorepo + local workspace import unless you need runtime version independence.

---

## 🎯 When to Use Each Option

| Use Case                              | Prefer                                    |
|----------------------------------------|-------------------------------------------|
| Small reusable code/components         | Local `shared/` folder + workspace alias  |
| Runtime upgradability / dynamic load   | Expose `shared/` as a remote              |
| Large teams, separate deployments      | Remote shared module via Webpack MF       |
| Single team monorepo                   | Local package (simple, faster builds)     |





# Dockerfile vs. docker-compose.yml in Production

In production, **use a `Dockerfile` — not `docker-compose.yml`.**

---

### ✅ When to Use Dockerfile in Production

A `Dockerfile` is the standard way to build a production-grade Node.js app container image. It is:

- **Stateless, portable, and reusable** in any CI/CD pipeline (e.g., GitHub Actions, GitLab CI, AWS CodeBuild)
- **Ideal for pushing** to AWS ECR, Docker Hub, or other registries
- **Used in orchestration environments** like ECS, EKS, Kubernetes, Nomad

**Best practice:**  
Build your app with a `Dockerfile`, then run it with ECS, Kubernetes, or `docker run`.

---

### ❌ Why Not docker-compose.yml in Production?

`docker-compose.yml` is typically used for:

- Local development
- Spinning up multi-container apps (e.g., Node.js + MongoDB + Redis)
- CI/test environments

While it *can* be used in production, it’s **not recommended** for:

- Scaling
- Security (doesn't integrate well with IAM/Secrets Managers)
- Advanced deployment workflows (blue/green, canary)

> ⚠️ Not suitable for production deployment in AWS ECS, EKS, or Kubernetes.

---

### 🏗️ Example Production Workflow with Dockerfile

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

**CI/CD Workflow:**

- Build and push image to AWS ECR
- Deploy on ECS or EKS using Terraform or CDK

---

### 🛠 When to Use docker-compose in Production

Use `docker-compose` in production **only when**:

- Deploying to a single VPS (e.g., EC2, DigitalOcean)
- You want to keep infrastructure simple (e.g., Node.js + Postgres on a single machine)
- You don’t use AWS ECS/K8s, and scaling isn’t a concern