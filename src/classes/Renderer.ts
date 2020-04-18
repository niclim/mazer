import { constrainToBoundary } from "../utils";
import { calculateDimensions } from "../utils/dom";
import { GAME_CONTAINER, CAMERA_SPEED } from "../constants";
import Game from "./Game";
import { Dimensions } from "../types";
// We need an image that spans the width of the game container and that is partially rendered

type Coordinates = {
  x: number;
  y: number;
};

type KeysPress = {
  up: boolean;
  left: boolean;
  right: boolean;
  down: boolean;
};

/**
 * The Renderer handles all the rendering and UI interactions
 * it communicates with a game instance and will dispatch
 * actions to the game
 *
 * Event handlers are attached on page load which triggers Renderer events
 *
 * Our reference point of 0, 0 refers to the top left corner (which means y is opposite)
 */
class Renderer {
  game: Game;
  dimensions: Dimensions;
  coordinates: Coordinates;
  keysPressed: KeysPress;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  // TODO - define this typing better
  canvasElements: any[];
  constructor(game: Game) {
    this.game = game;
    this.dimensions = calculateDimensions();
    // Center the camera in the middle of the container
    this.coordinates = {
      x: (GAME_CONTAINER.WIDTH - this.dimensions.width) / 2,
      y: (GAME_CONTAINER.HEIGHT - this.dimensions.height) / 2,
    };

    this.keysPressed = {
      up: false,
      left: false,
      right: false,
      down: false,
    };

    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvasElements = [];

    // Set stuff for the canvas
    this.canvas.id = "game";
    document.querySelector("body").prepend(this.canvas);
  }

  handleClick = (e) => {
    // this calculates the thing to be clicked and then handles the click on that item
    // passes informaiton about click location, what was clicked which game then handles
    // translate this in to the actual location on the board
    this.game.handleClick(e);
  };

  windowResize = () => {
    this.dimensions = calculateDimensions();
  };

  _updateCoordinates = ({ dx, dy }) => {
    const { x, y } = this.coordinates;
    // update on input
    this.coordinates = {
      x: constrainToBoundary("WIDTH")(x + dx, GAME_CONTAINER),
      y: constrainToBoundary("HEIGHT")(y + dy, GAME_CONTAINER),
    };
  };

  updateCameraPosition = (dt) => {
    let dx = 0;
    let dy = 0;
    if (this.keysPressed.up) dy--;
    if (this.keysPressed.down) dy++;
    if (this.keysPressed.left) dx--;
    if (this.keysPressed.right) dx++;

    dx *= CAMERA_SPEED * dt;
    dy *= CAMERA_SPEED * dt;
    this._updateCoordinates({ dx, dy });
  };

  handleKeyUpdate = (keysToUpdate) => {
    this.keysPressed = {
      ...this.keysPressed,
      ...keysToUpdate,
    };
  };

  render = () => {
    // render a single board
    // render the background
  };

  renderBackground = () => {
    // renders backgroudn with respect to coordinates
  };

  renderElement = () => {
    // renders a single element if it is in the viewport
  };
}

export default Renderer;
