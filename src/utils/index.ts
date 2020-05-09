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
