import omit from "lodash.omit";

import {
  NUM_INITIAL_BLOCKS,
  MAX_RETRIES_BLOCK_PLACEMENT,
} from "<src>/constants";
import GameUnit from "<src>/classes/GameUnit";
import Runner from "<src>/classes/Runner";
import { GridState } from "<src>/enums";
import { getRandomNum, uuid4 } from "<src>/utils";
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
  gridSizeX: number;
  gridSizeY: number;
  private gameUnits: Record<string, GameUnit>;
  private grid: Grid;
  private start: Coordinates;
  private end: Coordinates;

  constructor() {
    this.grid = [];
    this.gameUnits = {};
    const xMax = CONTAINER_BUFFER.x * 2 + CONTAINER_SIZE.x;
    const yMax = CONTAINER_BUFFER.y * 2 + CONTAINER_SIZE.y;
    const xCenter = CONTAINER_BUFFER.x + Math.floor(CONTAINER_SIZE.x / 2);
    this.gridSizeX = xMax;
    this.gridSizeY = yMax;
    this.start = { x: xCenter, y: CONTAINER_BUFFER.y + CONTAINER_SIZE.y };
    this.end = { x: xCenter, y: CONTAINER_BUFFER.y - 1 };
    this._setupInitialBoardState(xMax, yMax);
    this._createInitialBlocks();
  }

  private _setupInitialBoardState(xMax: number, yMax: number) {
    for (let x = 0; x < xMax; x++) {
      this.grid.push([]);
      for (let y = 0; y < yMax; y++) {
        let gridState: GridState;
        switch (true) {
          case x === this.start.x && y === this.start.y:
          case x === this.end.x && y === this.end.y:
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

  private _getRandomBlockCoordinates(): Coordinates {
    return {
      x: getRandomNum(this.gridSizeX - CONTAINER_BUFFER.x, CONTAINER_BUFFER.x),
      y: getRandomNum(this.gridSizeY - CONTAINER_BUFFER.y, CONTAINER_BUFFER.y),
    };
  }

  private _placeRandomizedBlock() {
    // TODO - add some probablity here of throwing an error
    // And tune retry amounts to this
    for (let n = 0; n < MAX_RETRIES_BLOCK_PLACEMENT; n++) {
      // TODO - update this to use a more refined version for better
      // spaced out blocks
      const { x, y } = this._getRandomBlockCoordinates();
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

  private _createInitialBlocks() {
    for (let i = 0; i < NUM_INITIAL_BLOCKS; i++) {
      this._placeRandomizedBlock();
    }
  }

  getBlock(x: number, y: number): GridBlock {
    // Returns an invalid block if out of bounds
    const invalidBlock = { state: GridState.OutOfBounds, x: 0, y: 0 };

    return this.grid[x] && this.grid[x][y] ? this.grid[x][y] : invalidBlock;
  }

  createRunner() {
    // Runner will run through the maze
    const identifier = uuid4();
    this.gameUnits[identifier] = new Runner(
      identifier,
      this.grid,
      this.start,
      this.end,
      (_id: string) => {
        this.gameUnits = omit(this.gameUnits, _id);
      }
    );
  }

  runCycle(dt: number) {
    Object.values(this.gameUnits).forEach((unit) => {
      unit.runCycle(dt);
    });
  }

  *getUnitsForRender(): Generator<GameUnit> {
    for (const unit of Object.values(this.gameUnits)) {
      yield unit;
    }
  }
}

export default Game;
