import Renderable from "<src>/classes/abstract/Renderable";

export default abstract class GameUnit extends Renderable {
  abstract runCycle(dt: number): void;
}
