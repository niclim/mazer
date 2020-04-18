import Game from "./classes/Game";
import Renderer from "./classes/Renderer";

import setupEventListeners from "./events";
import setupGameLoop from "./loop";

const gameInstance = new Game();
const renderEngine = new Renderer(gameInstance);

setupEventListeners(renderEngine);
setupGameLoop(gameInstance, renderEngine);
