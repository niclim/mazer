import debounce from "lodash.debounce";
import Renderer, { ArrowKeysPressed } from "<src>/classes/Renderer";
import { ZoomChange } from "<src>/enums";

const setupEventListeners = (renderer: Renderer) => {
  document.addEventListener("click", (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const target = e.target as Element;
    if (target.tagName === "CANVAS" && target.id === "game") {
      const rect = target.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      renderer.handleClick({ x, y });
    }
  });

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowLeft":
      case "ArrowDown":
      case "ArrowRight":
        const key = e.key.replace(/^Arrow/, "").toLowerCase();
        renderer.handleKeyUpdate({ [key]: true } as ArrowKeysPressed);
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
        renderer.handleKeyUpdate({ [key]: false } as ArrowKeysPressed);
        break;
    }
  });

  // Update window resize
  window.addEventListener("resize", debounce(renderer.windowResize, 250));
};

export default setupEventListeners;
