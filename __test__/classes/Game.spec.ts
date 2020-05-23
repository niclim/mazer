import Game from "<src>/classes/Game";
import Runner from "<src>/classes/Runner";
import { GridState } from "<src>/enums";

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
    test("block placement", () => {
      // todo
    });
  });
});
