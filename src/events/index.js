import { debounce } from '../utils'

const setupEventListeners = (renderer) => {
  document.addEventListener('click', renderer.handleClick)

  document.addEventListener('keydown', () => {
    // can update the camera position here
  })

  // Update window resize
  window.addEventListener('resize', debounce(renderer.windowResize, 250))
}

export default setupEventListeners
