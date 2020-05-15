import once from "lodash.once";

import { RUNNER_SPEED } from "<src>/constants";
import { Coordinates, Grid, Path } from "<src>/types";
import { boundNumberToMinMax } from "<src>/utils";
import { findPath } from "<src>/utils/path";
import GameUnit from "<src>/classes/GameUnit";

export type CompletionFn = (identifier: string) => void;

export default class Runner extends GameUnit {
  identifier: string;
  private path: Path;
  private currentPosition: number;
  private progressToNext: number; // float between 0 and 1
  private completionFn: CompletionFn;
  constructor(
    identifier: string,
    grid: Grid,
    start: Coordinates,
    end: Coordinates,
    completionFn: CompletionFn
  ) {
    super();
    this.identifier = identifier;
    this.path = findPath(grid, start, end);
    if (!this.path) {
      throw new Error("Unable to find a valid path");
    }
    this.currentPosition = 0;
    this.progressToNext = 0;
    // Handle multiple calls - the completion function should ideally
    // remove this class
    this.completionFn = once(completionFn);
  }

  private _isCompleted = (): boolean => {
    return this.currentPosition >= this.path.length - 1;
  };

  private _getPartialPositionDiff = (): Coordinates => {
    // If at the end, we should return 0/0
    if (this._isCompleted()) {
      return { x: 0, y: 0 };
    }

    const dx =
      (this.path[this.currentPosition + 1].x -
        this.path[this.currentPosition].x) *
      this.progressToNext;
    const dy =
      (this.path[this.currentPosition + 1].y -
        this.path[this.currentPosition].y) *
      this.progressToNext;

    return {
      x: boundNumberToMinMax(dx, -1, 1),
      y: boundNumberToMinMax(dy, -1, 1),
    };
  };

  public runCycle = (dt: number) => {
    const moveDistance = RUNNER_SPEED * dt;
    this.progressToNext += moveDistance;
    while (this.progressToNext >= 1) {
      this.progressToNext--;
      if (this.currentPosition >= this.path.length) {
        this.completionFn(this.identifier);
      } else {
        this.currentPosition++;
      }
    }
  };

  public render = (
    context: CanvasRenderingContext2D,
    cameraPosition: Coordinates,
    tilePixels: number
  ) => {
    if (this._isCompleted()) {
      return;
    }

    const { x: dx, y: dy } = this._getPartialPositionDiff();
    const absolutePosition = {
      x:
        (this.path[this.currentPosition].x + dx) * tilePixels -
        cameraPosition.x,
      y:
        (this.path[this.currentPosition].y + dy) * tilePixels -
        cameraPosition.y,
    };
    context.fillStyle = "purple";
    context.fillRect(
      absolutePosition.x,
      absolutePosition.y,
      tilePixels,
      tilePixels
    );
  };
}
