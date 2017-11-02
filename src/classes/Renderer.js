import { calculateDimensions } from '../utils'

class Renderer {
  constructor(game) {
    this.game = game
    this.dimensions = calculateDimensions()

    // need to store the active objects to render ehre or get it passed through from the game object
    // Maybe something to store the coordinates
    this.canvas = document.getElementById('game')
    this.context = this.canvas.getContext('2d')
    this.canvasElements = []
  }

  handleClick(e) {
    // this calculates the thing to be clicked and then handles the click on that item
    // passes informaiton about click location, what was clicked which game then handles 
    this.game.handleClick(e)
  }

  windowResize() {
    this.dimensions = calculateDimensions()
  }

  render() {
    
  }
}

export default Renderer
