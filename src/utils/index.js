const aspectRatio = 1.4 // width / height

export const calculateDimensions = () => {
  return { width: window.screen.availWidth, height: window.screen.availHeight }
}

export const debounce = (func, wait, immediate) => {
  let timeout
  return () => {
    const later = () => {
      timeout = null
      if (!immediate) { func.apply(context, args) }
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) { func.apply(context, args) }
  }
}