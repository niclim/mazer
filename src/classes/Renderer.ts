import { boundNumberToMinMax, calculateWindowOffset } from "<src>/utils";
import { calculateCanvasDimensions } from "<src>/utils/dom";
import {
  BASE_TILE_SIZE,
  CAMERA_SPEED,
  INIT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
} from "<src>/constants";
import HudItem from "<src>/classes/abstract/HudItem";
import Game from "<src>/classes/Game";
import Message from "<src>/classes/Message";
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
  hudItems: HudItem[];
  messages: Message[];

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
    // TODO initialize items here
    this.hudItems = [];
    this.messages = [];

    // Center the camera in the middle of the container
    this.updateCameraPosition({
      x: calculateWindowOffset(
        this.canvasDimensions.width,
        this.game.gridSizeX * this.tilePixels
      ),
      y: calculateWindowOffset(
        this.canvasDimensions.height,
        this.game.gridSizeY * this.tilePixels
      ),
    });

    // Set stuff for the canvas
    this.canvas.id = "game";
    document.querySelector("body").prepend(this.canvas);
  }

  get tilePixels(): number {
    return BASE_TILE_SIZE * this.zoomLevel;
  }

  public handleClick = (clickLocation: Coordinates): void => {
    // Check for intersection with any hud item
    for (const hudItem of this.hudItems) {
      // check for intersection
      if (hudItem.doesIntersect(clickLocation)) {
        return hudItem.triggerAction(this);
      }
    }

    // Transform this click location into the actual coordinates of the game
    const xBlock = Math.floor(
      (clickLocation.x + this.cameraPosition.x) / this.tilePixels
    );
    const yBlock = Math.floor(
      (clickLocation.y + this.cameraPosition.y) / this.tilePixels
    );
    // Should call game handle click at certain locations
    const message = this.game.handleClick({ x: xBlock, y: yBlock });

    if (message) {
      this.messages.push(
        new Message(2, message, {
          x: this.canvasDimensions.width / 2,
          y: 50,
        })
      );
    }
  };

  public windowResize = () => {
    this.canvasDimensions = calculateCanvasDimensions();
    // We actually need to set the canvas dimensions programatically - otherwise the canvas just scales
    this.canvas.width = this.canvasDimensions.width;
    this.canvas.height = this.canvasDimensions.height;
  };

  public updateCameraPosition = ({ x, y }: Coordinates) => {
    // If the window size is larger than the game container - we should not allow any camera movement
    const xGrid = this.game.gridSizeX * this.tilePixels;
    const yGrid = this.game.gridSizeY * this.tilePixels;
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

  private handleKeyScroll = (dt: number) => {
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
      this.updateCameraPosition({ x: x + dx, y: y + dy });
    }
  };

  public runCycle = (dt: number) => {
    this.handleKeyScroll(dt);
    // Handle message triggers
    this.messages.forEach((message) => message.runCycle(dt));
    this.messages = this.messages.filter((message) => !message.shouldDismiss());
  };

  public handleZoom = (zoomChange: ZoomChange) => {
    const newZoom =
      zoomChange === ZoomChange.Increase
        ? this.zoomLevel * 2
        : this.zoomLevel / 2;
    this.zoomLevel = boundNumberToMinMax(newZoom, MIN_ZOOM, MAX_ZOOM);
    // TODO This calculates middle of the view - we technically want current position by some zoom factor
    // calculate offset + change based on zoom change
    this.updateCameraPosition({
      x:
        (this.game.gridSizeX * this.tilePixels - this.canvasDimensions.width) /
        2,
      y:
        (this.game.gridSizeY * this.tilePixels - this.canvasDimensions.height) /
        2,
    });
  };

  public handleKeyUpdate = (keysToUpdate: ArrowKeysPressed) => {
    this.keysPressed = {
      ...this.keysPressed,
      ...keysToUpdate,
    };
  };

  public render = () => {
    // render a single board
    // render the background
    this.renderBackground();
    this.renderGameUnits();
    this.renderMessages();
  };

  private renderBackground = () => {
    const tilePixels = this.tilePixels;
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

  private renderGameUnits = () => {
    for (const gameUnit of this.game.getGameUnits()) {
      gameUnit.render(this.context, this.cameraPosition, this.tilePixels);
    }
  };

  private renderMessages = () => {
    for (const message of this.messages) {
      message.render(this.context, this.cameraPosition, this.tilePixels);
    }
  };
}

export default Renderer;
