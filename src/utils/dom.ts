import { Dimensions } from "<src>/types";

export const calculateCanvasDimensions = (): Dimensions => {
  return { width: window.innerWidth, height: window.innerHeight };
};
