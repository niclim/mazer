import { getBackgroundTile } from "<src>/background";
import {
  boundNumberToMinMax,
  constrainToBoundary,
  constrainToGameBlock,
} from "<src>/utils";
import { calculateDimensions } from "<src>/utils/dom";
import {
  GAME_CONTAINER,
  CAMERA_SPEED,
  BLOCK_SIZE,
  MAX_ZOOM,
  INIT_ZOOM,
} from "<src>/constants";
import Game from "<src>/classes/Game";
import { Dimensions, Coordinates } from "<src>/types";
import { Dimension, ZoomChange } from "<src>/enums";

export type KeysPress = {
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
  zoomLevel: number;
  // TODO - define this typing better
  canvasElements: any[];
  constructor(game: Game) {
    this.game = game;
    // dimensions refers to the canvas container size (which is defined by window size)
    this.dimensions = calculateDimensions();
    // Center the camera in the middle of the container
    this.coordinates = {
      x: (GAME_CONTAINER.width - this.dimensions.width) / 2,
      y: (GAME_CONTAINER.height - this.dimensions.height) / 2,
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
    this.zoomLevel = INIT_ZOOM;

    // Set stuff for the canvas
    this.canvas.id = "game";
    document.querySelector("body").prepend(this.canvas);
  }

  handleClick = (e: MouseEvent) => {
    // this calculates the thing to be clicked and then handles the click on that item
    // passes informaiton about click location, what was clicked which game then handles
    // translate this in to the actual location on the board
    this.game.handleClick(e);
  };

  windowResize = () => {
    this.dimensions = calculateDimensions();
  };

  _updateCoordinates = ({ x: dx, y: dy }: Coordinates) => {
    const { x, y } = this.coordinates;
    // update on input
    this.coordinates = {
      x: constrainToBoundary(Dimension.Width)(x + dx, GAME_CONTAINER),
      y: constrainToBoundary(Dimension.Height)(y + dy, GAME_CONTAINER),
    };
  };

  updateCameraPosition = (dt: number) => {
    let dx = 0;
    let dy = 0;
    if (this.keysPressed.up) dy--;
    if (this.keysPressed.down) dy++;
    if (this.keysPressed.left) dx--;
    if (this.keysPressed.right) dx++;

    dx *= CAMERA_SPEED * dt;
    dy *= CAMERA_SPEED * dt;
    this._updateCoordinates({ x: dx, y: dy });
  };

  handleZoom = (zoomChange: ZoomChange) => {
    const newZoom =
      zoomChange === ZoomChange.Increase
        ? this.zoomLevel * 2
        : this.zoomLevel / 2;
    this.zoomLevel = boundNumberToMinMax(newZoom, 1, MAX_ZOOM);
  };

  handleKeyUpdate = (keysToUpdate: KeysPress) => {
    this.keysPressed = {
      ...this.keysPressed,
      ...keysToUpdate,
    };
  };

  render = () => {
    // render a single board
    // render the background
    this.context.scale(this.zoomLevel, this.zoomLevel);
    this.renderBackground();
  };

  renderBackground = () => {
    // Get top left -> render in viewport
    const { x, y } = constrainToGameBlock(this.coordinates);
    // render top left tile to bottom right (adding an extra)
    for (let i = 0; i <= GAME_CONTAINER.width / BLOCK_SIZE; i++) {
      for (let j = 0; j <= GAME_CONTAINER.height / BLOCK_SIZE; j++) {
        const tile = getBackgroundTile(i + x / BLOCK_SIZE, j + y / BLOCK_SIZE);
        // TODO change this to add in an image
        this.context.fillStyle = tile.color;
        this.context.fillRect(
          i * BLOCK_SIZE,
          j * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  };

  renderElement = () => {
    // renders a single element if it is in the viewport
  };
}

export default Renderer;
