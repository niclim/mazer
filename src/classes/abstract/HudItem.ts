import Renderer from "<src>/classes/Renderer";
import { Coordinates } from "<src>/types";

export default abstract class HudItem {
  // enhancement - allow path

  abstract doesIntersect(coordinates: Coordinates): boolean;

  abstract triggerAction(renderer: Renderer): void;
}
