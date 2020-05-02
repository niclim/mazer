export const boundNumberToMinMax = (
  n: number,
  min: number,
  max: number
): number => Math.min(Math.max(n, min), max);

export const calculateWindowOffset = (
  windowDimension: number,
  containerDimension: number
) => (containerDimension - windowDimension) / 2;
