import Game from './classes/Game'
import Renderer from './classes/Renderer'

import setupEventListeners from './events'
import setupGameLoop from './loop'

const gameInstance = new Game()
const renderEngine = new Renderer(gameInstance)

setupEventListeners(gameInstance)
setupGameLoop(gameInstance, renderEngine)
