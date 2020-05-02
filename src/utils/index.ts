export const boundNumberToMinMax = (
  n: number,
  min: number,
  max: number
): number => Math.min(Math.max(n, min), max);
