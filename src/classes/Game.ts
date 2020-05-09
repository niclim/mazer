import {
  NUM_INITIAL_BLOCKS,
  MAX_RETRIES_BLOCK_PLACEMENT,
} from "<src>/constants";
import { GridState } from "<src>/enums";
import { getRandomNum } from "<src>/utils";
import { Coordinates, GridBlock, Grid } from "<src>/types";

// Each container which contains the maze will be 8 tiles wide + 12 tiles high
// each tile is 50px x 50 px
const CONTAINER_BUFFER = {
  x: 4,
  y: 2,
};

const CONTAINER_SIZE = {
  x: 7,
  y: 12,
};

class Game {
  grid: Grid;
  gridSizeX: number;
  gridSizeY: number;

  constructor() {
    this.grid = [];
    const xMax = CONTAINER_BUFFER.x * 2 + CONTAINER_SIZE.x;
    const yMax = CONTAINER_BUFFER.y * 2 + CONTAINER_SIZE.y;
    this.gridSizeX = xMax;
    this.gridSizeY = yMax;
    this.setupInitialBoardState(xMax, yMax);
    this.createInitialBlocks();
  }

  setupInitialBoardState(xMax: number, yMax: number) {
    const xCenter = CONTAINER_BUFFER.x + Math.floor(CONTAINER_SIZE.x / 2);
    for (let x = 0; x < xMax; x++) {
      this.grid.push([]);
      for (let y = 0; y < yMax; y++) {
        let gridState: GridState;
        switch (true) {
          case x === xCenter && y === CONTAINER_BUFFER.y - 1:
          case x === xCenter && y === CONTAINER_BUFFER.y + CONTAINER_SIZE.y:
            gridState = GridState.InboundsUnplaceable;
            break;
          case x < CONTAINER_BUFFER.x:
          case y < CONTAINER_BUFFER.y:
          case xMax - x <= CONTAINER_BUFFER.x:
          case yMax - y <= CONTAINER_BUFFER.y:
            gridState = GridState.OutOfBounds;
            break;
          default:
            gridState = GridState.InboundsPlaceable;
        }
        this.grid[x].push({
          state: gridState,
          x,
          y,
        });
      }
    }
  }

  getRandomBlockCoordinates(): Coordinates {
    return {
      x: getRandomNum(this.gridSizeX - CONTAINER_BUFFER.x, CONTAINER_BUFFER.x),
      y: getRandomNum(this.gridSizeY - CONTAINER_BUFFER.y, CONTAINER_BUFFER.y),
    };
  }

  placeRandomizedBlock() {
    // TODO - add some probablity here of throwing an error
    // And tune retry amounts to this
    for (let n = 0; n < MAX_RETRIES_BLOCK_PLACEMENT; n++) {
      // TODO - update this to use a more refined version for better
      // spaced out blocks
      const { x, y } = this.getRandomBlockCoordinates();
      // TODO also check for "is pathing valid"
      if (this.grid[x][y].state === GridState.InboundsPlaceable) {
        this.grid[x][y] = {
          ...this.grid[x][y],
          state: GridState.Block,
        };
        return;
      }
    }
    // TODO have better error handling here
    throw new Error(
      `Tried ${MAX_RETRIES_BLOCK_PLACEMENT} times to initialize board state`
    );
  }

  createInitialBlocks() {
    for (let i = 0; i < NUM_INITIAL_BLOCKS; i++) {
      this.placeRandomizedBlock();
    }
  }

  getBlock(x: number, y: number): GridBlock {
    // Returns an invalid block if out of bounds
    const invalidBlock = { state: GridState.OutOfBounds, x: 0, y: 0 };

    return this.grid[x] && this.grid[x][y] ? this.grid[x][y] : invalidBlock;
  }

  // tslint:disable-next-line
  handleClick(e) {}

  // tslint:disable-next-line
  runCycle(dt) {}
}

export default Game;
