import { BLOCK_SIZE } from "<src>/constants";
import { constrainToBoundary, constrainToGameBlock } from "<src>/utils";
import { Dimension } from "<src>/types";

describe("utils", () => {
  describe("constrainToBoundary", () => {
    const directions = [Dimension.HEIGHT, Dimension.WIDTH];
    const GAME_CONTAINER = {
      height: 100,
      width: 200,
    };

    test("constrains to the lower boundary", () => {
      const [heightDir, widthDir] = directions;
      const heightConstrainer = constrainToBoundary(heightDir);
      const widthConstrainer = constrainToBoundary(widthDir);
      expect(heightConstrainer(-10, GAME_CONTAINER)).toBe(0);
      expect(widthConstrainer(-10, GAME_CONTAINER)).toBe(0);
    });

    test("constrains to the top boundary", () => {
      const [heightDir, widthDir] = directions;
      const heightConstrainer = constrainToBoundary(heightDir);
      const widthConstrainer = constrainToBoundary(widthDir);
      expect(heightConstrainer(300, GAME_CONTAINER)).toBe(100);
      expect(widthConstrainer(300, GAME_CONTAINER)).toBe(200);
    });
  });

  describe("constrainToGameBlock", () => {
    test("rounds to closest gameblock size", () => {
      expect(
        constrainToGameBlock({
          x: BLOCK_SIZE + BLOCK_SIZE / 2,
          y: BLOCK_SIZE * 3 + BLOCK_SIZE / 5,
        })
      ).toEqual({
        x: BLOCK_SIZE,
        y: BLOCK_SIZE * 3,
      });
    });
  });
});
