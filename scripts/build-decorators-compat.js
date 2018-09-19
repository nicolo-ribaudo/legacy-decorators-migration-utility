"use strict";

const fs = require("fs");
const babel = require("@babel/core");
const presetEnv = require("@babel/preset-env");

const buildHelper = require("../packages/babel-plugin-wrap-legacy-decorators/src/helper");

const id = babel.types.identifier("decoratorsCompat");
const helper = babel.types.program([buildHelper({ ID: id })]);

const code = babel.transformFromAstSync(helper, undefined, {
  configFile: false,
  presets: [presetEnv],
}).code;

const esm = `\
export default decoratorsCompat;

${code}
`;
const cjs = `\
${""/* Use an intermediate function because decoratorsCompat gets overwritten*/}
module.exports = function (decorators) {
  return decoratorsCompat(decorators);
};

${code}
`;

fs.writeFileSync(`${__dirname}/../packages/decorators-compat/index.esm.js`, esm);
fs.writeFileSync(`${__dirname}/../packages/decorators-compat/index.cjs.js`, cjs);
