const plugins = require("./plugins");
const transform = require("./transform");

module.exports = function wrapLegacyDecorators(code, options = {}) {
  return transform(code, [
    [plugins.wrapLegacyDecorators, options],
    plugins.syntaxClassProperties,
  ]);
};
