// 94. Binary Tree Inorder Traversal

// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
}

function inorderTraversal(root) {
    if (!root) return [];
    return [...inorderTraversal(root.left), root.val, ...inorderTraversal(root.right)]
};


const root = new TreeNode(1, null, new TreeNode(2, new TreeNode(3, null, null), null)); // [1, null, 2, 3]
console.log(inorderTraversal(root)); // Output: [1, 3, 2]


/* 🧠 Visualization of the Call Stack

inorderTraversal(1)
├── inorderTraversal(null) ➝ []
├── value = 1
└── inorderTraversal(2)
    ├── inorderTraversal(3)
    │   ├── inorderTraversal(null) ➝ []
    │   ├── value = 3
    │   └── inorderTraversal(null) ➝ []
    │   ➝ returns [3]
    ├── value = 2
    └── inorderTraversal(null) ➝ []
    ➝ returns [3, 2]

Final ➝ [1, 3, 2] */

/* ****************************************************************************************************************** */


// 144 Binary Tree Preorder Traversal

function preorderTraversal(root) {
    if (!root) return [];
    return [root.val, ...preorderTraversal(root.left), ...preorderTraversal(root.right)];
}

const rootPre = new TreeNode(1, null, new TreeNode(2, new TreeNode(3, null, null), null)); // [1, null, 2, 3]
console.log(preorderTraversal(rootPre)); // Output: [1, 2, 3]

/* ****************************************************************************************************************** */


// 145 Binary Tree Postorder Traversal

function postorderTraversal(root) {
    if (!root) return [];
    return [...postorderTraversal(root.left), ...postorderTraversal(root.right), root.val];
}

const rootPost = new TreeNode(1, null, new TreeNode(2, new TreeNode(3, null, null), null)); // [1, null, 2, 3]
console.log(postorderTraversal(rootPost)); // Output: [3, 2, 1]

/* ****************************************************************************************************************** */



// 98. Validate Binary Search Tree

function isValidBST(root) {
    return validate(root, -Infinity, Infinity);
}

function validate(node, min, max) {
    if (!node) return true;

    if (node.val <= min || node.val >= max) return false;

    return validate(node.left, min, node.val) &&
        validate(node.right, node.val, max);
}

// Build tree: [2, 1, 3]
const rootBST = new TreeNode(2, new TreeNode(1), new TreeNode(3));

console.log(isValidBST(rootBST)); // Output: true

/* ****************************************************************************************************************** */


// 700. Search in a Binary Search Tree

function searchBST(root, val) {
    if (!root) return null;

    if (root.val === val) return root;

    if (val < root.val) {
        return searchBST(root.left, val)
    } else {
        return searchBST(root.right, val)
    }
};

// Build tree: [4, 2, 7, 1, 3]
const rootSearch = new TreeNode(4,
    new TreeNode(2, new TreeNode(1), new TreeNode(3)),
    new TreeNode(7)
);

console.log(searchBST(rootSearch, 2)); // Output: TreeNode { val: 2, left: TreeNode { val: 1, left: null, right: null }, right: TreeNode { val: 3, left: null, right: null } }

// Iterative version of Search in a Binary Search Tree

function searchBST(root, val) {
    if (!root) return null;

    const stack = [root]; // start with the root

    while (stack.length > 0) {
        const node = stack.pop(); // get the top node

        if (!node) continue;

        if (node.val === val) return node;

        // In BST: search left if val < node.val
        if (val < node.val) {
            stack.push(node.left);
        } else {
            stack.push(node.right);
        }
    }

    return null; // not found
}

/* ****************************************************************************************************************** */

// 100. Same Tree

function isSameTree(p, q) {
    if (!p && !q) return true;
    if (!p || !q) return false;
    if (p.val !== q.val) return false

    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}

// Build trees: [1, 2, 3] and [1, 2, 3]
const p = new TreeNode(1, new TreeNode(2), new TreeNode(3));
const q = new TreeNode(1, new TreeNode(2), new TreeNode(3));

console.log(isSameTree(p, q)); // Output: true

/* ****************************************************************************************************************** */


// 112. Path Sum

/* Input: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
Output: true
Explanation: The root-to-leaf path with the target sum is shown.

Input: root = [1,2,3], targetSum = 5
Output: false
Explanation: There are two root-to-leaf paths in the tree:
(1 --> 2): The sum is 3.
(1 --> 3): The sum is 4.
There is no root-to-leaf path with sum = 5. */

function hasPathSum(root, targetSum) {
    if (!root) return false;

    const stack = [[root, root.val]];

    while (stack.length > 0) {
        const [node, currentSum] = stack.pop()

        if (!node.left && !node.right && currentSum === targetSum) {
            return true;
        }

        if (node.left) {
            stack.push([node.left, node.left.val + currentSum])
        }

        if (node.right) {
            stack.push([node.right, node.right.val + currentSum])
        }
    }
    return false
};


// Build tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]
const rootPathSum = new TreeNode(5,
    new TreeNode(4, new TreeNode(11, new TreeNode(7), new TreeNode(2)), null),
    new TreeNode(8, new TreeNode(13), new TreeNode(4, null, new TreeNode(1)))
);

console.log(hasPathSum(rootPathSum, 22)); // Output: true


/* ****************************************************************************************************************** */


// 938. Range Sum of BST

/* Given the root of a Binary Search Tree and two integers low and high, return the sum of all the values of nodes with value between low and high (inclusive).

Input

root = [10, 5, 15, 3, 7, null, 18]
low = 7
high = 15
Tree:

        10
       /  \
      5    15
     / \     \
    3   7     18
🎯 Target:
We want to sum all nodes between 7 and 15, inclusive.

✅ Nodes: 7, 10, 15
✅ Sum: 7 + 10 + 15 = 32 */


function rangeSumBST(root, low, high) {
  if (!root) return 0;

  // If root value is less than low → skip left subtree
  if (root.val < low) {
    return rangeSumBST(root.right, low, high);
  }

  // If root value is greater than high → skip right subtree
  if (root.val > high) {
    return rangeSumBST(root.left, low, high);
  }

  // Root is in range → include it, and check both children
  return (
    root.val +
    rangeSumBST(root.left, low, high) +
    rangeSumBST(root.right, low, high)
  );
}
 // Stack-Based Version (DFS)

function rangeSumBST(root, low, high) {
  let sum = 0;
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;

    if (node.val >= low && node.val <= high) {
      sum += node.val;
    }

    if (node.val > low) {
      stack.push(node.left);  // left subtree might have valid values
    }

    if (node.val < high) {
      stack.push(node.right); // right subtree might have valid values
    }
  }

  return sum;
}

// Build tree: [10, 5, 15, 3, 7, null, 18]
const rootRangeSum = new TreeNode(10,
    new TreeNode(5, new TreeNode(3), new TreeNode(7)),
    new TreeNode(15, null, new TreeNode(18))
);  

console.log(rangeSumBST(rootRangeSum, 7, 15)); // Output: 32


/* ****************************************************************************************************************** */

// 108. Convert Sorted Array to Binary Search Tree

/* We build the tree like this:
Pick middle element of the array → becomes the root
Left half → recursively becomes the left subtree
Right half → recursively becomes the right subtree
This gives a balanced tree. */


function sortedArrayToBST(nums) {
  if (!nums.length) return null;

  const midIndex = Math.floor(nums.length / 2);
  const root = new TreeNode(nums[midIndex]);

  root.left = sortedArrayToBST(nums.slice(0, midIndex));        // left half
  root.right = sortedArrayToBST(nums.slice(midIndex + 1));      // right half

  return root;
}

// Example usage
const nums = [-10, -3, 0, 5, 9];
const bstRoot = sortedArrayToBST(nums);
console.log(bstRoot); // Output: TreeNode representing the balanced BST
