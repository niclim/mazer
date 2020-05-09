import { GridState } from "<src>/enums";
import { Coordinates, Grid, Path } from "<src>/types";
import { isCoordSame } from "<src>/utils";
import { findPath, hasValidPath } from "<src>/utils/path";

const constructGrid = (gridStates: GridState[][]): Grid =>
  gridStates.map((states, y) =>
    states.map((state, x) => ({
      state,
      x,
      y,
    }))
  );

describe("path finding", () => {
  const x = GridState.Block;
  const o = GridState.InboundsPlaceable;
  // Here we don't really care about what the path is, only that it's valid
  // Valid means, it starts and ends at expected locations and has valid moves inbetween
  const assertPathValid = (
    path: Path,
    start: Coordinates,
    end: Coordinates
  ) => {
    // path should have at least 2 - start and end (unless start == end)
    expect(isCoordSame(path[0], start)).toBeTruthy();
    expect(isCoordSame(path[path.length - 1], end)).toBeTruthy();

    for (let i = 1; i < path.length; i++) {
      // should only be allowed 1 distance in x/y coordinate (i.e. no diagonal moves)
      const currentMove = path[i];
      const previousMove = path[i - 1];
      const xDiff = Math.abs(currentMove.x - previousMove.x);
      const yDiff = Math.abs(currentMove.y - previousMove.y);

      expect(xDiff + yDiff).toBe(1);
    }
  };

  test("grid with straight line path", () => {
    // 4x4 grid
    // x across
    // y down
    const gridStates = [
      [x, o, x, x],
      [o, o, o, o],
      [o, o, o, o],
      [x, o, x, x],
    ];

    const grid = constructGrid(gridStates);
    const start = { x: 0, y: 1 };
    const end = { x: 3, y: 1 };

    const path = findPath(grid, start, end);
    expect(hasValidPath(grid, start, end)).toBeTruthy();
    assertPathValid(path, start, end);
  });

  test("large grid with obstacles", () => {
    // 4x4 grid
    // x across
    // y down
    const gridStates = [
      [x, o, x, x, o, o, o, x, o, o, o, o, o],
      [x, o, o, o, o, x, o, o, o, x, o, x, o],
      [x, o, x, x, x, x, x, x, x, x, x, x, o],
      [x, x, x, x, x, x, x, x, x, x, o, o, o],
      [x, o, o, o, o, o, o, o, o, o, o, o, o],
      [x, o, x, x, o, x, o, x, x, x, x, x, x],
      [x, o, x, x, o, o, o, o, o, o, o, o, o],
      [x, o, x, x, x, x, x, x, x, x, o, o, o],
      [x, x, x, x, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, x, x, x, x, x, x, x, x],
      [o, x, o, x, o, o, o, o, o, o, o, o, o],
      [x, o, o, x, o, o, o, o, o, o, o, o, o],
    ];

    const grid = constructGrid(gridStates);
    const start = { x: 0, y: 1 };
    const end = { x: 11, y: 1 };

    const path = findPath(grid, start, end);
    expect(hasValidPath(grid, start, end)).toBeTruthy();
    assertPathValid(path, start, end);
  });

  test("grid with obstacles", () => {
    // 4x4 grid
    // x across
    // y down
    const gridStates = [
      [x, o, x, x],
      [o, o, o, o],
      [o, x, x, o],
      [x, o, o, o],
    ];

    const grid = constructGrid(gridStates);
    const start = { x: 0, y: 1 };
    const end = { x: 3, y: 1 };

    const path = findPath(grid, start, end);
    expect(hasValidPath(grid, start, end)).toBeTruthy();
    assertPathValid(path, start, end);
  });

  test("grid with no valid paths", () => {
    // 4x4 grid
    // x across
    // y down
    const gridStates = [
      [x, o, x, x],
      [o, o, o, o],
      [o, x, x, o],
      [x, o, o, x],
    ];

    const grid = constructGrid(gridStates);
    const start = { x: 0, y: 1 };
    const end = { x: 3, y: 1 };

    expect(hasValidPath(grid, start, end)).toBeFalsy();
  });
});
