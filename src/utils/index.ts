import { Coordinates } from "<src>/types";

export const boundNumberToMinMax = (
  n: number,
  min: number,
  max: number
): number => Math.min(Math.max(n, min), max);

export const calculateWindowOffset = (
  windowDimension: number,
  containerDimension: number
): number => (containerDimension - windowDimension) / 2;

export const getRandomNum = (upper: number, lower: number = 0): number =>
  Math.floor(Math.random() * (upper - lower)) + lower;

export const isCoordSame = (c1: Coordinates, c2: Coordinates): boolean =>
  c1.x === c2.x && c1.y === c2.y;

// Copy pasted from: https://gist.github.com/jed/982883
// tslint:disable
export const uuid4 = () => {
  return ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};
// tslint:enable
