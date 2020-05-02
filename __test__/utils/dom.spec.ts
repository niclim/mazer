import { calculateCanvasDimensions } from "../../src/utils/dom";

describe("utils", () => {
  describe("calculateCanvasDimensions", () => {
    test("should return the width and height of the window", () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const { width, height } = calculateCanvasDimensions();
      expect({ width, height }).toEqual({
        width: windowWidth,
        height: windowHeight,
      });
    });
  });
});
