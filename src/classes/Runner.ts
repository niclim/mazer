import once from "lodash.once";

import { RUNNER_SPEED } from "<src>/constants";
import { Coordinates, Grid, Path } from "<src>/types";
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

  runCycle(dt: number) {
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
  }

  render() {
    // TODO
    // return x y offset from absolute zero + way to render?
  }
}
