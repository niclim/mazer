const path = require("path");

const config = {
  entry: ["./src/index.ts"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "app.js",
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" },
    ],
  },
};

module.exports = config;
