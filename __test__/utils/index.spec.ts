import { boundNumberToMinMax } from "<src>/utils";

describe("utils", () => {
  describe("boundNumberToMinMax", () => {
    test("constrains a number to a min or maximum", () => {
      expect(boundNumberToMinMax(2, 1, 3)).toBe(2);
      expect(boundNumberToMinMax(0, 1, 3)).toBe(1);
      expect(boundNumberToMinMax(4, 1, 3)).toBe(3);
    });
  });
});
