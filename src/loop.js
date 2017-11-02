const setupGameLoop = (game, renderer) => {
  let lastTime = Date.now();

  const loop = () => {
    const now = Date.now();
    const dt = Math.min((now - lastTime) / 1000.0, 0.5);
    game.runCycle(dt)
    renderer.render()

    requestAnimationFrame(loop)
  }

  loop()
}

export default setupGameLoop
