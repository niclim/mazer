import { debounce } from "../utils";

const setupEventListeners = (renderer) => {
  document.addEventListener("click", renderer.handleClick);

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowLeft":
      case "ArrowDown":
      case "ArrowRight":
        const key = e.key.replace(/^Arrow/, "").toLowerCase();
        renderer.handleKeyUpdate({ [key]: true });
        break;
      // hotkeys would be added here
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowLeft":
      case "ArrowDown":
      case "ArrowRight":
        const key = e.key.replace(/^Arrow/, "").toLowerCase();
        renderer.handleKeyUpdate({ [key]: false });
        break;
    }
  });

  // Update window resize
  window.addEventListener("resize", debounce(renderer.windowResize, 250));
};

export default setupEventListeners;
