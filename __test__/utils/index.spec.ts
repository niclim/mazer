import { boundNumberToMinMax, calculateWindowOffset } from "<src>/utils";

describe("utils", () => {
  test("boundNumberToMinMax constrains a number to a min or maximum", () => {
    expect(boundNumberToMinMax(2, 1, 3)).toBe(2);
    expect(boundNumberToMinMax(0, 1, 3)).toBe(1);
    expect(boundNumberToMinMax(4, 1, 3)).toBe(3);
  });

  test("calculateWindowOffset", () => {
    const testCases = [
      [[200, 50], -75],
      [[500, 100], -200],
      [[10, 50], 20],
    ];
    for (const [
      [windowDimension, containerDimension],
      expectedResult,
    ] of testCases) {
      expect(calculateWindowOffset(windowDimension, containerDimension)).toBe(
        expectedResult
      );
    }
  });
});
