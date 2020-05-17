import { Coordinates } from "<src>/types";

export default abstract class GameUnit {
  abstract runCycle(dt: number): void;

  abstract render(
    context: CanvasRenderingContext2D,
    cameraPosition: Coordinates,
    tilePixels: number
  ): void;
}
