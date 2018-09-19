const vm = require("vm");
const fs = require("fs");
const plugins = require("./helpers/plugins");
const transform = require("./helpers/transform");
const wrapLegacyDecorators = require("./helpers/wrap-legacy-decorators");

const decOpts = { decoratorsBeforeExport: true };

describe("behavior", () => {
  const files = fs.readdirSync(`${__dirname}/plugin-fixtures`);

  for (const file of files) {
    const code = fs.readFileSync(`${__dirname}/plugin-fixtures/${file}`, "utf-8");
    const compiledLegacyCode = transform(code, [
      [plugins.proposalDecorators, { legacy: true }],
      [plugins.proposalClassProperties, { loose: true }]
    ]);
    const compiledModernCode = transform(wrapLegacyDecorators(code, decOpts), [
      [plugins.proposalDecorators, decOpts],
      plugins.proposalClassProperties
    ]);

    it(file + " - legacy", () => {
      vm.runInNewContext(compiledLegacyCode, { expect });
    });

    it(file + " - wrapped", () => {
      vm.runInNewContext(compiledModernCode, { expect });
    });
  }
});
