# AVL Tree: Complete Self-Balancing BST Guide

## 🌳 What is an AVL Tree?

An **AVL Tree** is a type of **self-balancing Binary Search Tree (BST)** where the height difference (balance factor) between the left and right subtrees of every node is at most **1**.

✅ **Named after** its inventors **Adelson-Velsky and Landis**.

## 🧠 Why AVL Tree?

In a normal BST, if you insert elements in sorted order, it becomes **skewed** (like a linked list).

That makes operations like search, insert, delete → **O(n)**.

**AVL Tree maintains balance**, so height stays **O(log n)** → all operations are fast.

## 📏 Balance Factor

For any node:

```
balanceFactor = height(left subtree) - height(right subtree)
or we can say
heightBalance = |height(left subtree) - height(right subtree)| < 2
```

**Allowed values:** `-1, 0, +1`

If balance factor goes beyond this range after insertion/deletion → we **rotate to fix it**.

## 🔄 Rotations in AVL Tree

There are **4 types of rotations** to maintain balance:

| Case | Condition | Rotation Type |
|------|-----------|---------------|
| **LL** | Inserted in left of left subtree | Single Right Rotation |
| **RR** | Inserted in right of right subtree | Single Left Rotation |
| **LR** | Inserted in right of left subtree | Left-Right Rotation (Double) |
| **RL** | Inserted in left of right subtree | Right-Left Rotation (Double) |

---

## 🌱 Example: Insertion Causing LL Imbalance

**Inserting:** 30 → 20 → 10

### Step 1: Insert 30
```
 30
```

### Step 2: Insert 20
```
  30
 /
20
```

### Step 3: Insert 10
```
   30
  /
 20
/
10
```

This is **left-heavy** → **LL Case**

### 🔧 Fix it using Right Rotation on node 30

### ✅ After Rotation:
```
   20
  /  \
10   30
```
**Balanced ✅**

---

## 🌿 Example: Insertion Causing LR Imbalance

**Inserting:** 30 → 10 → 20

```
    30
   /
  10
    \
    20
```

This is **Left-Right Case (LR)**

### 🔧 Fix with:
1. **Left Rotation** on 10
2. **Right Rotation** on 30

### ✅ After Rotations:
```
    20
   /  \
 10   30
```
**Balanced ✅**

---

## ⚙️ AVL Tree Operations – Time Complexities

| Operation | Time |
|-----------|------|
| **Search** | O(log n) |
| **Insert** | O(log n) |
| **Delete** | O(log n) |

*(Thanks to self-balancing)*

---

## 🔄 Rotation Types Explained

### 1. Single Right Rotation (LL Case)
- Used when left subtree is heavier
- Rotate the unbalanced node to the right

### 2. Single Left Rotation (RR Case)
- Used when right subtree is heavier
- Rotate the unbalanced node to the left

### 3. Left-Right Rotation (LR Case)
- First: Left rotation on left child
- Then: Right rotation on root

### 4. Right-Left Rotation (RL Case)
- First: Right rotation on right child
- Then: Left rotation on root

---

## 🆚 AVL vs Other Trees

| Feature | AVL Tree | Red-Black Tree | Regular BST |
|---------|----------|----------------|-------------|
| **Balance Guarantee** | Strict (±1) | Loose | None |
| **Search Performance** | Fastest | Fast | Can be O(n) |
| **Insert/Delete** | Slower (more rotations) | Faster | Fast if balanced |
| **Use Case** | Lookup-heavy | Insert/delete-heavy | Simple cases |

---

## 📌 Summary

- **AVL is a self-balancing BST**
- **Maintains balance using rotations**
- **Ensures all operations remain efficient (O(log n))**
- **It's faster for lookup-heavy use cases** compared to Red-Black Trees
- **Perfect when you need guaranteed logarithmic performance**

## 🎯 When to Use AVL Trees

✅ **Use AVL when:**
- Search operations are more frequent than insertions/deletions
- You need guaranteed O(log n) performance
- Height balance is critical for your application

❌ **Consider alternatives when:**
- Frequent insertions/deletions (Red-Black trees are better)
- Memory is a constraint (AVL stores balance factors)
- Simple use cases where regular BST suffices