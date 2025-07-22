// Combinations (using back tracking)

/*
🤔 What is Backtracking?
Backtracking is a method of solving problems incrementally, 
building up potential solutions piece by piece and abandoning (backtracking from) a path as soon as it’s clear it won't work.

It's like exploring a maze:

You go down a path.

If you hit a dead end, you back up and try a different path.

You keep doing this until all valid paths are explored.

Backtracking is a systematic trial-and-error technique used to build solutions incrementally and undo choices when a path doesn't lead to a valid solution.

Think of it like:

“Try this path. If it fails, undo the last choice and try the next option.”

🧠 How Backtracking Works – Step by Step
Start with an empty solution (partial state)

Explore all valid choices at this state (e.g., next number to pick)

Pick one, extend the current solution

Recurse to continue building

If the current path reaches a dead end or a valid solution, backtrack:

Undo the last choice

Try the next choice

Repeat until all paths are explored

💡 When Should You Think of Backtracking?
Ask these questions:

Question	If YES → Consider backtracking
Do I need to explore all possible combinations or permutations?	✅
Is the problem recursive by nature (subproblems depend on smaller subproblems)?	✅
Is there a “build-solution step-by-step” pattern?	✅
Do I need to undo steps when a path is invalid?	✅
Are constraints involved (e.g. Sudoku, N-Queens)?	✅


🔁 Backtracking Template (Generic Pseudocode)

function backtrack(path) {
  if (goalReached(path)) {
    result.push([...path]);
    return;
  }

  for (let choice of choices) {
    if (isValid(choice, path)) {
      path.push(choice);        // Make choice
      backtrack(path);          // Recurse
      path.pop();               // Undo choice
    }
  }
}
*/


// const combine = (n, k) => {
//     let result = [];

//     function backtrack(start, path) {
//         if (path.length === k) {
//         console.log('start, path', start, path)
//             result.push([...path]);
//             console.log('result', result)
//             return;
//         }

//         for (let i = start; i <= n; i++) {
//             path.push(i);
//             backtrack(i + 1, path)
//             path.pop()
//         }
//     }

//     backtrack(1, [])

//     console.log('result------------->', result)

//     return result;
// }

// combine(4, 2) // [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]] // combination contain non-repeating elements


// function combine(n, k) {
//     const result = [];
//     for(let i = 1; i <= n; i++) {
//         for (let j = i+1; j <= n; j++) {
//             result.push([i, j]);
//             console.log([i, j])
//         }
//     }
//     return result;
// }

/* ⚠️ Limitation:
This works only when k === 2.
If you want combinations of arbitrary k, use the backtracking method above. */
// combine(4, 2); // [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]


//--------------------------------------------------------------------------------------------------

// 46. Permutations
// Input: nums = [1,2,3]
// Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

// const permute = (nums) => {
//     let result = [];

//     function backtrack(path) {
//         //console.log('start, path--->', start, path)
//         if (path.length === nums.length) {
//             result.push([...path])
//             return;
//         }

//         for (let i = 0; i < nums.length; i++) {
//             // console.log('>>>>>>>>>>>', path.includes(nums[i]), path)
//            if (path.includes(nums[i])) continue;
//             path.push(nums[i]);
//             backtrack(path);
//             path.pop();
//         }
//     }

//     backtrack([])
//     console.log(result)
//     return result;
// }

// permute([1, 2, 3]) // [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]] // O(n!) * O(n)

// optimized version of permutation 

// const permute = (nums) => {
//     const result = [];
//     const used = new Array(nums.length).fill(false); // Track usage of each element

//     function backtrack(path) {
//         if (path.length === nums.length) {
//             result.push([...path]);
//             return;
//         }

//         for (let i = 0; i < nums.length; i++) {
//             if (used[i]) continue;   // Skip if already used in current path

//             used[i] = true;          // Mark as used
//             path.push(nums[i]);      // Choose
//             backtrack(path);         // Explore
//             path.pop();              // Un-choose
//             used[i] = false;         // Mark as unused (backtrack)
//         }
//     }

//     backtrack([]);
//     return result;
// };

// console.log(permute([1, 2, 3])); // [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]] // O(n!) * O(n)


//---------------------------------------------------------------------------------------------------

// 79. Word Search

// Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
// Output: true

// Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
// Output: true

// function wordSearch(board, word) {
//     const rows = board.length;
//     const cols = board[0].length;

//     function backtrack(row, col, index) {
//         console.log('col, row, index',  row,col, index, word[index])
//         if (index === word.length) return true;


//         //check for boundaries and character match
//         if (row < 0 || row >= rows || // check for row out of bound
//             col < 0 || col >= cols || // check for col out of bound
//             board[row][col] !== word[index]) // check for character match
//         return false;

//         const temp = board[row][col];
//         board[row][col] = '#'



//         // explore neighbours up down left right
//         const found  = backtrack(row+1, col, index+1) ||
//                        backtrack(row-1, col, index+1) ||
//                        backtrack(row, col+1, index+1) ||
//                        backtrack(row, col-1, index+1);

//         //restore its original value
//         board[row][col] = temp;

//         console.log(board)
//         console.log('found',found)
//         return found;

//     }

//     for (let i = 0; i < rows; i++) {
//         for (let j = 0; j < cols; j++) {
//             if (backtrack(i, j, 0)) {
//                 return true
//             }
//         }
//     }

//     return false;
// }

// console.log(wordSearch([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")) // true
// console.log(wordSearch([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE")) // true


//-----------------------------------------------------------------------------------------------------
// 54. Spiral Matrix

// Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
// Output: [1,2,3,6,9,8,7,4,5]

// var spiralOrder = function(matrix) {
//     let result = []
//     let top = 0;
//     let left = 0;
//     let right = matrix[0].length-1;
//     let bottom = matrix.length-1;

//     while (top <= bottom && left <= right) {
//         // print left to right
//         for (let j = left; j <= right; j++) {
//             console.log(matrix[top][j])
//             result.push(matrix[top][j])
//         }
//         top++;
//        // print right to bottom
//         for (let j = top; j <= bottom; j++) {
//             console.log(matrix[j][right])
//             result.push(matrix[j][right])
//         }
//         right--;
//         // check if only a row present in matrix and it will unncessary iterate backward
//         if (top <= bottom) {
//             // print right to bottom
//             for (let j = right; j >= left; j--) {
//                 console.log(matrix[bottom][j])
//                 result.push(matrix[bottom][j])
//             }
//             bottom--;

//         }
//         if (left <= right) {
//             // print bottom to top
//             for (let j = bottom; j >= top; j--) {
//                 console.log(matrix[j][left])
//                 result.push(matrix[j][left])
//             }
//             left++;
//         }

//     }
//     console.log(result)
//     return result;
// };

// spiralOrder([[1,2,3],[4,5,6],[7,8,9]]) // [1,2,3,6,9,8,7,4,5] O(n*m)
// spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]]) // [1,2,3,4,8,12,11,10,9,5,6,7]
// spiralOrder([[1,2,3],[4,5,6]]) // [1,2,3,6,5,4]
// spiralOrder([[1,2,3]]) // [1,2,3]


//-----------------------------------------------------------------------------------------------------

// 73. Set Matrix Zeroes

// Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
// Output: [[1,0,1],[0,0,0],[1,0,1]]

// let arr = [[1, 1, 1], 
//           [1, 0, 1], 
//           [1, 1, 1]]
           
let arr = [[1, 1, 1], 
           [0, 1, 1], 
           [1, 1, 1]]
           
           
let row, col;

for (let i = 0; i < arr.length; i++) {
    for(let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === 0) {
            row = i;
            col = j;
            console.log(i , j)
            // setMatrixZero(arr, 0, i)
            // setMatrixZero(arr, 1, 0)
        }
    }
}
              setMatrixZero(row, col)

function setMatrixZero(row, col) {
    for(let x = 0; x < arr[row].length; x++) {
        arr[x][col] = 0
    }
    for(let x = 0; x < arr[row].length; x++) {
        arr[row][x] = 0
    }
}

console.log(arr)


//------------------------------------------------------------------------------------------------------

function convertObj(obj) {
    const result = {};

    const keys = Object.keys(obj);
    const values = Object.values(obj);

    for (let i = 0; i < keys.length; i++) {
        const keyParts = keys[i].split('.');
        const value = values[i];

        let current = result;

        for (let j = 0; j < keyParts.length; j++) {
            const part = keyParts[j];

            // If it's the last part, set the value
            if (j === keyParts.length - 1) {
                current[part] = value;
            } else {
                // If the next level doesn't exist, create it
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
        }
    }

    console.log(result);
}

// ✅ Example usage
const a = { 'a.b': 1, 'a.c': 2, 'd.e.f': 3 };
convertObj(a);

// Output:
// {
//   a: { b: 1, c: 2 },
//   d: { e: { f: 3 } }
// }

