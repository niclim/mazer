import debounce from "lodash.debounce";
import Renderer, { KeysPress } from "<src>/classes/Renderer";
import { ZoomChange } from "<src>/enums";

const setupEventListeners = (renderer: Renderer) => {
  document.addEventListener("click", renderer.handleClick);

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowLeft":
      case "ArrowDown":
      case "ArrowRight":
        const key = e.key.replace(/^Arrow/, "").toLowerCase();
        renderer.handleKeyUpdate({ [key]: true } as KeysPress);
        break;
      case "=":
      case "+":
        renderer.handleZoom(ZoomChange.Increase);
        break;
      case "-":
      case "_":
        renderer.handleZoom(ZoomChange.Decrease);
        break;
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowLeft":
      case "ArrowDown":
      case "ArrowRight":
        const key = e.key.replace(/^Arrow/, "").toLowerCase();
        renderer.handleKeyUpdate({ [key]: false } as KeysPress);
        break;
    }
  });

  // Update window resize
  window.addEventListener("resize", debounce(renderer.windowResize, 250));
};

export default setupEventListeners;
