/* eslint-env jest */
import { calculateDimensions } from "../../src/utils/dom";

describe("utils", () => {
  describe("calculateDimensions", () => {
    test("should return the width and height of the window", () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const { width, height } = calculateDimensions();
      expect({ width, height }).toEqual({
        width: windowWidth,
        height: windowHeight,
      });
    });
  });
});
