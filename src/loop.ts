import Game from "<src>/classes/Game";
import Renderer from "<src>/classes/Renderer";

const setupGameLoop = (game: Game, renderer: Renderer): void => {
  let lastTime = Date.now();

  const loop = () => {
    const now = Date.now();
    const dt = Math.min((now - lastTime) / 1000.0, 0.5);
    lastTime = now;
    game.runCycle(dt);
    renderer.runCycle(dt);
    renderer.render();

    window.requestAnimationFrame(loop);
  };

  loop();
};

export default setupGameLoop;
