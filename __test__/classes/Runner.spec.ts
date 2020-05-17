import Game from "<src>/classes/Game";
import Runner from "<src>/classes/Runner";
import { RUNNER_SPEED } from "<src>/constants";
import { uuid4 } from "<src>/utils";
// import types for mock canvas
// In this file instead of a setup file for vscode editor typing
import * as mockCanvasTyping from "jest-canvas-mock/types";

describe("Runner", () => {
  let runner: Runner;
  let game: Game;
  // Easiest way to generate a grid / start / end is to use the existing game object
  beforeEach(() => {
    game = new Game();
    const [grid, start, end] = game.getGridInfo();
    runner = new Runner(
      uuid4(),
      grid,
      start,
      end,
      () => {} // tslint:disable-line
    );
  });

  test("runCycle moves the runner's position", () => {
    // Test partial
    // Test change grid location
    const [initialGridBlock, initialProgress] = runner.getPosition();
    // Change in time required for a single move
    const dtForMove = 1 / RUNNER_SPEED;

    // move half a block
    const expectedProgress = 0.5;
    runner.runCycle(dtForMove * expectedProgress);
    const [move1GridBlock, move1Progress] = runner.getPosition();
    expect(move1GridBlock).toEqual(initialGridBlock);
    expect(move1Progress).not.toEqual(initialProgress);
    expect(move1Progress).toEqual(expectedProgress);

    // move one block - should wrap over to the next grid
    runner.runCycle(dtForMove);
    const [move2GridBlock, move2Progress] = runner.getPosition();
    expect(move2GridBlock).not.toEqual(initialGridBlock);
    // progress should be the same since we move exactly 1 "block"
    expect(move2Progress).toEqual(expectedProgress);
  });

  test("render should render the runner relative to the viewport", () => {
    const [position, _] = runner.getPosition();
    const mockContext = document.createElement("canvas").getContext("2d");
    const cameraPositions = [
      { x: 10, y: 100 },
      { x: -10, y: -100 },
    ];
    const tilePixels = 25;

    for (const cameraPosition of cameraPositions) {
      runner.render(mockContext, cameraPosition, tilePixels);
      const drawCalls = mockContext.__getDrawCalls();
      expect(drawCalls.length).toEqual(1);
      const drawCall = drawCalls[0];
      expect(drawCall.type).toEqual("fillRect");
      expect(drawCall.props).toEqual({
        x: position.x * tilePixels - cameraPosition.x,
        y: position.y * tilePixels - cameraPosition.y,
        width: tilePixels,
        height: tilePixels,
      });
      mockContext.__clearDrawCalls();
    }
  });

  test("render should render movement between blocks", () => {
    const mockContext = document.createElement("canvas").getContext("2d");
    const cameraPosition = { x: 0, y: 0 };
    const tilePixels = 25;

    runner.render(mockContext, cameraPosition, tilePixels);
    const drawCalls = mockContext.__getDrawCalls();
    expect(drawCalls.length).toEqual(1);
    const drawCall = drawCalls[0];
    // get initial render location
    const { x: initialX, y: initialY } = drawCall.props;
    const dtForMove = 1 / RUNNER_SPEED;
    mockContext.__clearDrawCalls();

    runner.runCycle(dtForMove * (dtForMove / 2));
    runner.render(mockContext, cameraPosition, tilePixels);
    const { x, y } = mockContext.__getDrawCalls()[0].props;
    expect({ x, y }).not.toEqual({ x: initialX, y: initialY });
  });
});
