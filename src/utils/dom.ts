import { Dimensions } from "<src>/types";

export const calculateDimensions = (): Dimensions => {
  return { width: window.innerWidth, height: window.innerHeight };
};
