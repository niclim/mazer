import { GridState } from "<src>/enums";

export type Coordinates = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type GridBlock = {
  state: GridState;
  x: number;
  y: number;
};

export type Grid = GridBlock[][];

export type Path = Coordinates[];
