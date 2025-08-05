# Tell me about a mistake you made and how you fixed it

## ✅ Realistic Mistake Example – Missed Null Handling in Production API

### Situation
While working on a feature for the **Tata Consumer Products B2B platform**, I built an API to fetch order history data, which was used in both the admin panel and sales dashboard. The backend was built in **Node.js with PostgreSQL**, and the frontend in **React.js**.

### Task
The goal was to allow filtering of order history by customer, date, and product category. The API was returning structured data, but some optional fields (like `discountCode` or `deliveryNotes`) were sometimes `null` or missing entirely in certain legacy orders.

### Mistake (Problem)
During implementation, I didn't account for the possibility that these fields could be `null`. In development, all test data had those fields populated. But in production, legacy data lacked them.

Once released, the frontend started breaking — specifically, the React components rendering these fields crashed with **"Cannot read property 'xyz' of null"** errors. This caused parts of the order history dashboard to become unusable for some users.

### Action Taken
- I immediately rolled back the frontend build and added hotfix guards using optional chaining (`?.`) and fallback text (e.g., `"—"` if field missing).
- On the backend, I added default values (`COALESCE`) in the SQL query and normalized null fields in the response to consistent empty strings or objects.
- I updated the Postman collection and Swagger docs to clearly indicate which fields are optional and what default they hold if not present.
- Then I wrote unit tests specifically for partial/legacy data to catch this scenario earlier next time.

### Result
The issue was resolved within a few hours, and it never came up again. This taught me that **production data isn't always like dev/test data** — and since then, I've become more rigorous about **null safety**, **defensive coding**, and validating assumptions against real datasets.

## ✅ Why This Works Well
- It's **real** – happens often in fast-moving teams.
- You **own the mistake** without blaming data or QA.
- You fixed it **quickly**, with multiple layers (backend + frontend).
- You **learned from it**, and improved your process.


# What are things you see first while code review?

## ✅ Top Things to Look for in a Code Review

### 1. **Correctness**
❓ Does the code do what it's supposed to do?
- Business logic matches the requirement/spec
- Edge cases and failure paths are handled
- Input validation and error handling are present

### 2. **Readability & Clarity**
👀 Can someone else understand this code easily?
- Good naming conventions for variables/functions
- Clear control flow, no deeply nested logic
- Comments where needed (but not over-commented)
- Follows team's formatting/style guide (e.g., ESLint, Prettier)

### 3. **Code Structure & Design**
🧠 Is the code modular and scalable?
- Small, single-purpose functions
- Separation of concerns (e.g., API, business logic, UI)
- Avoids duplication (DRY principle)
- Reusable components/hooks/services

### 4. **Performance**
⚡ Is the code efficient and not wasteful?
- Avoids unnecessary loops or expensive operations
- For frontend: no excessive re-renders, no memory leaks
- For backend: optimized DB queries (joins, indexing, limits), proper caching if needed

### 5. **Security & Validation**
🔐 Are inputs/outputs validated properly?
- Prevents SQL injection, XSS, etc.
- No sensitive data hardcoded or exposed
- Uses environment variables properly
- Passwords, tokens, keys never logged

### 6. **Test Coverage**
✅ Is there sufficient and meaningful test coverage?
- Unit tests for key logic
- Integration or API tests for services
- Mocks/stubs used appropriately
- Tests pass and are not flaky

### 7. **Error Handling & Logging**
⚠️ What happens when something fails?
- Graceful error handling with meaningful messages
- Avoids crashing the entire app
- Proper logging (with context, no PII)

### 8. **Compliance with Standards**
📏 Does it follow team's conventions and best practices?
- Adheres to lint rules (ESLint, Prettier, etc.)
- Uses project's patterns (Redux, middleware, folder structure)
- Consistent use of async/await vs .then()

### 9. **Dependencies & Side Effects**
🧩 Any new packages or changes to shared code?
- Are new dependencies necessary and lightweight?
- Doesn't introduce breaking changes in shared modules
- For microservices: contract compatibility is maintained

### 10. **CI/CD & Deployment Readiness**
🚀 Will it deploy smoothly?
- No `console.log()` left in production code
- Feature toggles used for incomplete features
- DB migrations (if any) are safe and reversible
- `.env` changes documented