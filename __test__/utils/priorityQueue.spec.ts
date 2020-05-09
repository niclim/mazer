import PriorityQueue from "<src>/utils/priorityQueue";

test("Priority Queue", () => {
  const queue = new PriorityQueue<number>();
  expect(queue.size).toBe(0);
  const firstValuesToAdd = [10, 3, 7, 2, 6, 12, 5];

  for (const value of firstValuesToAdd) {
    // Set value to same as priority
    queue.put(value, value);
  }

  expect(queue.size).toBe(firstValuesToAdd.length);

  // pop 2
  expect(queue.pop()).toBe(2);
  expect(queue.pop()).toBe(3);

  expect(queue.size).toBe(firstValuesToAdd.length - 2);

  // add 2 more
  for (const value of [3, 8]) {
    queue.put(value, value);
  }

  expect(queue.pop()).toBe(3);
  expect(queue.pop()).toBe(5);
  expect(queue.pop()).toBe(6);
  expect(queue.pop()).toBe(7);
  expect(queue.pop()).toBe(8);
  expect(queue.size).toBe(firstValuesToAdd.length - 5);
});

test("Priority Queue is empty", () => {
  const queue = new PriorityQueue<number>();
  expect(queue.size).toBe(0);
  expect(() => queue.pop()).toThrowError();
});
