module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["jest-canvas-mock"],
  moduleNameMapper: {
    "^<src>/(.*)$": "<rootDir>/src/$1",
  },
};
