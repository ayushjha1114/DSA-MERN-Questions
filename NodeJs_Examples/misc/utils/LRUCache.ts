/* ✅ What is an LRU Cache?
An LRU Cache:

Stores key-value pairs.

Has a fixed capacity.

When the cache exceeds capacity, it removes the least recently used item.

Accessing or adding a key makes it the most recently used.

🧱 Data Structures Needed:
Map (or doubly-linked list + hash map for full control)

JavaScript’s Map maintains insertion order, which helps us mimic an LRU structure. */



class LRUCache {
    private capacity: number;
    private cache: Map<number, number>;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key: number): number {
        if (!this.cache.has(key)) return -1;

        const value = this.cache.get(key)!;
        this.cache.delete(key)
        this.cache.set(key, value);
        return value;
    }

    put(key: number, value: number): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey)
        }
        this.cache.set(key, value);
    }
}


const lru = new LRUCache(3);
lru.put(1, 100);
lru.put(2, 200);
lru.put(3, 300);

console.log(lru.get(1)); // 100, now 1 is most recently used
lru.put(4, 400);         // removes key 2 (least recently used)

console.log(lru.get(2)); // -1 (not found)
console.log(lru.get(3)); // 300