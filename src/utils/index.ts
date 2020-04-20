import { BLOCK_SIZE } from "<src>/constants";
import { Dimension } from "<src>/enums";
import { Coordinates, Dimensions } from "<src>/types";

export const boundNumberToMinMax = (
  n: number,
  min: number,
  max: number
): number => Math.min(Math.max(n, min), max);

// helper function to constrain camera to side
// could go to bottom right and it will show black, will need to fix this
export const constrainToBoundary = (direction: Dimension) => (
  val: number,
  GAME_CONTAINER: Dimensions
) => boundNumberToMinMax(val, 0, GAME_CONTAINER[direction]);

const _getClosestBlockSize = (n: number) => n - (n % BLOCK_SIZE);

export const constrainToGameBlock = ({ x, y }: Coordinates): Coordinates => ({
  x: _getClosestBlockSize(x),
  y: _getClosestBlockSize(y),
});
