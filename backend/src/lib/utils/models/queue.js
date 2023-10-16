class Queue {
    constructor() {
        this.elements = [];
    }
    enqueue(element) {
        this.elements.push(element);
    }
    dequeue() {
        if (!this.isEmpty()) {
            return this.elements.shift();
        }
    }
    peek() {
        if (!this.isEmpty())
            return this.elements[0];
    }
    length() {
        return this.elements.length;
    }
    isEmpty() {
        return this.length() === 0;
    }
    clear() {
        this.elements = [];
    }
    getElements() {
        return this.elements;
    }
}

module.exports = Queue;
