/* eslint-env jest */
import { constrainToBoundary } from "../../src/utils";

describe("utils", () => {
  describe("constrainToBoundary", () => {
    const directions = ["HEIGHT", "WIDTH"];
    const GAME_CONTAINER = {
      [directions[0]]: 100,
      [directions[1]]: 200,
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
});
