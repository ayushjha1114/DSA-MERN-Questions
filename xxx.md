React uses a tree diffing algorithm in its Virtual DOM implementation to efficiently determine the minimum number of changes needed to update the real DOM. This process is commonly referred to as "reconciliation".

🧠 What is the Tree Diff Algorithm?
React’s tree diff algorithm compares two trees:

The previous Virtual DOM tree (before update)

The new Virtual DOM tree (after update)

Then it:

Figures out what’s changed

Generates a patch

Applies the patch to the real DOM

⚡ React's diff algorithm is optimized with heuristics to reduce time complexity — not a generic tree diff (which is O(n³)).

🎯 Heuristics Used by React
React makes three key assumptions to improve performance:

Two elements of different types will produce different trees.
Example: <div> vs <span> → treat as completely new subtree.

Developers can hint at stability using keys in lists.
Keys are used to track moved or updated elements.

Component re-rendering is isolated.
If a component doesn’t change, React doesn’t re-render its subtree.

📦 Tree Diff Example
🧱 Previous Virtual DOM Tree:
jsx
Copy
Edit
<ul>
  <li key="A">Apple</li>
  <li key="B">Banana</li>
  <li key="C">Cherry</li>
</ul>
🔁 Updated Virtual DOM Tree:
jsx
Copy
Edit
<ul>
  <li key="B">Banana</li>
  <li key="C">Cherry</li>
  <li key="D">Date</li>
</ul>
🔍 React’s Diff Output:
<li key="A"> is removed

<li key="D"> is added

<li key="B"> and <li key="C"> are reused (moved)

React uses the key attribute to match list items between updates.

Without keys, React uses index-based diffing, which leads to performance issues and bugs in dynamic lists.

🌳 Virtual DOM Tree Structure
plaintext
Copy
Edit
ul
├── li (key="A") - "Apple"
├── li (key="B") - "Banana"
└── li (key="C") - "Cherry"
Each <li> is a child node of the <ul> parent. React builds this tree internally, attaching properties like:

Element type (li)

Props (like key)

Children (text nodes or nested elements)

🔎 Detailed Representation (React-style)
json
Copy
Edit
{
  type: "ul",
  props: {},
  children: [
    {
      type: "li",
      key: "A",
      props: { children: "Apple" }
    },
    {
      type: "li",
      key: "B",
      props: { children: "Banana" }
    },
    {
      type: "li",
      key: "C",
      props: { children: "Cherry" }
    }
  ]
}
Each node in the virtual DOM tree is a plain JavaScript object representing a DOM element.

⏱️ Time Complexity
React’s optimized diffing algorithm has:

O(n) time complexity (linear), where n = number of nodes in the tree

Thanks to the heuristics, it avoids the costly O(n³) complexity of generic tree diffs

This is only possible because:

It avoids comparing subtrees if the node types differ

It compares only siblings (not arbitrary nodes across the tree)