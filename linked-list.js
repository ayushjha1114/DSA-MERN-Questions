// class Node {
//     constructor(data, next = null) {
//         this.data = data;
//         this.next = next;
//     }
//   }

//   class LinkedList {
//     constructor() {
//       this.head = null;
//       this.size = 0;
//     }

//     // Insert first node
//     insertFirst(data) {
//         this.head = new Node(data, this.head);
//         this.size++;
//     } 

//     // Insert Last node 
//     insertLast(data) {
//       let node = new Node(data);
//       let current;
//       if(!this.head) {
//         this.head = node;
//       } else {
//         current = this.head;

//         while(current.next) {
//           current = current.next;
//         }
//         current.next = node;
//       }
//       this.size++;
//     }

//     // insert at index
//     insertAt(data, index) {
//         if(index > 0 && index > this.size) {
//           return;
//         }
//       if (index === 0) {
//          this.insertFirst(data);
//         return;
//       }
//       let node = new Node(data);
//       let previous, current;

//       current = this.head;
//       let count = 0;
//        while(count < index) {
//           previous = current;
//           count++;
//          current = current.next;
//        }
//       node.next = current;
//       previous.next = node;

//       this.size++;
//     }

//     // Get at index
//     getAt(index) {
//       let current = this.head;
//       let count  = 0;

//        while (current !== null) {
//          if (count === index) {
//            console.log('index at ', index, ' : ', current.data);
//          }
//          count++;
//          current = current.next;
//        }
//     }

//     // Remove at index
//     removeAt(index) {
//       if (index > 0 && index > this.size) {
//         return;
//       }
//       let current = this.head;
//       let count  = 0, previous;
//       if (index === 0) {
//         this.head = current.next;
//       } else {
//             while (count < index) {
//          previous = current;
//          count++;
//          current = current.next;
//       }
//       previous.next = current.next;
//       }
//       this.size--;
//     }

//     // clear list
//     clearList() {
//       this.head = null;
//       this.size = 0;
//     }

//     // print list data
//     printListData() {
//       let current = this.head;
//        while (current !== null) {
//          console.log(current.data)
//          current = current.next;
//        }
//     }
//   }

//   const ll = new LinkedList();

//   ll.insertFirst(100);
//   ll.insertFirst(200);
//   ll.insertLast(300);
//   ll.insertAt(400, 2);
//   ll.insertAt(500, 0);
//   // ll.getAt(2);
//   // ll.removeAt(2);
//   ll.clearList();
//   ll.printListData();

// --------------------------------------------------------------------------------------------------------------------------

// 141. Linked List Cycle

// var hasCycle = function (head) {
//   let visited = new Set();
//   let current = head;

//   while (current !== null) {
//     if (visited.has(current)) {
//       return true
//     }

//     visited.add(current)
//     current = current.next
//   }

//   return false;
// };

// hasCycle([3, 2, 0, -4], 1); // true
// hasCycle([1, 2], 0); // true
// hasCycle([1], -1); // false

//-------------------------------------------------------------------------------------------------------------------------

// 2. Add Two Numbers

// Input: l1 = [2,4,3], l2 = [5,6,4]
// Output: [7,0,8]
// Explanation: 342 + 465 = 807.

// function ListNode(val, next) {
//   this.val = (val === undefined ? 0 : val);
//   this.next = next === undefined ? null : next;
// }


// const values = [2, 4, 3, 5];
// let head = null; // create a linked list with null 

// for (let i = values.length - 1; i >= 0; i--) {
//     head = new ListNode(values[i], head);
// }


// var addTwoNumbers = function (l1, l2) {
//     let result = new ListNode(0)
//     let current = result;
//     let carry = 0
//     console.log('dd', current, l1.val)

//     while (l1 !== null || l2 !== null || carry !== 0) {
//         const val1 = l1 ? l1.val : 0
//         const val2 = l2 ? l2.val : 0

//         console.log('val1 + val2 + carry', val1, val2, carry)

//         let sum = val1 + val2 + carry;

//         carry = Math.floor(sum / 10);
//         let digit = sum % 10

//         console.log('??????', sum, carry, digit)

//         current.next = new ListNode(digit)
//         current = current.next;

//         l1 = l1 ? l1.next : null;
//         l2 = l2 ? l2.next : null;
//         console.log(l1, l2)
//     }

//     console.log('rs', result.next)
// while(result) {
//     console.log('-->', result.val)
//     result = result.next
// }
//     return result.next
// };

// addTwoNumbers([2, 4, 3], [5, 6, 4]); // [7,0,8]
// addTwoNumbers([0], [0]); // [0]
// addTwoNumbers([9, 9, 9, 9, 9, 9, 9], [9, 9, 9]); // [8,9,9,0,0,0,1]


// 🧼 Clean & Optimized Final Version

// var addTwoNumbers = function(l1, l2) {
//     let dummy = new ListNode(0);
//     let current = dummy;
//     let carry = 0;

//     while (l1 || l2 || carry) {
//         let sum = (l1?.val || 0) + (l2?.val || 0) + carry;
//         carry = Math.floor(sum / 10);
//         current.next = new ListNode(sum % 10);
//         current = current.next;

//         l1 = l1?.next;
//         l2 = l2?.next;
//     }

//     return dummy.next;
// };


//---------------------------------------------------------------------------------------------------------------------------

// 21. Merge Two Sorted Lists

// var mergeTwoLists = function (list1, list2) {

//     let result = new ListNode(0);
//     let current = result;

//     while (list1 && list2) {
//        // console.log(list1, list2, '<---------------')
//         if (list1?.val <= list2?.val) {
//          //   console.log('>>>>inside if>>>>', list1?.val, list2?.val)
//             current.next = list1;
//             list1 = list1?.next;
//         } else {
//             current.next = list2;
//             list2 = list2?.next;
//         }
//         current = current.next;
//     }
//     // append remaining
//     current.next = list1 || list2;
//     return result.next;
// };

// mergeTwoLists([1, 2, 4], [1, 3, 4]); // [1,1,2,3,4,4]
// mergeTwoLists([], []); // []
// mergeTwoLists([], [0]); // [0]

//---------------------------------------------------------------------------------------------------------------------------

//206. Reverse Linked List
// Input: head = [1,2,3,4,5]
// Output: [5,4,3,2,1]


// var reverseList = function (head) {
//     if (!head) return null;
//     let current = head;
//     let stack = []

//     // Step 1: Push all nodes onto the stack
//     while (current) {
//         stack.push(current)
//         current = current.next;
//     }
//     console.log(stack)

//     // Step 2: Pop to rebuild the list in reverse
//     let newHead = stack.pop();
//     current = newHead;

//     while (stack.length > 0) {
//         let node = stack.pop();
//         current.next = node;
//         current = node;

//     }
//     current.next = null;
//     console.log(newHead)
//     return newHead;
// };

// reverseList([1, 2, 3, 4, 5]); // [5,4,3,2,1]
// reverseList([]); // []
// reverseList([1]); // [1]
// reverseList([1, 2]); // [2,1]


// ----------------------------------------------------------------------------------------------------------------------------

// 92. Reverse Linked List II

// var reverseBetween = function (head, left, right) {
//     let counter = 1
//     let current = head;

//     let stack = []

//     // Step 1: Push nodes in the target range to the stack
//     while (current) {
//         if (counter >= left && counter <= right) {
//             //console.log(counter, left, right)
//             stack.push(current.val);
//         }
//         current = current.next;
//         counter++;
//     }

//      // Step 2: Traverse again and replace values with popped ones
//     counter = 1;
//     current = head;
//     //console.log('stack', stack, 'cuurent', current);
//     while (current) {
//            // console.log(current, counter, left, right)
//         if (counter >= left && counter <= right) {
//             let node = stack.pop();
//             current.val = node;
//            // console.log('node', node, 'current', current, 'curNext', current.next)
//         }

//         current = current.next;
//         counter++;
//     }
//     return head;
// };

// reverseBetween([1, 2, 3, 4, 5], 2, 4); // [1,4,3,2,5]
// reverseBetween([1, 2, 3, 4, 5], 1, 5); // [5,4,3,2,1]


// ----------------------------------------------------------------------------------------------------------------------------

// 19. Remove Nth Node From End of List

// var removeNthFromEnd = function (head, n) {
//     let stack = []
//     let current = head
//     let totalCount = 0

//     // move all the elements of the linked list in stack
//     while (current) {
//         stack.push(current)
//         totalCount++;
//         current = current.next
//     }

//     // console.log('curretn', stack, totalCount)

//     if (totalCount === n) return head.next

//     let count = 1
//     let checkpoint = totalCount - n
//     current = head;

//     while (current) {
//         if (count === checkpoint) {
//             if (current?.next === null) {
//                 current = null;
//             } else {
//                 current.next = current?.next?.next;
//             }
//             break;
//         }
//         // console.log(current)
//         current = current.next;
//         count++
//     }

//     return head;
// };

// removeNthFromEnd([1, 2, 3, 4, 5], 2); // [1,2,3,5]
// removeNthFromEnd([1], 1); // []
// removeNthFromEnd([1, 2], 1); // [1]


//-----------------------------------------------------------------------------------------------------------------------------

// 83. Remove Duplicates from Sorted List

// var deleteDuplicates = function (head) {
//     let current = head;

//     while (current && current.next) {
//         // console.log(current.val, current.next?.val)
//         if (current.val === current.next?.val) {
//             current.next = current.next.next
//         } else {
//             current = current?.next
//         }
//     }
//     return head;
// };

// deleteDuplicates([1, 1, 2]); // [1,2]
// deleteDuplicates([1, 1, 2, 3, 3]); // [1,2,3]


//--------------------------------------------------------------------------------------------------------------------------


// 82. Remove Duplicates from Sorted List II
var deleteDuplicates = function (head) {
    let current = head;
    let res = [];
    let hm = new Map()

    while (current) {
        if (hm.has(current.val)) {
            hm.set(current.val, hm.get(current.val) + 1)
        } else {
            hm.set(current.val, 1)
        }
        current = current.next
    }

    for (let [key, value] of hm) {
        if (value === 1) {
            res.push(key)
        }
    }

   // console.log(res)

    let result = new ListNode(0)
    current = result

    for (let element of res) {
        current.next = new ListNode(element)
        //console.log(element, current , current.next)
        current = current.next;
    }
   // console.log(result)

    return result.next

};

deleteDuplicates([1,2,3,3,4,4,5]); // [1,2,5]
deleteDuplicates([1, 1, 1,2, 3]); // [2,3]