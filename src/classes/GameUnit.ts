export default abstract class GameUnit {
  abstract runCycle(dt: number): void;

  // TODO - define this fn signature
  // should return a render fn + maybe a relative location?
  // Or should the render fn accept a canvas
  abstract render(): void;
}
