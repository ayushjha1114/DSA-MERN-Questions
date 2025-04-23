// class Stack {
//     constructor() {
//         this.items = []
//     }

//     push(element) {
//         this.items.push(element);
//     }

//     pop() {
//         if (this.isEmpty()) {
//             return "Stack Underflow";
//         }

//         return this.items.pop();
//     }

//     isEmpty() {
//         return this.items.length === 0;
//     }

//     peek() {
//         if (this.isEmpty()) {
//             return "Stack is Empty"
//         }
//         return this.items[this.items.length - 1];
//     }

//     size() {
//         return this.items.length;
//     }

//     print() {
//         console.log(this.items.join(' '))
//     }
// }

// const stack = new Stack();

// stack.push(2)
// stack.print()


function removeConsecutive(str, n) {
    const stack = [];
  
    // Pass 1: Push chars with grouping
    for (let char of str) {
      if (stack.length && stack[stack.length - 1].char === char) {
        stack[stack.length - 1].count++;
      } else {
        stack.push({ char, count: 1 });
      }
    }

  
    let result = [];
    for (let i = 0; i < stack.length; i++) {
        if (stack[i].count < n) {
          result.push(stack[i].char.repeat(stack[i].count));
        }
      }
  
    return result.join('');
  }
  
  
  
  
  

console.log(removeConsecutive("aaaabbbaaaaaccd", 4)); // Output: "bbbccd"

