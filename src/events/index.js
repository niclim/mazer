const setupEventListeners = game => {
  document.addEventListener('click', e => {
    if (e.target === '') { // If the click target is the canvas
      // Trigger out the game.handleclick
    } else {

    }
  })

  document.addEventListener('keydown', () => {
    
  })
}

export default setupEventListeners
