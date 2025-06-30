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

