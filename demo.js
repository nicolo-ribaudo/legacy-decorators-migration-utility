const babel = require("@babel/core");
const decorators = require("@babel/plugin-proposal-decorators");
const plugin = require("./packages/babel-plugin-wrap-legacy-decorators");

const code = `
  function dec(target, key, desc) {
    desc.value = () => 2;
  }

  class Foo {
    @dec
    method() {}
  }

  console.log(new Foo().method());
`;

const code1 = babel.transformSync(code, { configFile: false, plugins: [plugin] }).code;

const out1 = babel.transformSync(
  code1,
  {
    configFile: false,
    plugins: [[decorators, { decoratorsBeforeExport: false }]]
  }
).code;

const out2 = babel.transformSync(code, {
  configFile: false,
  plugins: [[decorators, { legacy: true }]]
}).code;

console.log("-- WITH PLUGIN --\n\n");
//console.log(out1, "\n\n --- \n\n");
eval(out1);

console.log("\n\n-- WITHOUT --\n\n");
//console.log(out2, "\n\n --- \n\n");
eval(out2);
