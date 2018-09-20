const babel = require("@babel/core");

module.exports = function transform(code, plugins, babelOptions) {
  return babel.transformSync(
    code,
    Object.assign({ plugins, configFile: false }, babelOptions)
  ).code;
};
