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

  handleClick(e) {}

  runCycle(dt) {}
}

export default Game;
