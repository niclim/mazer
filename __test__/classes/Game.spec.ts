import Game from "<src>/classes/Game";
import Runner from "<src>/classes/Runner";
import { GridState } from "<src>/enums";
import { Coordinates, Grid, GridBlock } from "<src>/types";

describe("Game", () => {
  let game: Game;
  beforeEach(() => {
    game = new Game();
  });

  test("getBlock returns a block object", () => {
    const inBoundsBlock = game.getBlock(1, 2);
    const outOfBoundsBlockNegative = game.getBlock(-100, -200);
    const outOfBoundsBlockPositive = game.getBlock(
      game.gridSizeX + 1,
      game.gridSizeY + 1
    );
    const expectedOutOfBounds = {
      x: 0,
      y: 0,
      state: GridState.OutOfBounds,
    };

    expect(inBoundsBlock).toMatchObject({
      x: 1,
      y: 2,
    });

    expect(outOfBoundsBlockNegative).toEqual(expectedOutOfBounds);
    expect(outOfBoundsBlockPositive).toEqual(expectedOutOfBounds);
  });

  test("game unit movement", () => {
    const gameUnitIterator1 = game.getGameUnits();
    // Should get the initially created runner
    // TODO update this test case to remove this when this create runner is moved to game state
    expect(gameUnitIterator1.next().value).toBeInstanceOf(Runner);
    expect(gameUnitIterator1.next().done).toBeTruthy();

    // Add a new runner
    // Check iterator returns the new runner
    game.createRunner();
    const gameUnitIterator2 = game.getGameUnits();
    const runner1PreMove = gameUnitIterator2.next().value;
    const runner2PreMove = gameUnitIterator2.next().value;
    expect(runner1PreMove).toBeInstanceOf(Runner);
    expect(runner2PreMove).toBeInstanceOf(Runner);
    const preMovePosition1 = runner1PreMove.getPosition();
    const preMovePosition2 = runner2PreMove.getPosition();
    expect(gameUnitIterator2.next().done).toBeTruthy();

    game.runCycle(1);
    const gameUnitIterator3 = game.getGameUnits();
    const runner1PostMove = gameUnitIterator3.next().value;
    const runner2PostMove = gameUnitIterator3.next().value;
    expect(gameUnitIterator2.next().done).toBeTruthy();
    expect(preMovePosition1).not.toEqual(runner1PostMove.getPosition());
    expect(preMovePosition2).not.toEqual(runner2PostMove.getPosition());
  });

  describe("handleClick", () => {
    const getBlocksOfStateType = (grid: Grid, type: GridState) => {
      return grid.reduce(
        (acc, next) => acc.concat(next.filter((block) => block.state === type)),
        []
      );
    };

    const getValidSurroundingBlocks = (
      _game: Game,
      block: Coordinates
    ): GridBlock[] => {
      const blocks = [];
      const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];
      for (const [dx, dy] of directions) {
        const _block = _game.getBlock(block.x + dx, block.y + dy);
        if (_block.state === GridState.InboundsPlaceable) {
          blocks.push(_block);
        }
      }
      return blocks;
    };

    const isBlockPlaceable = (_game: Game, block: Coordinates) => {
      // this is placable if all 4 locations are placeable
      // There is actually more cases but this is the easiest to find
      return getValidSurroundingBlocks(_game, block).length === 4;
    };

    test("block placement", () => {
      const [grid, start, end] = game.getGridInfo();
      // When block is placed - should be valid location - should return `null`
      // Find a block position we _know_ is a valid location
      // this would be: GridState.InboundsPlaceable
      const placeableBlocks = getBlocksOfStateType(
        grid,
        GridState.InboundsPlaceable
      );
      const locationToPlace = placeableBlocks.find((block) =>
        isBlockPlaceable(game, block)
      );
      // Skip over this test if we cannot find a valid block
      // TOOD update
      expect(locationToPlace).toBeDefined();

      // Place block at location
      const validPlacementMessage = game.handleClick({
        x: locationToPlace.x,
        y: locationToPlace.y,
      });
      expect(validPlacementMessage).toBeNull();

      expect(game.getBlock(locationToPlace.x, locationToPlace.y).state).toBe(
        GridState.Block
      );

      // When block is placed in invalid location - should return `ok`
      // two cases, unplaceable or blocks a valid path
      // Get place at invalid location
      const invalidLocationPlace = getBlocksOfStateType(
        grid,
        GridState.InboundsUnplaceable
      )[0];
      const invalidLocationPlaceMessage = game.handleClick({
        x: invalidLocationPlace.x,
        y: invalidLocationPlace.y,
      });
      expect(invalidLocationPlaceMessage).not.toBeNull();

      expect(
        game.getBlock(invalidLocationPlace.x, invalidLocationPlace.y).state
      ).toBe(GridState.InboundsUnplaceable);

      // Get place at blocked location
      // Easiest way to do this is find from the start position
      const blockPathLocationPlace = getValidSurroundingBlocks(game, start)[0];
      expect(blockPathLocationPlace).toBeDefined();
      const blockPathLocationPlaceMessage = game.handleClick({
        x: blockPathLocationPlace.x,
        y: blockPathLocationPlace.y,
      });
      expect(blockPathLocationPlaceMessage).not.toBeNull();

      expect(
        game.getBlock(blockPathLocationPlace.x, blockPathLocationPlace.y).state
      ).toBe(GridState.InboundsPlaceable);
    });
  });
});
