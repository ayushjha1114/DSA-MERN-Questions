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


//-----------------------------------------------------------------------------------------------------------

// 20. Valid Parentheses

var isValid = function (s) {
    let stack = [];

    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            const top = stack[stack.length - 1];
            if (
                (char === ')' && top === '(') ||
                (char === '}' && top === '{') ||
                (char === ']' && top === '[')
            ) {
                stack.pop();
            } else {
                return false; 
            }
        }
    }

    return stack.length === 0;
};

isValid("()[]{}"); // Output: true
isValid("(]"); // Output: false
isValid("([)]"); // Output: false


//-----------------------------------------------------------------------------------------------------------
// 71. Simplify Path
var simplifyPath = function (path) {
    let parts = path.split('/')
    let stack = []
    //console.log(parts)

    for (let i = 0; i < parts.length; i++) {
        let part = parts[i]
        // console.log(part)
        if (part === '' || part === '.') {
            continue;
        } else if (part === '..') {
            if (stack.length > 0) stack.pop()
        }
        else {
            stack.push(part)
            //   console.log(stack)
        }
    }
    //  console.log(stack.join('/'))

    return '/' + stack.join('/')
};

simplifyPath("/a/./b/../../c/"); // Output: "/c"
simplifyPath("/../"); // Output: "/"
simplifyPath("/home//foo/"); // Output: "/home/foo"
simplifyPath("/home/user/Documents/../Pictures"); // Output: "/home/user/Pictures"


//-----------------------------------------------------------------------------------------------------------

// 150. Evaluate Reverse Polish Notation

var evalRPN = function (tokens) {
    let stack = []
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '+' || tokens[i] === '-' || tokens[i] === '*' || tokens[i] === '/') {
            let num2 = stack.pop();
            let num1 = stack.pop();
            switch (tokens[i]) {
                case '+':
                    stack.push(num1 + num2)
                    break;
                case '-':
                    stack.push(num1 - num2)
                    break;
                case '*':
                    stack.push(num1 * num2)
                    break;
                case '/':
                    stack.push(parseInt(num1 / num2))
                    break;
            }
        }
        else {
            stack.push(Number(tokens[i]))
        }
    }
    //  console.log(stack)
    return stack.pop();
};

evalRPN(["2", "1", "+", "3", "*"]); // Output: 9
evalRPN(["4", "13", "5", "/", "+"]); // Output: 6
evalRPN(["10", "6", "9", "3", "/", "-11", "*", "+", "17", "+", "5", "+"]); // Output: 22

