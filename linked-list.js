class Node {
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }
  }
  
  class LinkedList {
    constructor() {
      this.head = null;
      this.size = 0;
    }
    
    // Insert first node
    insertFirst(data) {
        this.head = new Node(data, this.head);
        this.size++;
    } 
    
    // Insert Last node 
    insertLast(data) {
      let node = new Node(data);
      let current;
      if(!this.head) {
        this.head = node;
      } else {
        current = this.head;
        
        while(current.next) {
          current = current.next;
        }
        current.next = node;
      }
      this.size++;
    }
    
    // insert at index
    insertAt(data, index) {
        if(index > 0 && index > this.size) {
          return;
        }
      if (index === 0) {
         this.insertFirst(data);
        return;
      }
      let node = new Node(data);
      let previous, current;
      
      current = this.head;
      let count = 0;
       while(count < index) {
          previous = current;
          count++;
         current = current.next;
       }
      node.next = current;
      previous.next = node;
      
      this.size++;
    }
    
    // Get at index
    getAt(index) {
      let current = this.head;
      let count  = 0;
      
       while (current !== null) {
         if (count === index) {
           console.log('index at ', index, ' : ', current.data);
         }
         count++;
         current = current.next;
       }
    }
    
    // Remove at index
    removeAt(index) {
      if (index > 0 && index > this.size) {
        return;
      }
      let current = this.head;
      let count  = 0, previous;
      if (index === 0) {
        this.head = current.next;
      } else {
            while (count < index) {
         previous = current;
         count++;
         current = current.next;
      }
      previous.next = current.next;
      }
      this.size--;
    }
    
    // clear list
    clearList() {
      this.head = null;
      this.size = 0;
    }
    
    // print list data
    printListData() {
      let current = this.head;
       while (current !== null) {
         console.log(current.data)
         current = current.next;
       }
    }
  }
  
  const ll = new LinkedList();
  
  ll.insertFirst(100);
  ll.insertFirst(200);
  ll.insertLast(300);
  ll.insertAt(400, 2);
  ll.insertAt(500, 0);
  // ll.getAt(2);
  // ll.removeAt(2);
  ll.clearList();
  ll.printListData();
  