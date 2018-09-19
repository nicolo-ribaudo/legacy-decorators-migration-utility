const babel = require("@babel/core");

module.exports = function transform(code, plugins) {
  return babel.transformSync(code, { plugins, configFile: false }).code;
};
