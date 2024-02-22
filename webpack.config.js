const path = require('path');
module.exports = {
  mode: 'development',
  watch: true,
  entry: "./src/script.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, './dist'),
  }
}