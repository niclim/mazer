import Renderer from "<src>/classes/Renderer";
import MockGameGenerator from "<src>/classes/Game";
import { CAMERA_SPEED } from "<src>/constants";
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
    test("should have ", () => {});
  });

  describe("camera update functions", () => {
    describe("_updateCameraPosition", () => {
      // Based on the grid size and the window size this should restrict to certain areas
    });

    describe("handleKeyScroll", () => {
      test("updates the coordinates if keys are pressed depending on dt", () => {
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

  describe("render functions", () => {});
});
