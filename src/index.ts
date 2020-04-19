import Game from "<src>/classes/Game";
import Renderer from "<src>/classes/Renderer";

import setupEventListeners from "<src>/events";
import setupGameLoop from "<src>/loop";

const gameInstance = new Game();
const renderEngine = new Renderer(gameInstance);

setupEventListeners(renderEngine);
setupGameLoop(gameInstance, renderEngine);
