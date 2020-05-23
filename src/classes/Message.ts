import Renderable from "<src>/classes/abstract/Renderable";
import { MESSAGE_FONT } from "<src>/constants";
import { Coordinates } from "<src>/types";

export default class Message extends Renderable {
  initialTime: number;
  timeUntilDismiss: number;
  message: string;
  location: Coordinates;
  // TODO - other custom properties?
  // get typing of canvas properties and spread? + reset?
  constructor(time: number, message: string, location: Coordinates) {
    super();
    this.initialTime = time;
    this.timeUntilDismiss = time; // time in seconds
    this.message = message;
    this.location = location;
  }

  render = (
    context: CanvasRenderingContext2D,
    cameraPosition: Coordinates,
    tilePixels: number
  ) => {
    // Here we don't care about cameraPosition or tiles
    context.globalAlpha = Math.max(this.timeUntilDismiss, 0) / this.initialTime;
    context.font = MESSAGE_FONT;
    context.textAlign = "center";
    // TODO change font color
    context.fillStyle = "blue";
    context.fillText(this.message, this.location.x, this.location.y);
    context.globalAlpha = 1;
  };

  shouldDismiss = (): Boolean => this.timeUntilDismiss <= 0;

  runCycle = (dt: number) => {
    this.timeUntilDismiss -= dt;
  };
}
