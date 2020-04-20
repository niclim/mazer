import { BLOCK_SIZE } from "<src>/constants";
import { Dimension } from "<src>/enums";
import {
  boundNumberToMinMax,
  constrainToBoundary,
  constrainToGameBlock,
} from "<src>/utils";

describe("utils", () => {
  describe("boundNumberToMinMax", () => {
    test("constrains a number to a min or maximum", () => {
      expect(boundNumberToMinMax(2, 1, 3)).toBe(2);
      expect(boundNumberToMinMax(0, 1, 3)).toBe(1);
      expect(boundNumberToMinMax(4, 1, 3)).toBe(3);
    });
  });

  describe("constrainToBoundary", () => {
    const directions = [Dimension.Height, Dimension.Width];
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
