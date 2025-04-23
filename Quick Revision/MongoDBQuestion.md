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