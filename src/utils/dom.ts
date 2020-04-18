import { Dimensions } from "../types";

export const calculateDimensions = (): Dimensions => {
  return { width: window.innerWidth, height: window.innerHeight };
};
