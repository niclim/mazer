import { GridState } from "<src>/enums";

// UI / rendering constants
export const CAMERA_SPEED = 400;
export const BASE_TILE_SIZE = 25;
export const MAX_ZOOM = 8;
export const MIN_ZOOM = 1;
export const INIT_ZOOM = 2;
export const MESSAGE_FONT = "40pt Droid Sans";

// Game related constants
export const NUM_INITIAL_BLOCKS = 15;
export const MAX_RETRIES_BLOCK_PLACEMENT = 50;
export const PATHABLE_STATE = [
  GridState.InboundsPlaceable,
  GridState.InboundsUnplaceable,
];
export const RUNNER_SPEED = 5; // px per second
