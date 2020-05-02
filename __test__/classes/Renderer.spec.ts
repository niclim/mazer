import Renderer from "<src>/classes/Renderer";
import MockGameGenerator from "<src>/classes/Game";
import { CAMERA_SPEED, MAX_ZOOM, MIN_ZOOM } from "<src>/constants";
import { ZoomChange } from "<src>/enums";
jest.mock("<src>/utils/dom");

// also need to mock dom specific stuff - move dom specific functions to its own file

describe("Renderer", () => {
  let mockGame: MockGameGenerator;
  let renderer: Renderer;
  beforeEach(() => {
    mockGame = new MockGameGenerator();
    renderer = new Renderer(mockGame);
  });

  describe("initialization", () => {
    test("should center camera position", () => {
      // todo
    });
  });

  describe("camera update functions", () => {
    test("_updateCameraPosition", () => {
      // Based on the grid size and the window size this should restrict to certain areas
    });

    test("handleZoomChange", () => {
      renderer.zoomLevel = MAX_ZOOM;
      // Should not go above max zoom
      renderer.handleZoom(ZoomChange.Increase);
      expect(renderer.zoomLevel).toBe(MAX_ZOOM);

      renderer.handleZoom(ZoomChange.Decrease);
      expect(renderer.zoomLevel).toBe(MAX_ZOOM / 2);
      // TODO test centering camera on zoom on current location

      renderer.zoomLevel = MIN_ZOOM;
      // Should not go below min zoom
      renderer.handleZoom(ZoomChange.Decrease);
      expect(renderer.zoomLevel).toBe(MIN_ZOOM);

      renderer.handleZoom(ZoomChange.Increase);
      expect(renderer.zoomLevel).toBe(MIN_ZOOM * 2);
      // TODO test centering camera on zoom on current location
    });

    test("handleKeyScroll updates the coordinates if keys are pressed depending on dt", () => {
      // set to certain coordinates
      const initX = 0;
      const initY = 0;
      renderer.cameraPosition = {
        x: initX,
        y: initY,
      };
      // update the current key position
      renderer.handleKeyUpdate({
        down: true,
        right: true,
      });

      // takes in a dt which is related to the CAMERA_SPEED constant
      const dt = 0.01;
      renderer.handleKeyScroll(dt);

      expect(renderer.cameraPosition).toEqual({
        x: initX + dt * CAMERA_SPEED * renderer.zoomLevel,
        y: initY + dt * CAMERA_SPEED * renderer.zoomLevel,
      });
    });
  });
});
