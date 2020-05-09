import { GridState } from "<src>/enums";
import { Coordinates, Grid, Path, GridBlock } from "<src>/types";
import PriorityQueue from "<src>/utils/priorityQueue";

type NodeMapValue = { previous: Coordinates | null; costSoFar: number };
type NodeMap = Map<GridBlock, NodeMapValue>;

// Cannot move diagonally
const VALID_DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const isCoordSame = (c1: Coordinates, c2: Coordinates): boolean =>
  c1.x === c2.x && c1.y === c2.y;

const PathableState = [GridState.InboundsPlaceable];

const _getValidMoves = (grid: Grid, position: Coordinates): Coordinates[] => {
  const validMoves = [];
  const { x, y } = position;

  for (const [dx, dy] of VALID_DIRECTIONS) {
    const newX = x + dx;
    const newY = y + dy;
    // Here we are relying on out of bounds array to be undefined
    if (grid[newX][newY] && grid[newX][newY].state in PathableState) {
      validMoves.push({
        x: newX,
        y: newY,
      });
    }
  }
  return validMoves;
};

const getBlock = (grid: Grid, coord: Coordinates) => grid[coord.x][coord.y];

const _search = (
  grid: Grid,
  start: Coordinates,
  end: Coordinates
): NodeMap | null => {
  const queue = new PriorityQueue<Coordinates>();
  const nodeMap: NodeMap = new Map();

  // initalize starting block
  nodeMap.set(getBlock(grid, start), {
    previous: null,
    costSoFar: 0,
  });

  queue.put(start, 0);

  while (queue.size > 0) {
    const current = queue.pop();

    if (isCoordSame(current, end)) {
      return nodeMap;
    }

    for (const nextLocation of _getValidMoves(grid, current)) {
      // Weight for each move is 1
      const newCost = nodeMap.get(getBlock(grid, current)).costSoFar + 1;
      const nextNode: NodeMapValue | undefined = nodeMap.get(
        getBlock(grid, nextLocation)
      );
      // Check for has visited this node OR if node to visit has higher cost than current visit path
      if (!nextNode || nextNode.costSoFar > newCost) {
        nodeMap.set(getBlock(grid, nextLocation), {
          previous: current,
          costSoFar: newCost,
        });
        // TODO create heuristic
        const fakeHeuristicFn = () => 1;
        const priority = newCost + fakeHeuristicFn();
        queue.put(nextLocation, priority);
      }
      // Otherwise, we don't need to continue
      // - already visited and cost is lower / equal
    }
  }

  return null;
};

// Uses a* to find a path from start to end
export const findPath = (
  grid: Grid,
  start: Coordinates,
  end: Coordinates
): Path | null => {
  // Check if start == end
  if (isCoordSame(start, end)) {
    return [];
  }

  const nodeMap = _search(grid, start, end);
  if (!nodeMap) {
    return null;
  }
  const path = [end];
  // Reverse traverse the path
  let currentNode = nodeMap.get(getBlock(grid, end));
  while (currentNode) {
    path.push(currentNode.previous);
    if (isCoordSame(start, currentNode.previous)) {
      return path.reverse();
    }
    currentNode = nodeMap.get(getBlock(grid, currentNode.previous));
  }
  // should error here, we should have a full path
  // if we don't have a full path there is an error in code
  throw new Error();
};

export const hasValidPath = (
  grid: Grid,
  start: Coordinates,
  end: Coordinates
) => findPath(grid, start, end) !== null;
