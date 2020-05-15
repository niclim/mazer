import { Coordinates } from "<src>/types";

export default abstract class GameUnit {
  abstract runCycle(dt: number): void;

  // TODO - define this fn signature
  // should return a render fn + maybe a relative location?
  // Or should the render fn accept a canvas
  abstract render(
    context: CanvasRenderingContext2D,
    cameraPosition: Coordinates,
    tilePixels: number
  ): void;
}
