// Each container which contains the maze will be 8 tiles wide + 12 tiles high
// each tile is 50px x 50 px
const CONTAINER_BUFFER = {
  x: 4,
  y: 2,
};

const CONTAINER_SIZE = {
  x: 8,
  y: 12,
};

export enum GridState {
  OutOfBounds, // Invalid path cannot place blocks
  InboundsUnplaceable, // Valid path but cannot place blocks
  InboundsPlaceable, // Valid path can place blocks
  Block, // Has a block placed
}

type GridBlock = {
  state: GridState;
};

class Game {
  // TODO fix typing
  monsters: any[];
  blocks: any[];
  clickState?: string;
  grid: GridBlock[][];
  gridSizeX: number;
  gridSizeY: number;

  constructor() {
    this.monsters = [];
    this.blocks = [];
    this.clickState = null;
    this.grid = [];
    const xMax = CONTAINER_BUFFER.x * 2 + CONTAINER_SIZE.x;
    const yMax = CONTAINER_BUFFER.y * 2 + CONTAINER_SIZE.y;
    this.gridSizeX = xMax;
    this.gridSizeY = yMax;
    for (let x = 0; x < xMax; x++) {
      this.grid.push([]);
      for (let y = 0; y < yMax; y++) {
        let gridState: GridState;
        switch (true) {
          case x < CONTAINER_BUFFER.x || xMax - x <= CONTAINER_BUFFER.x:
          case y < CONTAINER_BUFFER.y || yMax - y <= CONTAINER_BUFFER.y:
            gridState = GridState.OutOfBounds;
            break;
          default:
            gridState = GridState.InboundsPlaceable;
        }
        this.grid[x].push({
          state: gridState,
        });
      }
    }
  }

  getBlock(x: number, y: number): GridBlock {
    // TODO check outof bounds
    return this.grid[x] && this.grid[x][y]
      ? this.grid[x][y]
      : { state: GridState.OutOfBounds };
  }

  // tslint:disable-next-line
  handleClick(e) {}

  // tslint:disable-next-line
  runCycle(dt) {}
}

export default Game;
