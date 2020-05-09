type Node<T> = {
  priority: number;
  value: T;
};
export default class PriorityQueue<T> {
  // Implemented as a binary heap
  private _heap: Node<T>[];
  private currentSize: number;
  constructor() {
    // Empty space not used to make maths easy
    this._heap = [
      {
        priority: 0,
        value: null,
      },
    ];
    this.currentSize = 0;
  }

  _swapUp(i: number) {
    // Swap upwards to find correct place to preserve heap property
    while (Math.floor(i / 2) > 0) {
      // If lower node is larger, swap
      if (this._heap[i].priority < this._heap[Math.floor(i / 2)].priority) {
        const temp = this._heap[Math.floor(i / 2)];
        this._heap[Math.floor(i / 2)] = this._heap[i];
        this._heap[i] = temp;
      } else {
        return;
      }
      i = Math.floor(i / 2);
    }
  }

  _swapDown(i: number) {
    // Stop when there are no children
    while (i * 2 < this.currentSize) {
      // Swap with the smallest child
      let minChild: number;
      switch (true) {
        // Handle case when only 1 child
        case i * 2 + 1 > this.currentSize:
          minChild = i * 2;
          break;
        case this._heap[i * 2].priority > this._heap[i * 2 + 1].priority:
          minChild = i * 2 + 1;
          break;
        default:
          minChild = i * 2;
      }

      if (this._heap[i].priority > this._heap[minChild].priority) {
        const temp = this._heap[i];
        this._heap[i] = this._heap[minChild];
        this._heap[minChild] = temp;
      } else {
        return;
      }
      i = i * 2;
    }
  }

  put(value: T, priority: number) {
    this._heap.push({
      priority,
      value,
    });
    this.currentSize++;
    this._swapUp(this.currentSize);
  }

  pop(): T {
    if (this.currentSize <= 0) {
      throw new Error("Queue is empty");
    }
    const value = this._heap[1].value;
    this._heap[1] = this._heap[this.currentSize];
    this.currentSize--;
    this._heap.pop();
    this._swapDown(1);

    return value;
  }

  get size(): number {
    return this.currentSize;
  }
}
