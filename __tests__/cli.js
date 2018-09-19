"use strict";

const shelljs = require("shelljs");

describe("cli", () => {
  it("works", () => {
    shelljs.cd(__dirname);
    shelljs.cd("cli-fixtures/01");
    const out = shelljs.exec("node ../../../packages/wrap-legacy-decorators/src/index.js index.js --decorators-before-export --external-helpers");

    expect(out.toString()).toMatchSnapshot();
  });
});
