# 🧠 What is an Index in MongoDB?

An index in MongoDB is a special data structure that stores a small portion of the dataset in an easy-to-traverse form. It's similar to indexes in books — it lets MongoDB skip scanning all documents to find matches.

---

## ⚙️ Under the Hood: How Indexing Works

### 1. B-tree Based Structure
MongoDB uses a B-tree (specifically a B+ tree) for most of its indexes, including the default `_id` index.

- **B+ trees** are balanced trees optimized for read/write performance.
- Every index entry is a sorted key-value pair:
    - **Key**: Value of the indexed field.
    - **Value**: Pointer to the actual document’s location in the collection.

This allows MongoDB to efficiently traverse the tree to find matching documents or ranges.

---

### 2. Index Entry Structure
Example collection:
```json
{ "name": "Alice", "age": 28 }
{ "name": "Bob", "age": 32 }
{ "name": "Charlie", "age": 25 }
```

Creating an index on `age`:
```javascript
db.users.createIndex({ age: 1 })
```

Internally, MongoDB builds a B-tree like this:
```
25 -> Pointer to doc #3
28 -> Pointer to doc #1
32 -> Pointer to doc #2
```

This structure is stored in the `system.indexes` metadata and used for queries like:
```javascript
db.users.find({ age: { $gt: 26 } })
```
MongoDB walks the tree from `28` upward instead of scanning the whole collection.

---

### 3. Multikey Indexes
If the indexed field is an array, MongoDB creates multikey indexes, where each element in the array is indexed separately.

Example:
```json
{ "tags": ["tech", "mongodb", "indexing"] }
```
This results in three index entries — one for each tag.

---

### 4. Compound Indexes
Compound indexes include multiple fields in a specific order:
```javascript
db.users.createIndex({ age: 1, name: 1 })
```

The B-tree stores composite keys like:
```
(25, "Charlie") -> doc
(28, "Alice")   -> doc
(32, "Bob")     -> doc
```
> **Note**: Ordering matters! Queries must align with the prefix fields to use the index efficiently.

---

### 5. Hashed Indexes
Used for sharding. Instead of storing actual field values in a sorted tree, MongoDB hashes the field value and indexes the hash.
```javascript
db.users.createIndex({ userId: "hashed" })
```

---

### 6. TTL Indexes
Indexes with a time-to-live automatically remove expired documents based on a timestamp field.
```javascript
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })
```
A background process deletes expired documents periodically.

---

### 7. Covered Queries
If all the fields requested in a query are in the index, MongoDB can serve the query without reading the documents from disk. This is called a **covered query**, and it’s a big win for performance.

---

## 🛠️ When Are Indexes Used?
- On queries with filters (`find`, `aggregate $match`).
- On sorting operations (`sort`).
- On joining (`$lookup` with `localField`/`foreignField`).
- On unique constraints (`createIndex(..., { unique: true })`).

---

## 🧾 Storage
- Indexes are stored in the same storage engine as collections (usually **WiredTiger**).
- They consume additional disk space and RAM (as indexes must be kept in memory for fast access).


## ⚙️ Best Practices for Indexing

- **Analyze Query Patterns:**  
    Use the `explain()` method to see how queries use indexes and identify potential improvements.

    ```javascript
    db.users.find({ age: 30 }).explain("executionStats");
    ```

- **Follow the ESR Rule:**  
    When creating compound indexes, order fields as **Equality → Sort → Range** for optimal performance.

    **Example:**

    ```javascript
    db.products.createIndex({ category: 1, price: 1 });
    ```
    This index supports queries that filter by `category` and sort by `price`.

- **Use Covered Queries:**  
    Design indexes to include all fields returned by a query, so MongoDB can serve results directly from the index without reading documents.

    **Example:**

    ```javascript
    db.users.createIndex({ name: 1, email: 1 });
    db.users.find({ name: "Alice" }, { email: 1, _id: 0 });
    ```
    This query is covered by the index.


## 📘 MongoDB Data Modeling & Schema Design

Effective data modeling in MongoDB is crucial for performance, scalability, and maintainability. Here’s an in-depth look:

---

### 1. Embedding vs. Referencing

**Embedding:** Store related data within a single document.

- **Use Case:** When related data is frequently accessed together.

**Example:**

```json
{
    "_id": 1,
    "name": "Alice",
    "addresses": [
        {
            "street": "123 Main Street",
            "city": "Springfield"
        },
        {
            "street": "456 Maple Avenue",
            "city": "Shelbyville"
        }
    ]
}
```

**Referencing:** Store related data in separate documents and link them using ObjectIDs.

- **Use Case:** When related data is large or accessed independently.

**Example:**

```json
// User document
{
    "_id": 1,
    "name": "Bob"
}

// Order document
{
    "_id": 101,
    "user_id": 1,
    "product": "Laptop"
}
```

---

### 2. Schema Design Patterns

#### **Bucket Pattern:**  
Group related data (such as time-series data) into a single document to optimize read performance.

---

#### 🛒 Bucket Pattern in E-commerce: Managing User Order Histories

In an e-commerce application, users often have extensive order histories. Storing each order as a separate document can lead to a massive number of documents, impacting performance. The Bucket Pattern groups multiple orders into a single document, reducing document count and optimizing reads.

**Example: Grouping Orders by User and Month**

```json
{
    "_id": "user123_2025_05",
    "userId": "user123",
    "month": "2025-05",
    "orders": [
        {
            "orderId": "order001",
            "date": { "$date": "2025-05-05T10:15:00Z" },
            "items": [
                { "productId": "prodA", "quantity": 2, "price": 29.99 },
                { "productId": "prodB", "quantity": 1, "price": 49.99 }
            ],
            "total": 109.97
        },
        {
            "orderId": "order002",
            "date": { "$date": "2025-05-20T14:30:00Z" },
            "items": [
                { "productId": "prodC", "quantity": 3, "price": 19.99 }
            ],
            "total": 59.97
        }
        // Additional orders for May 2025
    ]
}
```

**Structure:**

- `_id`: Combines user ID and month for uniqueness.
- `userId`: Identifies the user.
- `month`: Indicates the month for grouped orders.
- `orders`: Array of individual order details for the month.

**Benefits:**

- **Reduced Document Count:** Fewer documents, more efficient storage.
- **Optimized Read Performance:** Fetching a user’s orders for a month requires only one document read.
- **Simplified Archiving:** Easy to archive or delete old orders by targeting the `month` field.

---

### 3. Best Practices

- **Data Access Patterns:** Design schemas based on how the application queries data.
- **Avoid Over-Normalization:** Excessive normalization can lead to complex queries.
- **Use Appropriate Data Types:** Ensure fields use correct data types for optimal storage and performance.

## MongoDB Transactions Overview

In MongoDB, transactions are **explicit operations**—they are not applied to every document by default. You must define them using session objects.

### 🔹 Key Points

- **Transactions must be started explicitly:**  
    Use `startSession()` and `session.startTransaction()` to begin a transaction.

- **Transactions group multiple operations:**  
    A transaction can include multiple read/write operations across:
    - Multiple documents
    - Multiple collections
    - Even multiple databases (since MongoDB 4.2)

- **Without explicit transactions:**  
    Each individual document operation is atomic, but groups of operations are not.

---

### 🔸 Example: Multi-document Transaction

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
    await User.updateOne({ _id: userId }, { $inc: { balance: -100 } }, { session });
    await Wallet.updateOne({ userId }, { $inc: { balance: 100 } }, { session });

    await session.commitTransaction();
} catch (error) {
    await session.abortTransaction();
} finally {
    session.endSession();
}
```


## MongoDB Transactions Overview

In MongoDB, transactions are **explicit operations**—they are not applied to every document by default. You must define them using session objects.

### 🔹 Key Points

- **Transactions must be started explicitly:**  
    Use `startSession()` and `session.startTransaction()` to begin a transaction.

- **Transactions group multiple operations:**  
    A transaction can include multiple read/write operations across:
    - Multiple documents
    - Multiple collections
    - Even multiple databases (since MongoDB 4.2)

- **Without explicit transactions:**  
    Each individual document operation is atomic, but not the whole group.

---

### 🔸 Example: Multi-document Transaction

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
    await User.updateOne({ _id: userId }, { $inc: { balance: -100 } }, { session });
    await Wallet.updateOne({ userId }, { $inc: { balance: 100 } }, { session });

    await session.commitTransaction();
} catch (error) {
    await session.abortTransaction();
} finally {
    session.endSession();
}
```




# MongoDB Aggregation & Query Cheat Sheet

## Sample Collections (Simplified)

### `orders`
```json
[
    { "_id": 1, "orderId": "O100", "productId": "P1", "customerId": "C1", "quantity": 2, "price": 50, "amount": 100, "status": "completed", "orderDate": ISODate("2025-01-01") },
    { "_id": 2, "orderId": "O101", "productId": "P2", "customerId": "C2", "quantity": 1, "price": 100, "amount": 100, "status": "pending", "orderDate": ISODate("2025-01-02") },
    { "_id": 3, "orderId": "O102", "productId": "P1", "customerId": "C1", "quantity": 3, "price": 50, "amount": 150, "status": "completed", "orderDate": ISODate("2025-01-03") }
]
```

### `products`
```json
[
    { "_id": "P1", "productName": "T-Shirt", "price": 50, "totalSales": 250 },
    { "_id": "P2", "productName": "Jeans", "price": 100, "totalSales": 100 }
]
```

### `customers`
```json
[
    { "_id": "C1", "name": "Alice", "email": "alice@example.com" },
    { "_id": "C2", "name": "Bob", "email": "bob@example.com" }
]
```

---

## Aggregation Pipeline Stages

### 1. `$match`
**Definition:** Filters documents based on a condition (like SQL `WHERE`).  
**Example:** Get all completed orders.
```js
db.orders.aggregate([
    { $match: { status: "completed" } }
]);
```
**Output:**
```json
[
    { "_id": 1, "orderId": "O100", "status": "completed", ... },
    { "_id": 3, "orderId": "O102", "status": "completed", ... }
]
```

---

### 2. `$group`
**Definition:** Groups documents by a field and computes aggregate values like sums or counts.  
**Example:** Total sales and quantity per product.
```js
db.orders.aggregate([
    {
        $group: {
            _id: "$productId",
            totalSales: { $sum: "$amount" },
            totalQuantity: { $sum: "$quantity" }
        }
    }
]);
```
**Output:**
```json
[
    { "_id": "P1", "totalSales": 250, "totalQuantity": 5 },
    { "_id": "P2", "totalSales": 100, "totalQuantity": 1 }
]
```

---

### 3. `$project`
**Definition:** Selects, adds, or modifies fields in documents (reshapes documents).  
**Example:** Show order ID, product ID, and calculated total price.
```js
db.orders.aggregate([
    {
        $project: {
            orderId: 1,
            productId: 1,
            totalPrice: { $multiply: ["$price", "$quantity"] }
        }
    }
]);
```
**Output:**
```json
[
    { "orderId": "O100", "productId": "P1", "totalPrice": 100 },
    { "orderId": "O101", "productId": "P2", "totalPrice": 100 },
    { "orderId": "O102", "productId": "P1", "totalPrice": 150 }
]
```

---

### 4. `$sort`
**Definition:** Sorts documents by one or more fields in ascending or descending order.  
**Example:** Sort products by total sales, descending.
```js
db.products.aggregate([
    { $sort: { totalSales: -1 } }
]);
```
**Output:**
```json
[
    { "_id": "P1", "productName": "T-Shirt", "totalSales": 250 },
    { "_id": "P2", "productName": "Jeans", "totalSales": 100 }
]
```

---

### 5. `$limit`
**Definition:** Limits the number of documents returned.  
**Example:** Get the top 1 best-selling product.
```js
db.products.aggregate([
    { $sort: { totalSales: -1 } },
    { $limit: 1 }
]);
```
**Output:**
```json
[
    { "_id": "P1", "productName": "T-Shirt", "totalSales": 250 }
]
```

---

### 6. `$skip`
**Definition:** Skips a specified number of documents (useful for pagination).  
**Example:** Skip the first order and get the next two.
```js
db.orders.aggregate([
    { $sort: { orderDate: 1 } },
    { $skip: 1 },
    { $limit: 2 }
]);
```
**Output:**
```json
[
    { "_id": 2, "orderId": "O101", "orderDate": "2025-01-02", ... },
    { "_id": 3, "orderId": "O102", "orderDate": "2025-01-03", ... }
]
```

---

### 7. `$lookup`
**Definition:** Performs a left outer join to another collection.  
**Example:** Join orders with customer details.
```js
db.orders.aggregate([
    {
        $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customerInfo"
        }
    }
]);
```
**Output:**
```json
[
    {
        "_id": 1,
        "orderId": "O100",
        "customerId": "C1",
        "customerInfo": [
            { "_id": "C1", "name": "Alice", "email": "alice@example.com" }
        ]
    },
    ...
]
```

---

### 8. `$unwind`
**Definition:** Deconstructs an array field to output a document for each element.  
**Example:** Flatten the `customerInfo` array from `$lookup`.
```js
db.orders.aggregate([
    {
        $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customerInfo" }
    },
    { $unwind: "$customerInfo" }
]);
```
**Output:**
```json
[
    {
        "_id": 1,
        "orderId": "O100",
        "customerInfo": { "_id": "C1", "name": "Alice", "email": "alice@example.com" }
    },
    ...
]
```

---

### 9. `$addFields`
**Definition:** Adds new fields or modifies existing fields.  
**Example:** Add a discounted price field (10% off).
```js
db.products.aggregate([
    {
        $addFields: {
            discountedPrice: { $multiply: ["$price", 0.9] }
        }
    }
]);
```
**Output:**
```json
[
    { "_id": "P1", "productName": "T-Shirt", "price": 50, "discountedPrice": 45 },
    { "_id": "P2", "productName": "Jeans", "price": 100, "discountedPrice": 90 }
]
```

---

### 10. `$count`
**Definition:** Counts the number of documents passing through the pipeline.  
**Example:** Count total completed orders.
```js
db.orders.aggregate([
    { $match: { status: "completed" } },
    { $count: "totalCompletedOrders" }
]);
```
**Output:**
```json
[
    { "totalCompletedOrders": 2 }
]
```

---

### 11. `$facet`
**Definition:** Runs multiple aggregation pipelines in parallel on the same data.  
**Example:** Get paginated products and total count in one query.
```js
db.products.aggregate([
    {
        $facet: {
            paginatedResults: [
                { $sort: { price: -1 } },
                { $skip: 0 },
                { $limit: 2 }
            ],
            totalCount: [
                { $count: "count" }
            ]
        }
    }
]);
```
**Output:**
```json
[
    {
        "paginatedResults": [
            { "_id": "P2", "productName": "Jeans", "price": 100 },
            { "_id": "P1", "productName": "T-Shirt", "price": 50 }
        ],
        "totalCount": [
            { "count": 2 }
        ]
    }
]
```

---

### Bonus: Full Pipeline — Top 5 Customers by Spending
**Definition:** Combines many stages to get top customers by their completed order spending.
```js
db.orders.aggregate([
    { $match: { status: "completed" } },
    {
        $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customer"
        }
    },
    { $unwind: "$customer" },
    {
        $group: {
            _id: "$customer._id",
            totalSpent: { $sum: "$amount" },
            orders: { $push: "$_id" }
        }
    },
    {
        $project: {
            customerId: "$_id",
            totalSpent: 1,
            numberOfOrders: { $size: "$orders" }
        }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 }
]);
```
**Output:**
```json
[
    {
        "customerId": "C1",
        "totalSpent": 250,
        "numberOfOrders": 2
    }
]
```

---

## Basic MongoDB Queries

### 1. Find All Products in a Specific Category
**Definition:** Retrieve all products belonging to a specific category.
```js
db.products.find({ category: "Electronics" });
```
**Output:**
```json
[
    { "_id": 1, "name": "Smartphone", "category": "Electronics", "price": 699 },
    { "_id": 2, "name": "Laptop", "category": "Electronics", "price": 999 }
]
```

---

### 2. Find Products with Price Greater Than $500
**Definition:** Retrieve products where the price is greater than $500.
```js
db.products.find({ price: { $gt: 500 } });
```
**Output:**
```json
[
    { "_id": 2, "name": "Laptop", "category": "Electronics", "price": 999 }
]
```

---

### 3. Update Product Price
**Definition:** Update the price of a specific product.
```js
db.products.updateOne({ _id: 1 }, { $set: { price: 749 } });
```
**Output:**
```json
{ "acknowledged": true, "matchedCount": 1, "modifiedCount": 1 }
```

---

### 4. Delete Product by ID
**Definition:** Delete a product from the collection by its ID.
```js
db.products.deleteOne({ _id: 1 });
```
**Output:**
```json
{ "acknowledged": true, "deletedCount": 1 }
```

---

## Aggregation Pipeline Examples

### 5. Total Sales per Product
**Definition:** Calculate total sales for each product by multiplying quantity and price.
```js
db.orders.aggregate([
    { $group: { _id: "$productId", totalSales: { $sum: { $multiply: ["$quantity", "$price"] } } } }
]);
```
**Output:**
```json
[
    { "_id": 2, "totalSales": 1998 }
]
```

---

### 6. Average Order Value
**Definition:** Calculate the average value of all orders.
```js
db.orders.aggregate([
    { $group: { _id: null, averageOrderValue: { $avg: { $multiply: ["$quantity", "$price"] } } } }
]);
```
**Output:**
```json
[
    { "_id": null, "averageOrderValue": 999 }
]
```

---

### 7. Top 3 Customers by Total Spend
**Definition:** Identify the top 3 customers based on total spending.
```js
db.orders.aggregate([
    { $group: { _id: "$customerId", totalSpent: { $sum: { $multiply: ["$quantity", "$price"] } } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 3 }
]);
```
**Output:**
```json
[
    { "_id": 1, "totalSpent": 1998 },
    { "_id": 2, "totalSpent": 1498 },
    { "_id": 3, "totalSpent": 999 }
]
```

---

### 8. Join Orders with Customer Details
**Definition:** Combine order details with customer information.
```js
db.orders.aggregate([
    {
        $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customerDetails"
        }
    }
]);
```
**Output:**
```json
[
    {
        "_id": 1,
        "productId": 2,
        "quantity": 2,
        "price": 999,
        "customerId": 1,
        "customerDetails": [
            { "_id": 1, "name": "Alice", "email": "alice@example.com" }
        ]
    }
]
```

---

### 9. Flatten Nested Arrays with `$unwind`
**Definition:** Deconstruct an array field from the input documents to output a document for each element.
```js
db.orders.aggregate([
    { $unwind: "$items" },
    { $project: { orderId: 1, item: "$items.name", quantity: "$items.quantity" } }
]);
```
**Output:**
```json
[
    { "orderId": 1, "item": "Smartphone", "quantity": 2 },
    { "orderId": 1, "item": "Laptop", "quantity": 1 }
]
```

---

### 10. Group Orders by Status and Count
**Definition:** Group orders by their status and count the number of orders in each group.
```js
db.orders.aggregate([
    { $group: { _id: "$status", orderCount: { $sum: 1 } } }
]);
```
**Output:**
```json
[
    { "_id": "completed", "orderCount": 5 },
    { "_id": "pending", "orderCount": 2 }
]
```

---

### 11. Calculate Total Revenue
**Definition:** Calculate the total revenue by summing the total sales amount.
```js
db.orders.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } } } }
]);
```
**Output:**
```json
[
    { "_id": null, "totalRevenue": 7995 }
]
```

---

## Advanced Aggregation Operations

### 12. Use `$facet` for Multiple Aggregations
**Definition:** Perform multiple aggregation operations in parallel within a single pipeline.
```js
db.orders.aggregate([
    {
        $facet: {
            "totalOrders": [{ $count: "count" }],
            "completedOrders": [{ $match: { status: "completed" } }, { $count: "count" }],
            "pendingOrders": [{ $match: { status: "pending" } }, { $count: "count" }]
        }
    }
]);
```
**Output:**
```json
[
    {
        "totalOrders": [ { "count": 7 } ],
        "completedOrders": [ { "count": 5 } ],
        "pendingOrders": [ { "count": 2 } ]
    }
]
```

---

### 13. Calculate Moving Average
**Definition:** Compute a moving average of sales over a specified window.
```js
db.sales.aggregate([
    { $sort: { date: 1 } },
    {
        $group: {
            _id: null,
            sales: { $push: { date: "$date", amount: "$amount" } }
        }
    },
    {
        $project: {
            movingAverage: {
                $map: {
                    input: { $range: [0, { $size: "$sales" }] },
                    as: "index",
                    in: {
                        $avg: {
                            $slice: [
                                "$sales.amount",
                                { $subtract: ["$$index", 2] },
                                3
                            ]
                        }
                    }
                }
            }
        }
    }
]);
```
**Output:**
```json
[
    {
        "_id": null,
        "movingAverage": [ 100, 200, 300, 400, 500 ]
    }
]
```

---

## Indexing and Performance Optimization

### 14. Create Index on Product Price
**Definition:** Create an index on the price field to optimize queries filtering by price.
```js
db.products.createIndex({ price: 1 });
```
**Output:**
```json
{ "createdCollectionAutomatically": false }
```

---

### 15. Explain Query Execution Plan
**Definition:** Analyze the execution plan of a query to understand its performance.
```js
db.orders.find({ status: "completed" }).explain("executionStats");
```
**Output:**
```json
{
    "queryPlanner": { ... },
    "executionStats": {
        "nReturned": 5,
        "executionTimeMillis": 2,
        "totalKeysExamined": 5,
        "totalDocsExamined": 5
    }
}
```

---

## Data Modeling and Schema Design

### 16. Embed Order Items in Order Document
**Definition:** Store order items directly within the order document (embedding).
```js
db.orders.insertOne({
    customerId: 1,
    status: "completed",
    items: [
        { productId: 2, quantity: 1, price: 999 },
        { productId: 3, quantity: 2, price: 49 }
    ]
});
```
**Output:**
```json
{
    "_id": 1,
    "customerId": 1,
    "status": "completed",
    "items": [
        { "productId": 2, "quantity": 1, "price": 999 },
        { "productId": 3, "quantity": 2, "price": 49 }
    ]
}
```

---

### 17. Reference Product in Order Document
**Definition:** Store a reference to the product in the order document (referencing).
```js
db.orders.insertOne({
    customerId: 1,
    status: "completed",
    productId: 2,
    quantity: 1,
    price: 999
});
```
**Output:**
```json
{
    "_id": 1,
    "customerId": 1,
    "status": "completed",
    "productId": 2,
    "quantity": 1,
    "price": 999
}
```



# Mongoose Schema Design: Users, Loans, Repayments

## 🧍 User Schema

```js
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    kycVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
```

---

## 💰 Loan Schema

```js
const loanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    principalAmount: Number,
    interestRate: Number,
    termInMonths: Number,
    startDate: Date,
    status: { type: String, enum: ['pending', 'approved', 'repaid', 'defaulted'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
```

---

## 📄 Repayment Schema

```js
const repaymentSchema = new mongoose.Schema({
    loan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
    amount: Number,
    dueDate: Date,
    paidAt: Date,
    status: { type: String, enum: ['due', 'paid', 'late'], default: 'due' },
    createdAt: { type: Date, default: Date.now }
});
```

---

## 🔁 Embed vs Reference for Repayments

**Would you embed repayments inside Loan?**  
**Answer:** No (for production-scale systems).

### ✅ Why Use Referencing (as above):

| Factor                  | Reason                                                      |
|-------------------------|-------------------------------------------------------------|
| Many repayments per loan| Avoid document size limits (~16MB)                          |
| Independent updates     | Each repayment can be updated without rewriting the entire loan |
| Query flexibility       | Filter repayments across all loans (e.g., overdue repayments)|
| Decoupling              | Easier to scale repayments independently                    |

**🟨 When embedding is okay:** For tiny systems or if repayments are <10 and never change after creation.

---

# MongoDB Transactions with Mongoose

### ✅ Use Case:
Ensure loan creation and initial repayment schedule are saved atomically.

### 🧱 Steps with Mongoose:

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
    const user = await User.findById(userId).session(session);

    const loan = await Loan.create([{
        user: user._id,
        principalAmount: 10000,
        interestRate: 12,
        termInMonths: 12,
        startDate: new Date(),
    }], { session });

    const repayments = generateRepaymentSchedule(loan[0]); // returns array
    await Repayment.insertMany(repayments, { session });

    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({ loan: loan[0] });
} catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: 'Transaction failed', error: err.message });
}
```

> ⚠️ **Important:** Transactions require MongoDB replica set (even if it's just one node locally for dev).



# Optimizing Read-Heavy Dashboards in Fintech Apps (MongoDB + Caching)

Ensuring high performance for read-heavy queries (like a user dashboard in a fintech app such as Paisabazaar) requires a combination of smart schema design, MongoDB features, and external caching.

---

## 1. Optimizing Read Performance: Strategy Breakdown

| Layer      | Technique                        |
|------------|----------------------------------|
| 🔍 DB Query | Indexing & Projection            |
| 🧮 Computation | Aggregation Pipelines         |
| ⚡ Cache    | Redis or In-memory Caching       |
| 🧱 Structure | Data Shaping & Denormalization  |

---

### A. Indexing Strategies

- **Basic Indexes**: For user-based queries and status filters

    ```js
    db.loans.createIndex({ user: 1 })
    db.repayments.createIndex({ loan: 1 })
    db.loans.createIndex({ user: 1, status: 1 })
    db.repayments.createIndex({ loan: 1, status: 1 })
    ```

- **Compound Index**: For dashboard filters (e.g., "loans approved in last 30 days")

    ```js
    db.loans.createIndex({ user: 1, status: 1, createdAt: -1 })
    ```

> 🔍 Always analyze query plans using `.explain()`.

---

### B. Aggregation Pipeline

For a user dashboard, you might need:

- Total active loans
- Total outstanding amount
- Repayment status summary

```js
Loan.aggregate([
    { $match: { user: ObjectId(userId) } },
    {
        $lookup: {
            from: 'repayments',
            localField: '_id',
            foreignField: 'loan',
            as: 'repayments'
        }
    },
    {
        $project: {
            principalAmount: 1,
            status: 1,
            totalPaid: {
                $sum: {
                    $map: {
                        input: "$repayments",
                        as: "r",
                        in: { $cond: [{ $eq: ["$$r.status", "paid"] }, "$$r.amount", 0] }
                    }
                }
            }
        }
    }
]);
```

> ⚡ Use `$facet` to return multiple stats in a single query.

---

### C. Caching Layer (Redis)

**When to use Redis:**

- Same user loads dashboard multiple times a day
- Expensive aggregate queries
- High read-load patterns (e.g., mobile apps)

**Key Patterns:**

```js
const cacheKey = `dashboard:${userId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Otherwise compute and cache
const dashboardData = await computeDashboard(userId);
redis.set(cacheKey, JSON.stringify(dashboardData), 'EX', 60); // cache 1 min
```

> ⏳ Use short-lived cache (e.g., 60s) for fast-changing data.

---

### D. Denormalization (Selective)

To avoid joins:

- Store loan summary fields on the User document (e.g., `totalOutstanding`, `totalLoans`)
- Update these via change streams, hooks, or workers

**Example:**

```js
{
    _id: ObjectId("..."),
    name: "John",
    totalOutstandingAmount: 12000,
    totalLoans: 2
}
```

Update these fields automatically and asynchronously using:

---

## 2. Updating Derived Fields: Techniques

### 1. Change Streams – Native MongoDB Pub/Sub

MongoDB can emit events in real-time when data changes.

```js
const changeStream = Loan.watch();
changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
        const loan = change.fullDocument;
        // Update user doc with incremented totalLoans
    }
});
```

- ✅ Works best when your app directly listens to MongoDB changes.
- ⚠️ Requires replica set (works even in single-node dev).

---

### 2. Mongoose Hooks – Triggers within Node App

Run logic after a repayment is saved.

```js
repaymentSchema.post('save', async function (doc, next) {
    await User.findByIdAndUpdate(doc.user, {
        $inc: { totalRepaid: doc.amount }
    });
    next();
});
```

- ✅ Simple and localized logic
- ⚠️ Only works if your Node service makes the DB changes (not safe across services)

---

### 3. Background Workers (Kafka, Bull, Redis)

Publish an event to a queue; a background worker listens and updates MongoDB.

```js
// Producer (on repayment)
kafkaProducer.send({
    topic: "repayment-updates",
    messages: [{ value: JSON.stringify({ userId, amount }) }]
});

// Worker
kafkaConsumer.on("message", async ({ userId, amount }) => {
    await User.findByIdAndUpdate(userId, {
        $inc: { totalRepaid: amount }
    });
});
```

- ✅✅ Best for microservices/scale — fully decoupled

---

## 3. MongoDB Change Streams vs. Mongoose Hooks

Both allow you to respond to data changes, but serve different purposes.

### MongoDB Change Streams

- **What:** Listen to real-time changes in collections (insert, update, delete) directly from the DB.
- **When to use:** Reactive systems, cross-service event-driven architectures, syncing, auditing, notifications, analytics pipelines.

**Example:**

```js
const changeStream = mongoose.connection.collection('loans').watch();

changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
        console.log('New loan added:', change.fullDocument);
        // e.g., Update summary fields in User collection
    }
});
```

- ⚠️ Requires MongoDB replica set
- Works in any language, not just Node.js
- Streams are durable and scalable

---

### Mongoose Hooks (Middleware)

- **What:** Functions that run before/after certain operations like `.save()`, `.findOneAndUpdate()`, `.remove()`, etc.
- **When to use:** Side effects (validation, cleanup, update other collections) only when the change is made via your Node.js app using Mongoose.

**Example:**

```js
loanSchema.post('save', async function (doc, next) {
    console.log(`Loan ${doc._id} created for user ${doc.user}`);
    await User.findByIdAndUpdate(doc.user, { $inc: { totalLoans: 1 } });
    next();
});
```

- 🧠 Types: `pre('save')`, `post('save')`, `pre('find')`, `post('findOne')`, `pre('remove')`, etc.
- ⚠️ Only triggers when Mongoose is used

---

## 4. Using Change Streams with Mongoose

**Q:** If we use Mongoose, can we still use MongoDB Change Streams?  
**A:** Yes! Access the native MongoDB driver from Mongoose:

```js
const changeStream = mongoose.connection.collection('loans').watch();

changeStream.on('change', (change) => {
    console.log('Loan document changed:', change);
});
```

**Common Use Cases:**

- Triggering a queue (Kafka, Redis)
- Sending notifications
- Updating analytics logs

---

## 5. How MongoDB Watches for Changes (Under the Hood)

- MongoDB uses an event-driven architecture based on the oplog (operations log) in a replica set.
- The `watch()` function tails the oplog — a real-time feed of DB operations.
- Uses tailable cursors over TCP to stream events (not polling).

> 💬 **Analogy:**  
> Think of the change stream as a `subscribe()` call on the DB's internal write log. Whenever something is written to Mongo, you're notified over a long-lived TCP connection.




# Apache Cassandra Overview

Apache Cassandra is a high-performance, distributed NoSQL database designed to handle large volumes of structured, semi-structured, and unstructured data across many commodity servers, with no single point of failure. It is ideal for high-write throughput, horizontal scalability, and prioritizes availability over consistency (AP in the CAP theorem).

---

## 🔹 What is Cassandra?

- **Type:** Wide-column NoSQL database
- **Data Model:** Tables with rows and columns; columns can vary by row (hybrid between relational and key-value stores)
- **Architecture:** Peer-to-peer distributed system (no master/slave; all nodes are equal)
- **Consistency Model:** Eventually consistent (tunable consistency)
- **Language:** Uses CQL (Cassandra Query Language), similar to SQL

---

## 🔹 Why Do We Use Cassandra?

| Feature                | Benefit                                                      |
|------------------------|--------------------------------------------------------------|
| High Availability      | No single point of failure; nodes can fail and recover independently |
| Linear Scalability     | Add more nodes without downtime; performance scales linearly |
| High Write Throughput  | Optimized for fast, high-volume writes                       |
| Multi-Data Center Support | Native support for geo-redundancy                        |
| Tunable Consistency    | Choose between strong and eventual consistency per query     |

---

## 🔹 Cassandra vs MongoDB

| Feature         | Cassandra                                              | MongoDB                                                      |
|-----------------|-------------------------------------------------------|--------------------------------------------------------------|
| Data Model      | Wide-column store (tables, partition keys, clustering keys) | Document store (JSON-like BSON)                        |
| Write Performance | Excellent for high write loads                      | Good, but not as performant for write-heavy workloads        |
| Consistency     | Eventually consistent (tunable)                       | Strong consistency by default                                |
| Scaling         | Horizontally scalable, peer-to-peer                   | Sharded architecture, master-slave model                     |
| Availability    | Very high (AP in CAP)                                 | Stronger consistency but can impact availability (CP in CAP) |
| Use Case Fit    | Real-time analytics, time-series data, logs, sensor data, write-heavy apps | General-purpose, content management, e-commerce, read-heavy apps |

---

## 🔹 When Should You Use Cassandra?

Use Cassandra if you have:

- Write-heavy workloads (e.g., IoT, analytics pipelines, logs)
- A need for high availability and zero downtime
- Data distributed across multiple geographic locations
- Requirements for horizontal scalability
- Time-series data or append-only logs

---

## 🔹 When MongoDB Might Be Better

- You need complex querying, aggregations, and indexing
- You prefer a document-based flexible schema
- You have read-heavy workloads
- You need transactions across multiple documents

---

## 🧠 Real World Use Cases of Cassandra

- **Netflix:** Viewing history and streaming metadata
- **Instagram:** Messaging infrastructure
- **Uber:** Storing trip data and logs
- **Spotify:** User activity logging and recommendations

