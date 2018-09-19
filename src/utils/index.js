export const calculateDimensions = () => {
  return { width: window.innerWidth, height: window.innerHeight }
}

// helper function to constrain camera to side
// could go to bottom right and it will show black, will need to fix this
export const constrainToBoundary = (direction) => (val, GAME_CONTAINER) =>
  Math.min(
    Math.max(val, 0),
    GAME_CONTAINER[direction]
  )

export const debounce = (func, wait, immediate) => {
  let timeout
  return (...args) => {
    const later = () => {
      timeout = null
      if (!immediate) { func.apply(this, args) }
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) { func.apply(this, args) }
  }
}
