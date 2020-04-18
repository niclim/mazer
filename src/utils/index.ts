import { BLOCK_SIZE } from "../constants";
import { Coordinates } from "../types";
// helper function to constrain camera to side
// could go to bottom right and it will show black, will need to fix this
// TODO fix typing here
export const constrainToBoundary = (direction) => (
  val: number,
  GAME_CONTAINER
) => Math.min(Math.max(val, 0), GAME_CONTAINER[direction]);

const _getClosestBlockSize = (n: number) => n - (n % BLOCK_SIZE);

export const constrainToGameBlock = ({ x, y }: Coordinates): Coordinates => ({
  x: _getClosestBlockSize(x),
  y: _getClosestBlockSize(y),
});

export const debounce = (
  func: Function,
  wait: number,
  immediate: boolean = false
) => {
  let timeout: NodeJS.Timer;
  return (...args) => {
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(this, args);
    }
  };
};
