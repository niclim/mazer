import { boundNumberToMinMax, calculateWindowOffset } from "<src>/utils";
import { calculateCanvasDimensions } from "<src>/utils/dom";
import {
  BASE_TILE_SIZE,
  CAMERA_SPEED,
  INIT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
} from "<src>/constants";
import Game from "<src>/classes/Game";
import { Dimensions, Coordinates } from "<src>/types";
import { GridState, ZoomChange } from "<src>/enums";

export type ArrowKeysPressed = {
  up?: boolean;
  left?: boolean;
  right?: boolean;
  down?: boolean;
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
  canvasDimensions: Dimensions;
  cameraPosition: Coordinates;
  keysPressed: ArrowKeysPressed;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  zoomLevel: number;
  constructor(game: Game) {
    this.game = game;
    // dimensions refers to the canvas container size (which is defined by window size)
    this.canvasDimensions = calculateCanvasDimensions();

    this.keysPressed = {
      up: false,
      left: false,
      right: false,
      down: false,
    };

    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    // We actually need to set the canvas dimensions programatically - otherwise the canvas just scales
    this.canvas.width = this.canvasDimensions.width;
    this.canvas.height = this.canvasDimensions.height;
    this.zoomLevel = INIT_ZOOM;

    // Center the camera in the middle of the container
    this._updateCameraPosition({
      x: calculateWindowOffset(
        this.canvasDimensions.width,
        this.game.gridSizeX * BASE_TILE_SIZE * this.zoomLevel
      ),
      y: calculateWindowOffset(
        this.canvasDimensions.height,
        this.game.gridSizeY * BASE_TILE_SIZE * this.zoomLevel
      ),
    });

    // Set stuff for the canvas
    this.canvas.id = "game";
    document.querySelector("body").prepend(this.canvas);
  }

  handleClick = (e: MouseEvent) => {
    // this calculates the thing to be clicked and then handles the click on that item
    // passes informaiton about click location, what was clicked which game then handles
    // translate this in to the actual location on the board
    // this.game.handleClick(e);
  };

  windowResize = () => {
    this.canvasDimensions = calculateCanvasDimensions();
    // We actually need to set the canvas dimensions programatically - otherwise the canvas just scales
    this.canvas.width = this.canvasDimensions.width;
    this.canvas.height = this.canvasDimensions.height;
  };

  _updateCameraPosition = ({ x, y }: Coordinates) => {
    // If the window size is larger than the game container - we should not allow any camera movement
    const xGrid = this.game.gridSizeX * BASE_TILE_SIZE * this.zoomLevel;
    const yGrid = this.game.gridSizeY * BASE_TILE_SIZE * this.zoomLevel;
    const xDiff = xGrid - this.canvasDimensions.width;
    const yDiff = yGrid - this.canvasDimensions.height;

    this.cameraPosition = {
      x: boundNumberToMinMax(
        x,
        xDiff > 0 ? 0 : xDiff / 2,
        xDiff > 0 ? xDiff : xDiff / 2
      ),
      y: boundNumberToMinMax(
        y,
        yDiff > 0 ? 0 : yDiff / 2,
        yDiff > 0 ? yDiff : yDiff / 2
      ),
    };
  };

  handleKeyScroll = (dt: number) => {
    let dx = 0;
    let dy = 0;
    if (this.keysPressed.up) dy--;
    if (this.keysPressed.down) dy++;
    if (this.keysPressed.left) dx--;
    if (this.keysPressed.right) dx++;

    dx *= CAMERA_SPEED * this.zoomLevel * dt;
    dy *= CAMERA_SPEED * this.zoomLevel * dt;
    if (dx !== 0 || dy !== 0) {
      const { x, y } = this.cameraPosition;
      this._updateCameraPosition({ x: x + dx, y: y + dy });
    }
  };

  handleZoom = (zoomChange: ZoomChange) => {
    const newZoom =
      zoomChange === ZoomChange.Increase
        ? this.zoomLevel * 2
        : this.zoomLevel / 2;
    this.zoomLevel = boundNumberToMinMax(newZoom, MIN_ZOOM, MAX_ZOOM);
    // TODO This calculates middle of the view - we technically want current position by some zoom factor
    // calculate offset + change based on zoom change
    this._updateCameraPosition({
      x:
        (this.game.gridSizeX * BASE_TILE_SIZE * this.zoomLevel -
          this.canvasDimensions.width) /
        2,
      y:
        (this.game.gridSizeY * BASE_TILE_SIZE * this.zoomLevel -
          this.canvasDimensions.height) /
        2,
    });
  };

  handleKeyUpdate = (keysToUpdate: ArrowKeysPressed) => {
    this.keysPressed = {
      ...this.keysPressed,
      ...keysToUpdate,
    };
  };

  render = () => {
    // render a single board
    // render the background
    this.renderBackground();
    this.renderGameUnits();
  };

  renderBackground = () => {
    const tilePixels = BASE_TILE_SIZE * this.zoomLevel;
    const { width, height } = this.canvasDimensions;
    const { x, y } = this.cameraPosition;
    // Start from camera position to canvasDimension size
    for (let i = 0; i <= width / tilePixels + 1; i++) {
      for (let j = 0; j <= height / tilePixels + 1; j++) {
        const xBlock = Math.floor(x / tilePixels) + i;
        const yBlock = Math.floor(y / tilePixels) + j;
        const gameBlock = this.game.getBlock(xBlock, yBlock);
        // render based on game block, for now lets just render different colors
        switch (gameBlock.state) {
          case GridState.Block:
            this.context.fillStyle = "blue";
            break;
          case GridState.OutOfBounds:
            this.context.fillStyle = "black";
            break;
          case GridState.InboundsUnplaceable:
            this.context.fillStyle = "gray";
            break;
          case GridState.InboundsPlaceable:
            this.context.fillStyle = "green";
            break;
        }
        this.context.fillRect(
          xBlock * tilePixels - x,
          yBlock * tilePixels - y,
          tilePixels,
          tilePixels
        );
      }
    }
  };

  renderGameUnits = () => {
    const tilePixels = BASE_TILE_SIZE * this.zoomLevel;
    for (const gameUnit of this.game.getGameUnits()) {
      gameUnit.render(this.context, this.cameraPosition, tilePixels);
    }
  };
}

export default Renderer;
