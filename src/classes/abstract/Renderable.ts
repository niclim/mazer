import { Coordinates } from "<src>/types";

export default abstract class Renderable {
  abstract render(
    context: CanvasRenderingContext2D,
    cameraPosition: Coordinates,
    tilePixels: number
  ): void;
}
