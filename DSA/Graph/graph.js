class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex])
            this.adjacencyList[vertex] = [];
    }

    addEdge(v1, v2) {
        this.addVertex(v1);
        this.addVertex(v2);
        this.adjacencyList[v1].push(v2);
        this.adjacencyList[v2].push(v1); // comment if directed graph
    }

    removeEdge(v1, v2) {
        this.adjacencyList[v1] = this.adjacencyList[v1].filter(neighbor => neighbor !== v2);
        this.adjacencyList[v2] = this.adjacencyList[v2].filter(neighbor => neighbor !== v1);
    }

    removeVertex(vertex) {
        while (this.adjacencyList[vertex].length) {
            const neighbor = this.adjacencyList[vertex].pop()
            this.removeEdge(vertex, neighbor)
        }
        delete this.adjacencyList[vertex];
    }

    print() {
        console.log(this.adjacencyList)
    }

    bfs(start) {
        const queue = [start];
        const visited = new Set();

        visited.add(start)

        while (queue.length) {
            const vertex = queue.shift();
            console.log(vertex)

            for (let neighbor of this.adjacencyList[vertex]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor)
                }
            }
        }
    }


}

const graph = new Graph();

graph.addEdge("A", "B")
graph.addEdge("A", "C")
graph.addEdge("B", "D");
graph.addEdge("C", "D");
graph.addEdge("D", "E");

graph.print();
// Output:
// {
//   A: [ 'B', 'C' ],
//   B: [ 'A', 'D' ],
//   C: [ 'A', 'D' ],
//   D: [ 'B', 'C', 'E' ],
//   E: [ 'D' ]
// }

graph.bfs("A")

// graph.removeVertex("A")

// graph.print();


// ***************************************************************************************

// BFS









