import { calculateDimensions, constrainToBoundary } from '../utils'
import { GAME_CONTAINER } from '../constants'
/**
 * The Renderer handles all the rendering and UI interactions
 * it communicates with a game instance and will dispatch
 * actions to the game
 *
 * Event handlers are attached on page load which triggers Renderer events
 */
class Renderer {
  constructor (game) {
    this.game = game
    this.dimensions = calculateDimensions()
    // Center the camera in the middle of the container
    this.coordinates = {
      x: (GAME_CONTAINER.WIDTH - this.dimensions.x) / 2,
      y: (GAME_CONTAINER.HEIGHT - this.dimensions.y) / 2
    }

    this.keysPressed = {
      up: false,
      left: false,
      right: false,
      down: false
    }

    this.canvas = document.getElementById('game')
    this.context = this.canvas.getContext('2d')
    this.canvasElements = []
  }

  handleClick = (e) => {
    // this calculates the thing to be clicked and then handles the click on that item
    // passes informaiton about click location, what was clicked which game then handles
    // translate this in to the actual location on the board
    this.game.handleClick(e)
  }

  windowResize = () => {
    this.dimensions = calculateDimensions()
  }

  updateCoordinates = ({ dx, dy }) => {
    const { x, y } = this.coordinates
    // update on input
    this.coordinates = {
      x: constrainToBoundary('WIDTH')(x + dx),
      y: constrainToBoundary('HEIGHT')(y + dy)
    }
  }

  updateCameraPosition = (dt) => {
    // call shit here
    // to update this camera position
  }

  handleKeyUpdate = key => {
    // merge diffs and update
  }

  render = () => {
    // render a single board
    // render the background
  }

  renderBackground = () => {
    // renders backgroudn with respect to coordinates
  }

  renderElement = () => {
    // renders a single element if it is in the viewport
  }
}

export default Renderer
