import { BLOCK_SIZE } from "<src>/constants";
import { Coordinates, Dimension, Dimensions } from "<src>/types";
// helper function to constrain camera to side
// could go to bottom right and it will show black, will need to fix this
export const constrainToBoundary = (direction: Dimension) => (
  val: number,
  GAME_CONTAINER: Dimensions
) => Math.min(Math.max(val, 0), GAME_CONTAINER[direction]);

const _getClosestBlockSize = (n: number) => n - (n % BLOCK_SIZE);

export const constrainToGameBlock = ({ x, y }: Coordinates): Coordinates => ({
  x: _getClosestBlockSize(x),
  y: _getClosestBlockSize(y),
});
