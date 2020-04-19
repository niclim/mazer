// TODO change this to image / sprite
class Tile {
  color: string;
  constructor(color: string) {
    this.color = color;
  }
}
// returns a 25x25 tile to render
// x y an int (not a coordinate)
export const getBackgroundTile = (x: number, y: number): Tile => {
  const color = ((x % 2) + y) % 2 === 0 ? "#FF9AA2" : "#FFB7B2";
  // TODO - handle out of bounds case
  return new Tile(color);
};
