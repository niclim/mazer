class Game {
  // TODO change this
  monsters: any[];
  blocks: any[];
  clickState?: string;
  constructor() {
    this.monsters = [];
    this.blocks = [];
    this.clickState = null;
  }

  // tslint:disable-next-line
  handleClick(e) {}

  // tslint:disable-next-line
  runCycle(dt) {}
}

export default Game;
