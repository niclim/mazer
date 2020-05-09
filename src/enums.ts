export enum ZoomChange {
  Increase,
  Decrease,
}

export enum GridState {
  OutOfBounds, // Invalid path cannot place blocks
  InboundsUnplaceable, // Valid path but cannot place blocks
  InboundsPlaceable, // Valid path can place blocks
  Block, // Has a block placed
}
