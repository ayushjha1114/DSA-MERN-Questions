# Complete Binary Tree Guide with JavaScript Implementation

## 🌳 What is a Binary Tree?

A binary tree is a type of tree data structure where each node has at most two children:

- One **left child**
- One **right child**

Think of it like a family tree where each person (node) can have up to two kids.

```
        A
       / \
      B   C
     / \   \
    D   E   F
```

Here:
- **A** is the root
- **B** and **C** are A's children
- **D** and **E** are children of B
- **F** is child of C

## 🛠️ Binary Tree in JavaScript

We define a simple Node class and build a tree:

```javascript
// Node class
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Create nodes
const root = new Node("A");
root.left = new Node("B");
root.right = new Node("C");
root.left.left = new Node("D");
root.left.right = new Node("E");
root.right.right = new Node("F");
```

## 🔁 Binary Tree Traversals

Traversal means visiting every node in some order. There are two main types:

### 1. Depth-First Search (DFS)
Go deep before going wide. Types:
- **Inorder**: Left → Root → Right
- **Preorder**: Root → Left → Right
- **Postorder**: Left → Right → Root

### 2. Breadth-First Search (BFS)
Go level by level (also called Level Order).

---

## 1️⃣ Inorder Traversal (Left, Root, Right)

```javascript
function inorder(node) {
  if (node === null) return;
  inorder(node.left);
  console.log(node.value);
  inorder(node.right);
}

inorder(root); // Output: D B E A C F
```

**Explanation:**
1. Go to the leftmost child
2. Visit node
3. Then go right

---

## 2️⃣ Preorder Traversal (Root, Left, Right)

```javascript
function preorder(node) {
  if (node === null) return;
  console.log(node.value);
  preorder(node.left);
  preorder(node.right);
}

preorder(root); // Output: A B D E C F
```

**Use case:** Useful for copying or exporting a tree.

---

## 3️⃣ Postorder Traversal (Left, Right, Root)

```javascript
function postorder(node) {
  if (node === null) return;
  postorder(node.left);
  postorder(node.right);
  console.log(node.value);
}

postorder(root); // Output: D E B F C A
```

**Use case:** Useful when deleting a tree (clean-up).

---

## 4️⃣ Level Order Traversal (BFS)

This uses a queue (First-In, First-Out):

```javascript
function levelOrder(root) {
  if (!root) return;

  let queue = [root];

  while (queue.length > 0) {
    let current = queue.shift(); // remove first
    console.log(current.value);

    if (current.left) queue.push(current.left);
    if (current.right) queue.push(current.right);
  }
}

levelOrder(root); // Output: A B C D E F
```

---

## 📊 Summary Table

| Traversal | Order | Use Case |
|-----------|-------|----------|
| **Inorder** | Left → Root → Right | Sorted output (in BSTs) |
| **Preorder** | Root → Left → Right | Copying tree |
| **Postorder** | Left → Right → Root | Deleting tree |
| **Level Order** | Level by level | Finding shortest path, BFS |

---

## 🧠 Visualizing Traversals

For the tree:
```
        A
       / \
      B   C
     / \   \
    D   E   F
```

- **Inorder:** D B E A C F
- **Preorder:** A B D E C F
- **Postorder:** D E B F C A
- **Level Order:** A B C D E F

---

## Manually Converting an Array to a Binary Tree and Inorder Traversal

### 📦 Step 1: Understand the Input Format

Given input: `[1, null, 2, 3]`

- This is a **level-order (BFS)** representation of a binary tree
- `null` means the node doesn't exist
- Fill the tree left to right, level by level

**Index Breakdown:**

| Index | Value | Represents |
|-------|-------|------------|
| 0 | 1 | Root |
| 1 | null | Left of 1 |
| 2 | 2 | Right of 1 |
| 3 | 3 | Left of 2 |

### 🖼️ Step 2: Draw the Tree

Based on the array, the tree structure is:

```
    1
     \
      2
     /
    3
```

- Node 1: no left, right = 2
- Node 2: left = 3

### 🔄 Step 3: Inorder Traversal (Left → Root → Right)

Traverse the tree in inorder:

1. Start at **1**:
   - Left → `null` (skip)
   - Visit **1** → output: `[1]`
   - Right → **2**

2. At **2**:
   - Left → **3**

3. At **3**:
   - Left → `null` (skip)
   - Visit **3** → output: `[1, 3]`
   - Right → `null` (skip)

4. Back to **2**:
   - Visit **2** → output: `[1, 3, 2]`

### ✅ Final Answer

**Inorder traversal output:** `[1, 3, 2]`

---

## Key Points to Remember

- **Binary trees** are fundamental data structures with at most 2 children per node
- **Traversals** help you visit nodes in specific orders for different use cases
- **DFS traversals** (inorder, preorder, postorder) use recursion
- **BFS traversal** (level order) uses a queue
- **Array representation** follows level-order indexing with `null` for missing nodes