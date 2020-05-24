import Renderer from "<src>/classes/Renderer";
import MockGameGenerator from "<src>/classes/Game";
import {
  CAMERA_SPEED,
  MAX_ZOOM,
  MIN_ZOOM,
  BASE_TILE_SIZE,
} from "<src>/constants";
import { ZoomChange } from "<src>/enums";
import { calculateCanvasDimensions } from "<src>/utils/dom";
jest.mock("<src>/utils/dom");

// also need to mock dom specific stuff - move dom specific functions to its own file

describe("Renderer", () => {
  let mockGame: MockGameGenerator;
  let renderer: Renderer;
  beforeEach(() => {
    mockGame = new MockGameGenerator();
    renderer = new Renderer(mockGame);
  });

  describe("camera update functions", () => {
    describe("updateCameraPosition", () => {
      // Based on the grid size and the window size this should restrict to certain areas
      test("window size greater than game container size", () => {
        // Set up grid size and window size
        const { width, height } = calculateCanvasDimensions();
        // based on base tile size + gametiles - set zoom level
        // Technically this could go outsize max zoom bounds - but it's easier to mock
        renderer.zoomLevel =
          Math.max(
            width / (BASE_TILE_SIZE * mockGame.gridSizeX),
            height / (BASE_TILE_SIZE * mockGame.gridSizeY)
          ) * 2;

        renderer.updateCameraPosition({
          x: -10000,
          y: -10000,
        });
        expect(renderer.cameraPosition).toEqual({ x: 0, y: 0 });

        // Set to max bounds bottom right
        renderer.updateCameraPosition({
          x: 10000000,
          y: 10000000,
        });

        expect(renderer.cameraPosition.x).toBeGreaterThan(0);
        expect(renderer.cameraPosition.y).toBeGreaterThan(0);
      });

      test("window size less than game container size", () => {
        // Should not allow camera movement
        // Set up grid size and window size
        const { width, height } = calculateCanvasDimensions();
        // based on base tile size + gametiles - set zoom level
        // Technically this could go outsize min zoom bounds - but it's easier to mock
        renderer.zoomLevel =
          Math.min(
            width / (BASE_TILE_SIZE * mockGame.gridSizeX),
            height / (BASE_TILE_SIZE * mockGame.gridSizeY)
          ) / 2;

        renderer.updateCameraPosition({
          x: 0,
          y: 0,
        });
        const { x, y } = renderer.cameraPosition;

        renderer.updateCameraPosition({
          x: -1000000,
          y: -1000000,
        });
        expect(renderer.cameraPosition).toEqual({ x, y });

        renderer.updateCameraPosition({
          x: 1000000,
          y: 1000000,
        });
        expect(renderer.cameraPosition).toEqual({ x, y });
      });
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

    test("runCycle updates the coordinates if keys are pressed depending on dt", () => {
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
      renderer.runCycle(dt);

      expect(renderer.cameraPosition).toEqual({
        x: initX + dt * CAMERA_SPEED * renderer.zoomLevel,
        y: initY + dt * CAMERA_SPEED * renderer.zoomLevel,
      });
    });
  });
});
