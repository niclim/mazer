import {
  boundNumberToMinMax,
  calculateWindowOffset,
  getRandomNum,
  isCoordSame,
} from "<src>/utils";

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

  test("getRandomNum", () => {
    jest.spyOn(global.Math, "random").mockReturnValue(1);
    expect(getRandomNum(10, 2)).toBe(10);

    jest.spyOn(global.Math, "random").mockReturnValue(0);
    expect(getRandomNum(10, 2)).toBe(2);

    jest.spyOn(global.Math, "random").mockReturnValue(0.2);
    expect(getRandomNum(10, 2)).toBe(3);

    (global.Math.random as jest.Mock).mockRestore();
  });

  test("isCoordSame", () => {
    const coord1 = {
      x: 1,
      y: 2,
    };
    const coord2 = {
      x: 1,
      y: 2,
    };
    const coord3 = {
      x: 1,
      y: 1,
    };
    const coord4 = {
      x: 2,
      y: 2,
    };
    expect(isCoordSame(coord1, coord2)).toBeTruthy();
    expect(isCoordSame(coord1, coord3)).toBeFalsy();
    expect(isCoordSame(coord1, coord4)).toBeFalsy();
    expect(isCoordSame(coord3, coord4)).toBeFalsy();
  });
});
